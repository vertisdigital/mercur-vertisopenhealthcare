import { HttpTypes } from "@medusajs/types"

import LocalizedClientLink from "@/components/molecules/LocalizedLink/LocalizedLink"
import { ProductCard } from "@/components/organisms/ProductCard/ProductCard"
import { listCategories } from "@/lib/data/categories"
import { getCollectionByHandle } from "@/lib/data/collections"
import { listOffers } from "@/lib/data/offers"
import { listProducts } from "@/lib/data/products"
import { getBuyboxWinner, rankOffers, StoreOffer } from "@/lib/helpers/buybox"

import {
  ArrowRightIcon,
  BandageIcon,
  BathIcon,
  BottleIcon,
  BoxIcon,
  CutleryIcon,
  DropletIcon,
  GridIcon,
  HeartIcon,
  PulseIcon,
  TrainingIcon,
  MobilityIcon,
  PhoneIcon,
  RepeatIcon,
  TruckIcon,
} from "../Icons"
import { BRAND } from "../brand"

/* ---------- Value strip ---------- */

export const ValueStrip = () => {
  const items = [
    { icon: TruckIcon, title: "Free delivery", body: "Standard delivery on every order" },
    { icon: BoxIcon, title: "Discreet packaging", body: "A plain box, no product names" },
    { icon: RepeatIcon, title: "Repeat deliveries", body: "Skip or cancel any time" },
    { icon: PhoneIcon, title: "Real people", body: `Call us ${BRAND.hours}` },
  ]
  return (
    <section aria-label="Our promise" className="border-b border-primary bg-white">
      <ul className="sc-shell grid grid-cols-1 divide-y divide-[rgba(var(--brand-50))] sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4 lg:divide-x">
        {items.map(({ icon: Icon, title, body }) => (
          <li key={title} className="flex gap-3 py-6 lg:px-6 lg:first:pl-0">
            <Icon size={22} className="mt-0.5 shrink-0 text-[rgba(var(--brand-900))]" />
            <div>
              <p className="text-[18px] font-semibold text-[rgba(var(--brand-900))]">{title}</p>
              <p className="text-[16px]">{body}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}

/* ---------- Section heading ---------- */

const SectionHeading = ({
  id,
  title,
  intro,
  action,
}: {
  id: string
  title: string
  intro?: string
  action?: React.ReactNode
}) => (
  <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
    <div className="max-w-[600px]">
      <h2 id={id} className="heading-lg">
        {title}
      </h2>
      {intro && <p className="mt-3 text-[18px] leading-[28px]">{intro}</p>}
    </div>
    {action}
  </div>
)

/* ---------- Shop by need ---------- */

const iconFor = (name: string) => {
  const n = name.toLowerCase()
  if (/train|course|ctg/.test(n)) return TrainingIcon
  if (/monitor|pressure|thermo/.test(n)) return PulseIcon
  if (/nutrition|drink|formula/.test(n)) return BottleIcon
  if (/contin|incontin|cathet|urin/.test(n)) return DropletIcon
  if (/wound|dress|bandag|first aid/.test(n)) return BandageIcon
  if (/mobil|walk|wheel|rollat/.test(n)) return MobilityIcon
  if (/bath|shower|toilet/.test(n)) return BathIcon
  if (/daily|living|kitchen|eat/.test(n)) return CutleryIcon
  if (/skin|personal|hygien|cream/.test(n)) return BottleIcon
  if (/health|care|well/.test(n)) return HeartIcon
  return GridIcon
}

export const ShopByNeed = async () => {
  const { parentCategories } = (await listCategories().catch(() => ({
    parentCategories: [],
  }))) as { parentCategories: HttpTypes.StoreProductCategory[] }

  const aisles = parentCategories.slice(0, 6)
  if (!aisles.length) return null

  return (
    <section className="sc-shell py-16 md:py-20" aria-labelledby="shop-by-need">
      <SectionHeading
        id="shop-by-need"
        title="Shop by need"
        intro={`${["", "One", "Two", "Three", "Four", "Five", "Six"][aisles.length]} simple aisles. Every product shows its size, pack count and price up front.`}
        action={
          <LocalizedClientLink href="/categories" className="sc-link inline-flex items-center gap-2 text-[17px]">
            See all products <ArrowRightIcon size={17} />
          </LocalizedClientLink>
        }
      />
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {aisles.map((category) => {
          const Icon = iconFor(category.name)
          return (
            <li key={category.id}>
              <LocalizedClientLink
                href={`/categories/${category.handle}`}
                className="group flex h-full items-center gap-4 rounded-[20px] border border-primary bg-white p-5 transition-colors hover:border-[rgba(var(--brand-200))] hover:bg-[rgba(var(--brand-25))]"
              >
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[14px] border border-[rgba(var(--brand-50))] bg-[rgba(var(--brand-25))] text-[rgba(var(--brand-900))]">
                  <Icon size={24} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[19px] font-semibold text-[rgba(var(--brand-900))]">{category.name}</span>
                  {category.description && (
                    <span className="mt-0.5 block text-[15px] leading-[22px]">{category.description}</span>
                  )}
                </span>
                <ArrowRightIcon size={18} className="shrink-0 text-[rgba(var(--brand-900))] transition-transform group-hover:translate-x-1" />
              </LocalizedClientLink>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

/* ---------- Most reordered ---------- */

export const MostReordered = async ({ locale }: { locale: string }) => {
  // Products in the "most-reordered" collection (set by seed-care.ts); falls
  // back to the newest products if the collection is missing or empty.
  const collection = await getCollectionByHandle("most-reordered").catch(() => null)
  const fetchProducts = (collection_id?: string) =>
    listProducts({
      countryCode: locale,
      collection_id,
      queryParams: { limit: 4, order: "-created_at" },
    })
      .then(({ response }) => response.products)
      .catch(() => [] as HttpTypes.StoreProduct[])
  let products = collection?.id ? await fetchProducts(collection.id) : []
  if (!products.length) products = await fetchProducts()

  if (!products.length) return null

  // One-tap "Add to cart" needs the buybox-winning offer for each product.
  const offers = await Promise.all(
    products.map((p) =>
      listOffers({ productId: p.id, countryCode: locale })
        .then(({ offers }) => getBuyboxWinner(rankOffers(offers as StoreOffer[])) ?? null)
        .catch(() => null)
    )
  )

  return (
    <section className="sc-section" aria-labelledby="most-reordered">
      <div className="sc-shell">
        <SectionHeading
          id="most-reordered"
          title="Most reordered"
          intro="The supplies our customers come back for, with sizes and pack counts shown clearly."
        />
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product, i) => (
            <li key={product.id}>
              <ProductCard product={product} offer={offers[i]} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

/* ---------- Ordering in three steps ---------- */

export const OrderingSteps = () => {
  const steps = [
    {
      title: "Find what you need",
      body: "Browse by need or search in plain words. Sizes, pack counts and prices are always shown up front.",
    },
    {
      title: "Order once, or repeat it",
      body: "Choose a one-off order or ask us to repeat it. Pay by card, PayNow, or cash when it arrives.",
    },
    {
      title: "We bring it to your door",
      body: "Everything arrives in a plain box. Our driver calls 30 minutes before and can carry it inside.",
    },
  ]
  return (
    <section id="how-it-works" className="sc-section scroll-mt-6" aria-labelledby="steps-heading">
      <div className="sc-shell">
        <SectionHeading
          id="steps-heading"
          title="Ordering, in three steps"
          intro="No passwords to remember and no surprises at the end."
        />
        <ol className="grid overflow-hidden rounded-[20px] border border-primary bg-white md:grid-cols-3 md:divide-x md:divide-[rgba(var(--brand-50))]">
          {steps.map((step, i) => (
            <li key={step.title} className="border-b border-primary p-7 last:border-b-0 md:border-b-0">
              <span className="flex h-11 w-11 items-center justify-center rounded-full border border-[rgba(var(--brand-200))] text-[18px] font-semibold text-[rgba(var(--brand-900))]">
                {i + 1}
              </span>
              <h3 className="mt-5 text-[21px] font-semibold" style={{ letterSpacing: 0, fontFamily: "inherit" }}>
                {step.title}
              </h3>
              <p className="mt-2 text-[16px] leading-[26px]">{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
