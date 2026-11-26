"use client"

import { useState } from "react"
import { HttpTypes } from "@medusajs/types"
import { ProductVariants } from '@/components/molecules/ProductVariants/ProductVariants';
import useGetAllSearchParams from "@/hooks/useGetAllSearchParams"
import { getProductPrice } from "@/lib/helpers/get-product-price"
import { convertToLocale } from "@/lib/helpers/money"
import {
  getBuyboxWinner,
  getOfferAmount,
  getOfferStock,
  getVariantOffers,
  StoreOffer,
} from "@/lib/helpers/buybox"
import { Chat } from "@/components/organisms/Chat/Chat"
import { CompareOffersModal } from "@/components/organisms/CompareOffersModal/CompareOffersModal"
import { SellerDTO } from "@mercurjs/types"
import { toast } from "@/lib/helpers/toast"
import { useCartContext } from "@/components/providers"
import { useCartDrawer } from "@/components/providers/Cart/drawer"
import { BagIcon, InfoIcon, MinusIcon, PlusIcon as PlusSilverIcon } from "@/components/silver/Icons"
import { PhoneHelpCard } from "@/components/silver/PhoneHelp"

const optionsAsKeymap = (
  variantOptions: HttpTypes.StoreProductVariant["options"]
) => {
  return variantOptions?.reduce(
    (
      acc: Record<string, string>,
      varopt: HttpTypes.StoreProductOptionValue
    ) => {
      acc[varopt.option?.title.toLowerCase() || ""] = varopt.value

      return acc
    },
    {}
  )
}

