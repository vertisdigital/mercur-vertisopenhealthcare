import { HttpTypes } from "@medusajs/types"

import NotFound from "@/app/not-found"
import { ProductDetailsHeader } from "@/components/cells/ProductDetailsHeader/ProductDetailsHeader"
import { ProductDetailsSeller } from "@/components/cells/ProductDetailsSeller/ProductDetailsSeller"
import LocalizedClientLink from "@/components/molecules/LocalizedLink/LocalizedLink"
import { ProductCard } from "@/components/organisms/ProductCard/ProductCard"
import { ArrowLeftIcon, BoxIcon, CheckCircleIcon, RepeatIcon } from "@/components/silver/Icons"
import { ProductImages } from "@/components/silver/pdp/ProductImages"
import { retrieveCustomer } from "@/lib/data/customer"
import { listOffers } from "@/lib/data/offers"
import { listProducts } from "@/lib/data/products"
import { getBuyboxWinner, rankOffers, StoreOffer } from "@/lib/helpers/buybox"
import { isRichText, sanitizeRichText } from "@/lib/helpers/sanitize-rich-text"

type GroupedAttribute = {
  name: string
  type: string
  is_variant_axis: boolean
  values?: { name: string }[]
}

type PdpProduct = HttpTypes.StoreProduct & {
  /** Mercur groups product_attribute_values by attribute in `attributes`. */
  attributes?: GroupedAttribute[]
  seller?: { store_status?: string } | null
}

/** Descriptive facts (text attributes, materials…) and the choices a product comes in. */
const detailRows = (product: PdpProduct) => {
  const facts: { label: string; value: string }[] = []
  for (const attr of product.attributes ?? []) {
    if (attr.is_variant_axis) continue
    const value = (attr.values ?? []).map((v) => v.name).filter(Boolean).join(", ")
    if (attr.name && value) facts.push({ label: attr.name, value })
  }
  if (product.material) facts.push({ label: "Materials", value: product.material })
  if (product.origin_country) facts.push({ label: "Made in", value: product.origin_country.toUpperCase() })

  const choices: { label: string; value: string }[] = []
  for (const option of product.options ?? []) {
    const values = (option.values ?? []).map((v) => v.value).filter(Boolean)
    if (values.length > 1) choices.push({ label: `${option.title} choices`, value: values.join(", ") })
  }
  return { facts, choices }
}

