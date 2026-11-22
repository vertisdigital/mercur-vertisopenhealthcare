import { ProductListingSkeleton } from "@/components/organisms/ProductListingSkeleton/ProductListingSkeleton"
import { getCategoryByHandle } from "@/lib/data/categories"
import { Suspense } from "react"
import Image from "next/image"

import type { Metadata } from "next"
import { Breadcrumbs } from "@/components/atoms"
import { AlgoliaProductsListing, ProductListing } from "@/components/sections"
import { notFound } from "next/navigation"
import isBot from "@/lib/helpers/isBot"
import { headers } from "next/headers"
import Script from "next/script"
import { getRegion, listRegions } from "@/lib/data/regions"
import { listProducts } from "@/lib/data/products"
import { toHreflang } from "@/lib/helpers/hreflang"

export const revalidate = 60

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; locale: string }>
}): Promise<Metadata> {
  const { category: categoryHandle, locale } = await params
  const headersList = await headers()
  const host = headersList.get("host")
  const protocol = headersList.get("x-forwarded-proto") || "https"
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `${protocol}://${host}`

  const cat = await getCategoryByHandle(categoryHandle)
  if (!cat) {
    return {}
  }

  let languages: Record<string, string> = {}
  try {
    const regions = await listRegions()
    const locales = Array.from(
      new Set(
        (regions || []).flatMap((r) => r.countries?.map((c) => c.iso_2) || [])
      )
    ) as string[]
    languages = locales.reduce<Record<string, string>>((acc, code) => {
      acc[toHreflang(code)] = `${baseUrl}/${code}/categories/${categoryHandle}`
      return acc
    }, {})
  } catch {
    languages = {
      [toHreflang(locale)]: `${baseUrl}/${locale}/categories/${categoryHandle}`,
    }
  }

  const title = `${cat.name} Category`
  const description = `${cat.name} Category - ${
    process.env.NEXT_PUBLIC_SITE_NAME || "Storefront"
  }`
  const canonical = `${baseUrl}/${locale}/categories/${categoryHandle}`

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        ...languages,
        "x-default": `${baseUrl}/categories/${categoryHandle}`,
      },
    },
    robots: { index: true, follow: true },
    openGraph: {
      title: `${title} | ${process.env.NEXT_PUBLIC_SITE_NAME || "Storefront"}`,
      description,
      url: canonical,
      siteName: process.env.NEXT_PUBLIC_SITE_NAME || "Storefront",
      type: "website",
    },
  }
}

const ALGOLIA_ID = process.env.NEXT_PUBLIC_ALGOLIA_ID
const ALGOLIA_SEARCH_KEY = process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY

async function Category({
  params,
  searchParams,
}: {
  params: Promise<{
    category: string
    locale: string
  }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { category: categoryHandle, locale } = await params
  const resolvedSearchParams = await searchParams

  const category = await getCategoryByHandle(categoryHandle)

  if (!category) {
    return notFound()
  }
  const currency_code = (await getRegion(locale))?.currency_code || "usd"
  const ua = (await headers()).get("user-agent") || ""
  const bot = isBot(ua)

  const breadcrumbsItems = [
    {
      path: categoryHandle,
      label: category.name,
    },
  ]

  // Small cached list for JSON-LD itemList
  const headersList = await headers()
  const host = headersList.get("host")
  const protocol = headersList.get("x-forwarded-proto") || "https"
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `${protocol}://${host}`
  const categoryIds = [
    category.id,
    ...(category.category_children?.map((c) => c.id) || []),
  ]

  const {
    response: { products: jsonLdProducts },
  } = await listProducts({
    countryCode: locale,
    queryParams: { limit: 8, order: "created_at", fields: "id,title,handle" },
    category_id: categoryIds,
  })

  const itemList = jsonLdProducts.slice(0, 8).map((p, idx) => ({
    "@type": "ListItem",
    position: idx + 1,
    url: `${baseUrl}/${locale}/products/${p.handle}`,
    name: p.title,
  }))

  return (
    <main className="container">
      {categoryHandle === 'caregivers-training-ctg' && (
        <div className="relative w-full rounded-2xl overflow-hidden mb-6 border border-amber-200 shadow-xs bg-[#fbf8ee]">
          <div className="relative w-full aspect-[21/6] min-h-[160px] max-h-[260px] flex items-center justify-center">
            <Image
              src="https://training-healthcare.vertis.digital/assets/jumbotron.svg"
              alt="Empower your Caregiving Journey"
              fill
              priority
              className="object-contain object-center pointer-events-none"
            />
            <div className="relative z-10 text-center px-4">
              <h2 className="text-xl md:text-3xl lg:text-4xl font-extrabold text-[#e05626] mb-1">
                Empower your Caregiving Journey
              </h2>
              <p className="text-xs md:text-sm lg:text-base font-semibold text-gray-700">
                Learn, Grow, Care
              </p>
            </div>
            <a
              href="https://training-healthcare.vertis.digital/assets/Catalogue.pdf"
              target="_blank"
              rel="noreferrer"
              className="absolute bottom-2.5 right-3 z-10 text-[10px] md:text-[11px] font-bold text-gray-700 hover:text-[#e05626] bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded shadow-xs transition-colors hidden sm:flex items-center gap-1"
            >
              <span>📥</span>
              <span>Download Full Training Catalogue (PDF)</span>
            </a>
          </div>
        </div>
      )}
      <Script
        id="ld-breadcrumbs-category"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: category.name,
                item: `${baseUrl}/${locale}/categories/${categoryHandle}`,
              },
            ],
          }),
        }}
      />
      <Script
        id="ld-itemlist-category"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            itemListElement: itemList,
          }),
        }}
      />
      <div className="hidden md:block mb-2">
        <Breadcrumbs items={breadcrumbsItems} />
      </div>

      <h1 className="heading-xl uppercase">{category.name}</h1>

      <Suspense fallback={<div data-testid="category-page-loading"><ProductListingSkeleton /></div>}>
        {bot || !ALGOLIA_ID || !ALGOLIA_SEARCH_KEY ? (
          <ProductListing category_id={categoryIds} showSidebar locale={locale} searchParams={resolvedSearchParams} />
        ) : (
          <AlgoliaProductsListing
            category_id={category.id}
            locale={locale}
            currency_code={currency_code}
          />
        )}
      </Suspense>
    </main>
  )
}

export default Category