export const ProductDetailsHeader = ({
  product,
  locale,
  user,
  offers = [],
  seller,
}: {
  product: HttpTypes.StoreProduct
  locale: string
  user: HttpTypes.StoreCustomer | null
  offers?: StoreOffer[]
  seller?: SellerDTO
}) => {
  const { addToCart, cart, isAddingItem } = useCartContext()
  const { allSearchParams } = useGetAllSearchParams()
  const { openDrawer } = useCartDrawer()
  const [isCompareOpen, setIsCompareOpen] = useState(false)
  const [quantity, setQuantity] = useState(1)

  const { cheapestVariant, cheapestPrice } = getProductPrice({
    product,
  })

  const hasAnyPrice = cheapestPrice !== null && cheapestVariant !== null

  const selectedVariant = hasAnyPrice
    ? {
        ...optionsAsKeymap(cheapestVariant.options ?? null),
        ...allSearchParams,
      }
    : allSearchParams

  const variantId =
    product.variants?.find(({ options }: { options: any }) =>
      options?.every((option: any) =>
        selectedVariant[option.option?.title.toLowerCase() || ""]?.includes(
          option.value
        )
      )
    )?.id || ""

  const { variantPrice } = getProductPrice({
    product,
    variantId,
  })

  // Buybox: the winning offer for the selected variant sets the price shown and
  // the offer that add-to-cart uses. Products are sold through offers, not the
  // variant's base price.
  const variantOffers = getVariantOffers(offers, variantId)
  const winnerOffer = getBuyboxWinner(variantOffers)
  const otherOffersCount = Math.max(variantOffers.length - 1, 0)

  const offerAmount = winnerOffer ? getOfferAmount(winnerOffer) : null
  const offerCurrency =
    winnerOffer?.calculated_price?.currency_code ||
    variantPrice?.currency_code ||
    "eur"
  const offerStock = winnerOffer ? getOfferStock(winnerOffer) : 0
  const hasOffer = !!winnerOffer && offerAmount !== null

  const displayPrice = hasOffer
    ? convertToLocale({ amount: offerAmount as number, currency_code: offerCurrency })
    : variantPrice?.calculated_price

  const quantityInCart =
    cart?.items?.find((item) => item.metadata?.offer_id === winnerOffer?.id)
      ?.quantity ?? 0
  const isStockMaxLimitReached = quantityInCart >= offerStock

  const isAddToCartDisabled =
    !hasOffer || !offerStock || isStockMaxLimitReached

  const maxQuantity = Math.max(1, Math.min(99, offerStock - quantityInCart))
  const selectedQuantity = Math.min(quantity, maxQuantity)

  const handleAddToCart = async () => {
    if (!winnerOffer || isAddToCartDisabled) return

    const total = offerAmount as number
    const subtotal =
      winnerOffer.calculated_price?.calculated_amount_without_tax ?? total

    const storeCartLineItem = {
      thumbnail: product.thumbnail || "",
      product_title: product.title,
      quantity: selectedQuantity,
      subtotal: subtotal * selectedQuantity,
      total: total * selectedQuantity,
      tax_total: (total - subtotal) * selectedQuantity,
      variant_id: variantId,
      product_id: product.id,
      variant: product.variants?.find(({ id }) => id === variantId),
      metadata: { offer_id: winnerOffer.id },
    }

    openDrawer()
    setQuantity(1)

    try {
      await addToCart({
        offerId: winnerOffer.id,
        quantity: selectedQuantity,
        countryCode: locale,
        optimisticItem: { item: storeCartLineItem, currencyCode: offerCurrency },
      })
    } catch (error) {
      toast.error({
        title: "Error adding to cart",
        description: "This offer does not have the required inventory",
      })
    }
  }

  const variantTitle = product.variants?.find(({ id }) => id === variantId)?.title

  return (
    <div className="mt-6" data-testid="product-details-header">
      <div data-testid="product-price-container">
        {hasOffer || (hasAnyPrice && variantPrice) ? (
          <p className="flex flex-wrap items-baseline gap-x-2">
            <span className="font-display text-[44px] font-bold leading-none text-[rgba(var(--brand-900))]" data-testid="product-price-current">
              {hasOffer ? displayPrice : variantPrice?.calculated_price}
            </span>
            <span className="text-[16px]">incl. GST</span>
          </p>
        ) : (
          <p className="text-[18px] font-medium" data-testid="product-price-unavailable">
            Not available to order online right now — please call us.
          </p>
        )}
        {hasOffer && (
          <p className="mt-3 flex items-center gap-2 text-[17px]">
            <span
              className={offerStock > 0 ? "h-2.5 w-2.5 rounded-full bg-[rgba(var(--brand-900))]" : "h-2.5 w-2.5 rounded-full bg-[rgba(var(--red-600))]"}
              aria-hidden
            />
            {offerStock > 0 ? "In stock. Order today for delivery in 1–2 days." : "Out of stock at the moment."}
          </p>
        )}
      </div>

      <p className="mt-5 flex gap-3 rounded-[16px] border border-[rgba(var(--brand-200))] p-4 text-[16px]">
        <InfoIcon size={20} className="mt-0.5 shrink-0 text-[rgba(var(--brand-900))]" />
        Always use the size and type your doctor or nurse recommends.
      </p>

      {hasAnyPrice && (
        <div className="mt-6 border-t border-primary pt-6">
          <ProductVariants product={product} selectedVariant={selectedVariant} />
        </div>
      )}

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <div
          aria-label="Quantity"
          role="group"
          className="flex h-16 shrink-0 items-center justify-between rounded-full border-2 border-[rgba(var(--brand-200))] px-2 sm:w-[170px]"
          data-testid="product-quantity-picker"
        >
          <button
            type="button"
            aria-label="One fewer"
            className="flex h-12 w-12 items-center justify-center rounded-full bg-[rgba(var(--brand-25))] text-[rgba(var(--brand-900))] disabled:opacity-40"
            disabled={isAddToCartDisabled || selectedQuantity <= 1}
            onClick={() => setQuantity(Math.max(1, selectedQuantity - 1))}
            data-testid="product-quantity-decrease"
          >
            <MinusIcon size={20} />
          </button>
          <span aria-live="polite" role="status" className="text-[22px] font-bold tabular-nums text-[rgba(var(--brand-900))]" data-testid="product-quantity-value">
            {selectedQuantity}
          </span>
          <button
            type="button"
            aria-label="One more"
            className="flex h-12 w-12 items-center justify-center rounded-full bg-[rgba(var(--brand-25))] text-[rgba(var(--brand-900))] disabled:opacity-40"
            disabled={isAddToCartDisabled || selectedQuantity >= maxQuantity}
            onClick={() => setQuantity(Math.min(maxQuantity, selectedQuantity + 1))}
            data-testid="product-quantity-increase"
          >
            <PlusSilverIcon size={20} />
          </button>
        </div>
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={isAddToCartDisabled || isAddingItem}
          className="sc-btn h-16 flex-1 text-[19px]"
          data-testid="product-add-to-cart-button"
        >
          <BagIcon size={20} />
          {!hasOffer
            ? "Not available online"
            : !offerStock
            ? "Out of stock"
            : isStockMaxLimitReached
            ? "All our stock is in your cart"
            : `Add to cart · ${
                convertToLocale({
                  amount: (offerAmount as number) * selectedQuantity,
                  currency_code: offerCurrency,
                })
              }`}
        </button>
      </div>
      {variantTitle && hasOffer && (
        <p className="mt-3 text-[15px]">You’ve chosen: <strong className="text-[rgba(var(--brand-900))]">{variantTitle}</strong></p>
      )}

      {otherOffersCount > 0 && (
        <button
          type="button"
          onClick={() => setIsCompareOpen(true)}
          className="sc-pill mt-4 h-12 w-full"
          data-testid="compare-offers-button"
        >
          Compare {otherOffersCount} other {otherOffersCount === 1 ? "seller" : "sellers"}
        </button>
      )}
      {isCompareOpen && (
        <CompareOffersModal
          offers={variantOffers}
          locale={locale}
          variantLabel={variantTitle || undefined}
          onClose={() => setIsCompareOpen(false)}
        />
      )}

      <PhoneHelpCard
        className="mt-6"
        title="Not sure which size you need?"
        body="Call us, 9 am – 6 pm daily. We can check your old box with you over the phone."
      />

      {user && seller && (
        <div className="mt-4">
          <Chat user={user} seller={seller} buttonClassNames="w-full" product={product} />
        </div>
      )}
    </div>
  )
}