export const ProductDetailsPage = async ({
  handle,
  locale,
}: {
  handle: string
  locale: string
}) => {
  const userPromise = retrieveCustomer()

  const prod = (await listProducts({
    countryCode: locale,
    queryParams: { handle: [handle], limit: 1 },
  }).then(({ response }) => response.products[0])) as PdpProduct | undefined

  if (!prod) return null

  if (prod.seller?.store_status === "SUSPENDED") {
    return NotFound()
  }

  const [{ offers }, user] = await Promise.all([
    listOffers({ productId: prod.id, countryCode: locale }),
    userPromise,
  ])

  const seller = getBuyboxWinner(rankOffers(offers as StoreOffer[]))?.seller
  const category = prod.categories?.[0]
  const { facts: factRows, choices } = detailRows(prod)
  const rows = [...factRows, ...choices]
  // The three shortest facts fit the small tiles under the picture.
  const facts = [...factRows].sort((a, b) => a.value.length - b.value.length).slice(0, 3)
  const description = prod.description || ""

  // "More like this": other products in the same aisle.
  const similar = category
    ? await listProducts({
        countryCode: locale,
        category_id: category.id,
        queryParams: { limit: 5 },
      })
        .then(({ response }) => response.products.filter((p) => p.id !== prod.id).slice(0, 4))
        .catch(() => [])
    : []

  return (
    <div data-testid="product-details-page">
      <div className="mb-8 flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between">
        <LocalizedClientLink
          href={category ? `/categories/${category.handle}` : "/categories"}
          className="sc-pill h-12 self-start text-[16px]"
        >
          <ArrowLeftIcon size={18} /> Back to {category?.name ?? "all products"}
        </LocalizedClientLink>
        <nav aria-label="Breadcrumb" className="text-[15px]">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <LocalizedClientLink href="/" className="hover:underline">Home</LocalizedClientLink>
            </li>
            {category && (
              <>
                <li aria-hidden>/</li>
                <li>
                  <LocalizedClientLink href={`/categories/${category.handle}`} className="hover:underline">
                    {category.name}
                  </LocalizedClientLink>
                </li>
              </>
            )}
            <li aria-hidden>/</li>
            <li aria-current="page" className="font-medium text-[rgba(var(--brand-900))]">{prod.title}</li>
          </ol>
        </nav>
      </div>

      <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
        <div data-testid="product-gallery-container">
          <div className="lg:sticky lg:top-6">
            <ProductImages images={prod.images} title={prod.title} />
            {facts.length > 0 && (
              <dl className="mt-4 grid grid-cols-3 divide-x divide-[rgba(var(--brand-50))] rounded-[18px] border border-primary bg-white">
                {facts.map((fact) => (
                  <div key={fact.label} className="min-w-0 px-4 py-3">
                    <dt className="truncate text-[14px]">{fact.label}</dt>
                    <dd className="truncate text-[19px] font-semibold text-[rgba(var(--brand-900))]">{fact.value}</dd>
                  </div>
                ))}
              </dl>
            )}
          </div>
        </div>

        <div data-testid="product-details-container">
          {category && <p className="text-[15px] font-semibold text-[rgba(var(--brand-400))]">{category.name}</p>}
          <h1 className="heading-xl mt-2" data-testid="product-title">
            {prod.title}
          </h1>
          {prod.subtitle && <p className="mt-2 text-[18px] font-medium">{prod.subtitle}</p>}
          {description && (
            isRichText(description) ? (
              <div
                className="product-details mt-4 text-[18px] leading-[30px]"
                dangerouslySetInnerHTML={{ __html: sanitizeRichText(description) }}
                data-testid="product-details-content"
              />
            ) : (
              <p className="mt-4 whitespace-pre-line text-[18px] leading-[30px]" data-testid="product-details-content">
                {description}
              </p>
            )
          )}

          <ProductDetailsHeader
            product={prod}
            locale={locale}
            user={user}
            offers={offers as StoreOffer[]}
            seller={seller}
          />

          <ul className="mt-8 divide-y divide-[rgba(var(--brand-50))] border-y border-primary">
            {[
              { icon: BoxIcon, title: "Plain, unmarked packaging", body: "Nothing on the box says what’s inside." },
              { icon: RepeatIcon, title: "Need it again?", body: "Reorder in one tap from “My orders”, or call us and we’ll do it for you." },
              { icon: CheckCircleIcon, title: "Easy returns", body: "Unopened boxes can be returned within 30 days." },
            ].map(({ icon: Icon, title, body }) => (
              <li key={title} className="flex gap-3 py-4">
                <Icon size={20} className="mt-0.5 shrink-0 text-[rgba(var(--brand-900))]" />
                <div>
                  <p className="text-[17px] font-semibold text-[rgba(var(--brand-900))]">{title}</p>
                  <p className="text-[15px]">{body}</p>
                </div>
              </li>
            ))}
          </ul>

          {seller && (
            <div className="mt-6">
              <p className="mb-2 text-[15px] font-semibold text-[rgba(var(--brand-900))]">Sold and delivered by</p>
              <ProductDetailsSeller seller={seller} />
            </div>
          )}
        </div>
      </div>

      {rows.length > 0 && (
        <section className="sc-section mt-16 grid gap-8 lg:grid-cols-2 lg:gap-14" aria-labelledby="details-heading">
          <div>
            <h2 id="details-heading" className="heading-lg">The details</h2>
            <p className="mt-3 text-[18px]">Everything you might want to know before you order.</p>
          </div>
          <dl className="border-t border-primary" data-testid="product-additional-attributes-section">
            {rows.map((row) => (
              <div key={row.label} className="grid grid-cols-2 gap-4 border-b border-primary py-4 text-[16px]">
                <dt>{row.label}</dt>
                <dd className="font-semibold text-[rgba(var(--brand-900))]">{row.value}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      {similar.length > 0 && (
        <section className="sc-section" aria-labelledby="similar-heading">
          <h2 id="similar-heading" className="heading-lg mb-10">More from {category?.name}</h2>
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {similar.map((p) => (
              <li key={p.id}>
                <ProductCard product={p} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}

export const ProductDetailsPageSkeleton = () => (
  <div aria-busy="true" className="grid gap-10 lg:grid-cols-2" data-testid="product-details-page-skeleton">
    <div className="aspect-square w-full animate-pulse rounded-[24px] bg-[rgba(var(--brand-25))]" />
    <div className="space-y-4">
      <div className="h-12 w-3/4 animate-pulse rounded-[12px] bg-[rgba(var(--brand-25))]" />
      <div className="h-32 w-full animate-pulse rounded-[12px] bg-[rgba(var(--brand-25))]" />
      <div className="h-64 w-full animate-pulse rounded-[20px] bg-[rgba(var(--brand-25))]" />
    </div>
  </div>
)
