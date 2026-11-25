"use client"

import { useState } from "react"
import { Button } from "@/components/atoms"
import { HttpTypes } from "@medusajs/types"
import { ProductVariants } from "@/components/molecules"
import useGetAllSearchParams from "@/hooks/useGetAllSearchParams"
import { getProductPrice } from "@/lib/helpers/get-product-price"
import { Chat } from "@/components/organisms/Chat/Chat"
import { SellerProps } from "@/types/seller"
import { WishlistButton } from "../WishlistButton/WishlistButton"
import { Wishlist } from "@/types/wishlist"
import { toast } from "@/lib/helpers/toast"
import { useCartContext } from "@/components/providers"

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
  wishlist,
}: {
  product: HttpTypes.StoreProduct & { seller?: SellerProps }
  locale: string
  user: HttpTypes.StoreCustomer | null
  wishlist?: Wishlist
}) => {
  const { addToCart, onAddToCart, cart, isAddingItem } = useCartContext()
  const { allSearchParams } = useGetAllSearchParams()

  const { cheapestVariant, cheapestPrice } = getProductPrice({
    product,
  })

  // Check if product has any valid prices in current region
  const hasAnyPrice = cheapestPrice !== null && cheapestVariant !== null

  // set default variant
  const selectedVariant = hasAnyPrice
    ? {
        ...optionsAsKeymap(cheapestVariant.options ?? null),
        ...allSearchParams,
      }
    : allSearchParams

  // get selected variant id
  const variantId =
    product.variants?.find(({ options }: { options: any }) =>
      options?.every((option: any) =>
        selectedVariant[option.option?.title.toLowerCase() || ""]?.includes(
          option.value
        )
      )
    )?.id || ""

  // get variant price
  const { variantPrice } = getProductPrice({
    product,
    variantId,
  })

  const selectedVariantObj = product.variants?.find(({ id }) => id === variantId)
  const manageInventory = selectedVariantObj?.manage_inventory ?? false
  const allowBackorder = selectedVariantObj?.allow_backorder ?? false
  const variantStock = selectedVariantObj?.inventory_quantity ?? 0

  // Item is in stock if inventory is not managed, backorders are allowed, or inventory > 0
  const isInStock = !manageInventory || allowBackorder || variantStock > 0

  const variantHasPrice = !!selectedVariantObj?.calculated_price

  const isVariantStockMaxLimitReached =
    manageInventory && !allowBackorder &&
    ((cart?.items?.find((item) => item.variant_id === variantId)?.quantity ?? 0) >= variantStock)

  const [quantity, setQuantity] = useState(1)
  const [showCompareModal, setShowCompareModal] = useState(false)
  const [offers, setOffers] = useState<any[]>([])
  const [loadingOffers, setLoadingOffers] = useState(false)

  // add the selected variant to the cart
  const handleAddToCart = async (qty = quantity) => {
    if (!variantId || !hasAnyPrice || isVariantStockMaxLimitReached) return

    const subtotal = +(variantPrice?.calculated_price_without_tax_number || 0) * qty
    const total = +(variantPrice?.calculated_price_number || 0) * qty

    const storeCartLineItem = {
      thumbnail: product.thumbnail || "",
      product_title: product.title,
      quantity: qty,
      subtotal,
      total,
      tax_total: total - subtotal,
      variant_id: variantId,
      product_id: product.id,
      variant: product.variants?.find(({ id }) => id === variantId),
    }

    // Optimistic update
    onAddToCart(storeCartLineItem, variantPrice?.currency_code || "eur")

    try {
      await addToCart({
        variantId: variantId,
        quantity: qty,
        countryCode: locale,
      })
    } catch (error: any) {
      toast.error({
        title: "Error adding to cart",
        description: error?.message || "Could not add item to cart. Please try again.",
      })
    }
  }

  const handleOpenCompare = async () => {
    setShowCompareModal(true)
    if (!variantId) return
    setLoadingOffers(true)
    try {
      const baseUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"
      const pubKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ""
      const res = await fetch(`${baseUrl}/store/offers?variant_id=${variantId}`, {
        headers: { "x-publishable-api-key": pubKey },
      })
      if (res.ok) {
        const data = await res.json()
        setOffers(data?.offers || [])
      }
    } catch {
      // Fallback gracefully
    } finally {
      setLoadingOffers(false)
    }
  }

  const isAddToCartDisabled = !isInStock || !variantHasPrice || !hasAnyPrice || isVariantStockMaxLimitReached

  const rawPriceNumber = variantPrice?.calculated_price_number || 0
  const totalPriceFormatted = variantPrice
    ? `${variantPrice.currency_code?.toUpperCase() === "SGD" ? "S$" : variantPrice.currency_code?.toUpperCase() + " "}${(rawPriceNumber * quantity).toFixed(2)}`
    : ""
  const chosenSummary = selectedVariantObj?.title || Object.values(selectedVariant).filter(Boolean).join(" / ")

  return (
    <div className="border border-[#e2e8f0] bg-white rounded-2xl p-6 shadow-xs space-y-5" data-testid="product-details-header">
      {/* Header + Price + Stock */}
      <div className="flex justify-between items-start gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-[#0b3b2c] tracking-tight" data-testid="product-title">
            {product.title}
          </h1>
          <div className="mt-2.5 flex items-baseline gap-2.5" data-testid="product-price-container">
            {hasAnyPrice && variantPrice ? (
              <>
                <span className="text-3xl font-extrabold text-[#0b3b2c]" data-testid="product-price-current">
                  {variantPrice.calculated_price}
                </span>
                {variantPrice.calculated_price_number !== variantPrice.original_price_number && (
                  <span className="text-base text-gray-400 line-through" data-testid="product-price-original">
                    {variantPrice.original_price}
                  </span>
                )}
                <span className="text-xs text-gray-500 font-medium">incl. GST</span>
              </>
            ) : (
              <span className="label-md text-secondary pt-2 pb-4" data-testid="product-price-unavailable">
                Not available in your region
              </span>
            )}
          </div>
          {isInStock && hasAnyPrice && (
            <div className="mt-2 flex items-center gap-2 text-xs text-gray-700 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block" />
              <span>In stock. Order today for delivery in 1–2 days.</span>
            </div>
          )}
        </div>
        <div>
          <WishlistButton productId={product.id} wishlist={wishlist} user={user} />
        </div>
      </div>

      {/* Doctor / Nurse reminder box (Slide 3) */}
      <div className="rounded-xl border border-[#e2e8f0] bg-[#fbfdfc] p-3.5 flex items-start gap-2.5 text-xs text-gray-700">
        <span className="text-[#0b3b2c] font-bold text-sm leading-none mt-0.5">ⓘ</span>
        <span>Always use the size and type your doctor or nurse recommends.</span>
      </div>

      {/* Product Variants */}
      {hasAnyPrice && (
        <div className="pt-2 border-t border-gray-100">
          <ProductVariants product={product} selectedVariant={selectedVariant} />
        </div>
      )}

      {/* Quantity Stepper + Add to Cart Button (Slide 3) */}
      <div className="space-y-2.5 pt-1">
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center border border-gray-300 rounded-full bg-white px-2 py-1.5 shrink-0">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="w-8 h-8 rounded-full flex items-center justify-center text-lg font-bold text-gray-700 hover:bg-gray-100 transition-colors"
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span className="w-9 text-center text-sm font-bold text-gray-900">{quantity}</span>
            <button
              type="button"
              onClick={() => setQuantity((q) => q + 1)}
              className="w-8 h-8 rounded-full flex items-center justify-center text-lg font-bold text-gray-700 hover:bg-gray-100 transition-colors"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>

          <button
            type="button"
            onClick={() => handleAddToCart(quantity)}
            disabled={isAddToCartDisabled}
            className={`flex-1 py-3.5 px-6 rounded-full font-bold text-sm md:text-base flex items-center justify-center gap-2 transition-colors shadow-xs ${
              isAddToCartDisabled
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-[#0b3b2c] hover:bg-[#062c20] text-white active:scale-[0.99]"
            }`}
            data-testid="product-add-to-cart-button"
          >
            {isAddingItem ? (
              <span className="animate-spin text-lg">⏳</span>
            ) : !hasAnyPrice ? (
              "Not available in your region"
            ) : isInStock && variantHasPrice ? (
              <>
                <span>🛍️</span>
                <span>Add to cart{totalPriceFormatted ? ` · ${totalPriceFormatted}` : ""}</span>
              </>
            ) : (
              "Out of stock"
            )}
          </button>
        </div>

        {chosenSummary && (
          <p className="text-xs text-gray-500">
            You&apos;ve chosen: <strong className="text-gray-800">{chosenSummary}</strong>
          </p>
        )}
      </div>

      {/* Compare other sellers button (Slide 3 & 4) */}
      <button
        type="button"
        onClick={handleOpenCompare}
        className="w-full py-2.5 px-5 rounded-full border border-gray-300 bg-white hover:bg-gray-50 text-xs md:text-sm font-semibold text-[#0b3b2c] transition-colors"
      >
        Compare other sellers
      </button>

      {/* Not sure which size you need? (Slide 3) */}
      <div className="rounded-xl border border-[#e2e8f0] bg-[#fbfdfc] p-4 space-y-2.5">
        <h3 className="text-sm font-bold text-[#0b3b2c]">Not sure which size you need?</h3>
        <p className="text-xs text-gray-600 leading-relaxed">
          Call us, 9 am – 6 pm daily. We can check your old box with you over the phone.
        </p>
        <a
          href="tel:18001234567"
          className="w-full py-2.5 px-4 rounded-full border border-gray-300 bg-white hover:bg-gray-50 text-xs md:text-sm font-semibold text-[#0b3b2c] flex items-center justify-center gap-2 transition-colors"
        >
          <span>📞</span>
          <span>Call 1800 XXX XXXX</span>
        </a>
      </div>

      {/* Seller message */}
      {user && product.seller && (
        <div className="pt-2 border-t border-gray-100">
          <Chat
            user={user}
            seller={product.seller}
            buttonClassNames="w-full uppercase text-xs"
            product={product}
          />
        </div>
      )}

      {/* Compare Sellers Modal (Slide 4) */}
      {showCompareModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-gray-200 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#0b3b2c]">
                  Compare {offers.length > 0 ? offers.length : 1} {offers.length === 1 ? "offer" : "offers"}
                </h3>
                {chosenSummary && (
                  <p className="text-xs text-gray-500 mt-0.5">{chosenSummary}</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => setShowCompareModal(false)}
                className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500 font-bold"
              >
                ✕
              </button>
            </div>

            {loadingOffers ? (
              <div className="py-8 text-center text-sm text-gray-500">Loading seller offers...</div>
            ) : (
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {(offers.length > 0
                  ? offers
                  : [
                      {
                        id: "current",
                        seller: product.seller || { name: "Vertis Care Store" },
                        price: variantPrice?.calculated_price,
                      },
                    ]
                ).map((offer: any, idx: number) => {
                  const sellerName = offer?.seller?.name || product.seller?.name || "Verified Seller"
                  const initials = sellerName
                    .split(" ")
                    .map((w: string) => w[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()
                  return (
                    <div
                      key={offer.id || idx}
                      className="flex items-center justify-between gap-3 p-3.5 rounded-xl border border-gray-200 bg-[#fbfdfc]"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#0b3b2c] text-white font-bold text-xs flex items-center justify-center shrink-0">
                          {initials}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-gray-900">{sellerName}</span>
                            {idx === 0 && (
                              <span className="bg-[#065f46] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                                Best price
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-gray-500">In stock • Dispatched in 24h</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-extrabold text-[#0b3b2c]">
                          {offer.price || variantPrice?.calculated_price || ""}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setShowCompareModal(false)
                            handleAddToCart(quantity)
                          }}
                          className="bg-[#0b3b2c] hover:bg-[#062c20] text-white text-xs font-bold px-4 py-2 rounded-full transition-colors"
                        >
                          Add to cart
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
