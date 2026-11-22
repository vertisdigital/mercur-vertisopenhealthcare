import {
  HomeCategories,
  HomeProductSection,
} from "@/components/sections"
import { HealthcareTrustBar } from "@/components/sections/HealthcareTrustBar/HealthcareTrustBar"
import { VertisPortalBanners } from "@/components/sections/VertisPortalBanners/VertisPortalBanners"
import { OfficialBrandMalls } from "@/components/sections/OfficialBrandMalls/OfficialBrandMalls"

import type { Metadata } from "next"
import { headers } from "next/headers"
import Script from "next/script"
import { listRegions } from "@/lib/data/regions"
import { toHreflang } from "@/lib/helpers/hreflang"
import Link from "next/link"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params

  const headersList = await headers()
  const host = headersList.get("host")
  const protocol = headersList.get("x-forwarded-proto") || "https"
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `${protocol}://${host}`

  let languages: Record<string, string> = {}
  try {
    const regions = await listRegions()
    const locales = Array.from(
      new Set(
        (regions || [])
          .map((r) => r.countries?.map((c) => c.iso_2) || [])
          .flat()
          .filter(Boolean)
      )
    ) as string[]

    languages = locales.reduce<Record<string, string>>((acc, code) => {
      const hrefLang = toHreflang(code)
      acc[hrefLang] = `${baseUrl}/${code}`
      return acc
    }, {})
  } catch {
    languages = { [toHreflang(locale)]: `${baseUrl}/${locale}` }
  }

  const title = "Vertis Open Healthcare Platform | SMF Consumables Marketplace"
  const description =
    "Singapore's trusted open healthcare marketplace for unsubsidised and SMF-eligible medical consumables, senior care nutrition, and diagnostic devices."
  const canonical = `${baseUrl}/${locale}`

  return {
    title,
    description,
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical,
      languages: {
        ...languages,
        "x-default": baseUrl,
      },
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "Vertis Open Healthcare Platform",
      type: "website",
    },
  }
}

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  const headersList = await headers()
  const host = headersList.get("host")
  const protocol = headersList.get("x-forwarded-proto") || "https"
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `${protocol}://${host}`
  const siteName = "Vertis Open Healthcare Platform"

  return (
    <main className="flex flex-col w-full text-gray-900 bg-[#fafafa]">
      {/* Organization JSON-LD */}
      <Script
        id="ld-org"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: siteName,
            url: `${baseUrl}/${locale}`,
            logo: `${baseUrl}/vertis-logo.png`,
          }),
        }}
      />

      {/* 1. Shopee-style Trust Bar */}
      <HealthcareTrustBar />

      <div className="max-w-7xl mx-auto w-full px-4 lg:px-8 py-4 space-y-6">
        {/* 2. Vertis Healthcare Callout Banners */}
        <VertisPortalBanners />

        {/* 3. Shopee Mall Official Healthcare Brands */}
        <OfficialBrandMalls />

        {/* 4. Shopee Flash Picks / Popular SMF Consumables */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-xl">🔥</span>
              <h3 className="text-xl md:text-2xl font-extrabold text-gray-900 uppercase tracking-tight">
                Senior Care Essentials • Popular Picks
              </h3>
            </div>
            <Link
              href="/categories"
              className="text-xs md:text-sm font-semibold text-[#e05626] hover:underline"
            >
              Browse All 12 Items →
            </Link>
          </div>

          <HomeProductSection
            heading=""
            locale={locale}
            home
          />
        </div>

        {/* 5. Shop by Care Need (Categories) */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-6 shadow-xs mb-8">
          <HomeCategories heading="SHOP BY CARE NEED" />
        </div>
      </div>
    </main>
  )
}
