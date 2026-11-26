"use client"

import Image from "next/image"
import { Suspense } from "react"
import { HttpTypes } from "@medusajs/types"

import LocalizedClientLink from "@/components/molecules/LocalizedLink/LocalizedLink"
import { useCartContext } from "@/components/providers"
import { useCartDrawer } from "@/components/providers/Cart/drawer"
import { useLocale } from "@/components/providers/Locale/LocaleProvider"
import { ArrowRightIcon, PlusIcon } from "@/components/silver/Icons"
import { getOfferAmount, getOfferStock, StoreOffer } from "@/lib/helpers/buybox"
import { getProductPrice } from "@/lib/helpers/get-product-price"
import { convertToLocale } from "@/lib/helpers/money"
import { toast } from "@/lib/helpers/toast"
import { cn } from "@/lib/utils"
import { Product } from "@/types/product"

export const ProductCard = ({
  product,
  offer,
  className,
}: {
  product: HttpTypes.StoreProduct | Product
  /** Winning offer for single-variant products; enables one-tap "Add to cart". */
  offer?: StoreOffer | null
  className?: string
}) => {
  if (!product) return null

  const storeProduct = product as HttpTypes.StoreProduct
  const { cheapestPrice } = getProductPrice({ product: storeProduct })
  const productName = String(product.title || "Product")
  const subtitle = storeProduct.subtitle || ""
  const variantCount = storeProduct.variants?.length ?? 0

  const offerAmount = offer ? getOfferAmount(offer) : null
  const offerCurrency = offer?.calculated_price?.currency_code || cheapestPrice?.currency_code || "sgd"
  const canQuickAdd = !!offer && offerAmount !== null && getOfferStock(offer) > 0 && variantCount <= 1

  const price =
    offerAmount !== null
      ? convertToLocale({ amount: offerAmount, currency_code: offerCurrency })
      : cheapestPrice?.calculated_price

  const href = `/products/${product.handle}`

  return (
    <article
      className={cn(
        "group flex h-full w-full flex-col overflow-hidden rounded-[20px] border border-primary bg-white transition-shadow hover:shadow-[0_8px_30px_rgba(1,53,51,0.08)]",
        className
      )}
      data-testid="product-card"
      data-product-handle={product.handle}
    >
      <LocalizedClientLink href={href} aria-label={productName} tabIndex={-1} data-testid="product-card-link">
        <div className="sc-tile-bg relative flex aspect-[4/3.4] items-center justify-center overflow-hidden" data-testid="product-card-image-container">
          {product.thumbnail ? (
            <Image
              src={decodeURIComponent(product.thumbnail)}
              alt=""
              fill
              sizes="(min-width: 1024px) 280px, (min-width: 640px) 45vw, 90vw"
              className="object-contain p-6 transition-transform duration-300 group-hover:scale-[1.03]"
              data-testid="product-card-image"
            />
          ) : (
            <Image src="/images/placeholder.svg" alt="" width={72} height={72} className="opacity-40" />
          )}
        </div>
      </LocalizedClientLink>

      <div className="flex flex-1 flex-col p-5" data-testid="product-card-info">
        <h3 className="text-[19px] font-semibold leading-[26px]" style={{ fontFamily: "inherit", letterSpacing: 0 }} data-testid="product-card-title">
          <LocalizedClientLink href={href} className="hover:underline">
            {productName}
          </LocalizedClientLink>
        </h3>
        {subtitle && <p className="mt-1.5 text-[15px] leading-[22px]">{subtitle}</p>}

        <p className="mt-auto pt-5" data-testid="product-card-price">
          {price ? (
            <>
              <span className="text-[24px] font-bold text-[rgba(var(--brand-900))]" data-testid="product-card-current-price">
                {price}
              </span>{" "}
              <span className="text-[14px]">incl. GST</span>
            </>
          ) : (
            <span className="text-[16px]">See price on product page</span>
          )}
        </p>

        {canQuickAdd ? (
          <Suspense fallback={<QuickAddFallback />}>
            <QuickAddButton product={storeProduct} offer={offer!} amount={offerAmount!} currency={offerCurrency} />
          </Suspense>
        ) : (
          <LocalizedClientLink
            href={href}
            className="sc-btn mt-4 h-12 w-full text-[17px]"
            data-testid="product-card-see-more-button"
          >
            {variantCount > 1 ? "Choose size" : "View product"} <ArrowRightIcon size={18} />
          </LocalizedClientLink>
        )}
      </div>
    </article>
  )
}

const QuickAddFallback = () => (
  <button type="button" disabled className="sc-btn mt-4 h-12 w-full text-[17px]">
    <PlusIcon size={18} /> Add to cart
  </button>
)

const QuickAddButton = ({
  product: storeProduct,
  offer,
  amount: offerAmount,
  currency: offerCurrency,
}: {
  product: HttpTypes.StoreProduct
  offer: StoreOffer
  amount: number
  currency: string
}) => {
  const { addToCart, isAddingItem } = useCartContext()
  const { openDrawer } = useCartDrawer()
  const locale = useLocale()
  const productName = String(storeProduct.title || "Product")

  const quickAdd = async () => {
    if (!offer || offerAmount === null) return
    const subtotal = offer.calculated_price?.calculated_amount_without_tax ?? offerAmount
    openDrawer()
    try {
      await addToCart({
        offerId: offer.id,
        quantity: 1,
        countryCode: locale,
        optimisticItem: {
          currencyCode: offerCurrency,
          item: {
            thumbnail: storeProduct.thumbnail || "",
            product_title: productName,
            quantity: 1,
            subtotal,
            total: offerAmount,
            tax_total: offerAmount - subtotal,
            variant_id: storeProduct.variants?.[0]?.id,
            product_id: storeProduct.id,
            variant: storeProduct.variants?.[0],
            metadata: { offer_id: offer.id },
          } as never,
        },
      })
    } catch {
      toast.error({ title: "Sorry, we couldn’t add that", description: "Please try again, or call us." })
    }
  }

  return (
    <button
      type="button"
      onClick={quickAdd}
      disabled={isAddingItem}
      className="sc-btn mt-4 h-12 w-full text-[17px]"
      aria-label={`Add ${productName} to cart`}
      data-testid="product-card-add-button"
    >
      <PlusIcon size={18} /> Add to cart
    </button>
  )
}
