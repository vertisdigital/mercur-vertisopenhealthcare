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

  // add the selected variant to the cart
  const handleAddToCart = async () => {
    if (!variantId || !hasAnyPrice || isVariantStockMaxLimitReached) return

    const subtotal = +(variantPrice?.calculated_price_without_tax_number || 0)
    const total = +(variantPrice?.calculated_price_number || 0)

    const storeCartLineItem = {
      thumbnail: product.thumbnail || "",
      product_title: product.title,
      quantity: 1,
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
        quantity: 1,
        countryCode: locale,
      })
    } catch (error) {
      toast.error({
        title: "Error adding to cart",
        description: "Some variant does not have the required inventory",
      })
    }
  }

  const [orderFrequency, setOrderFrequency] = useState<"once" | "repeat">("once")
  const isAddToCartDisabled = !isInStock || !variantHasPrice || !hasAnyPrice || isVariantStockMaxLimitReached

  const rawPriceNumber = variantPrice?.calculated_price_number || 0
  const repeatDiscountPrice = (rawPriceNumber * 0.95).toFixed(2)

  return (
    <div className="border border-[#e2e8f0] bg-white rounded-2xl p-6 shadow-sm" data-testid="product-details-header">
      <div className="flex justify-between items-start gap-4">
        <div>
          {/* Trust pill */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ecfdf5] text-[#065f46] text-xs font-semibold mb-3 border border-[#a7f3d0]">
            <span>📦</span>
            <span>Discreet plain packaging • Hospital grade</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#0b3b2c] tracking-tight" data-testid="product-title">{product.title}</h1>
          <div className="mt-3 flex items-baseline gap-3" data-testid="product-price-container">
            {hasAnyPrice && variantPrice ? (
              <>
                <span className="text-3xl font-extrabold text-[#0b3b2c]" data-testid="product-price-current">
                  {orderFrequency === "repeat" ? `${variantPrice.currency_code?.toUpperCase()} ${repeatDiscountPrice}` : variantPrice.calculated_price}
                </span>
                {variantPrice.calculated_price_number !==
                  variantPrice.original_price_number && (
                  <span className="text-base text-gray-400 line-through" data-testid="product-price-original">
                    {variantPrice.original_price}
                  </span>
                )}
                <span className="text-xs text-gray-500 font-medium">
                  {orderFrequency === "repeat" ? "(Includes 5% repeat discount & GST)" : "(Includes GST & plain box delivery)"}
                </span>
              </>
            ) : (
              <span className="label-md text-secondary pt-2 pb-4" data-testid="product-price-unavailable">
                Not available in your region
              </span>
            )}
          </div>
        </div>
        <div>
          {/* Add to Wishlist */}
          <WishlistButton
            productId={product.id}
            wishlist={wishlist}
            user={user}
          />
        </div>
      </div>

      {/* Product Variants */}
      {hasAnyPrice && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <ProductVariants product={product} selectedVariant={selectedVariant} />
        </div>
      )}

      {/* Frequency Selector: Just this once vs Repeat every 4 weeks */}
      <div className="mt-6 mb-6">
        <label className="block text-sm font-bold text-gray-800 mb-2.5">
          Delivery frequency
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setOrderFrequency("once")}
            className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
              orderFrequency === "once"
                ? "border-[#0b3b2c] bg-[#ecfdf5]/40 ring-2 ring-[#0b3b2c]/20"
                : "border-gray-200 hover:border-gray-300 bg-white"
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-sm text-gray-900">Just this once</span>
              <span className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                orderFrequency === "once" ? "border-[#0b3b2c] bg-[#0b3b2c]" : "border-gray-300"
              }`}>
                {orderFrequency === "once" && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
              </span>
            </div>
            <p className="text-xs text-gray-500">Standard single order delivery</p>
          </button>

          <button
            type="button"
            onClick={() => setOrderFrequency("repeat")}
            className={`p-3.5 rounded-xl border text-left transition-all relative flex flex-col justify-between ${
              orderFrequency === "repeat"
                ? "border-[#0b3b2c] bg-[#ecfdf5]/50 ring-2 ring-[#0b3b2c]/20"
                : "border-gray-200 hover:border-gray-300 bg-white"
            }`}
          >
            <span className="absolute -top-2.5 right-3 bg-[#065f46] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
              Save 5%
            </span>
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-sm text-[#0b3b2c]">Repeat every 4 weeks</span>
              <span className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                orderFrequency === "repeat" ? "border-[#0b3b2c] bg-[#0b3b2c]" : "border-gray-300"
              }`}>
                {orderFrequency === "repeat" && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
              </span>
            </div>
            <p className="text-xs text-gray-600">Pause or cancel any time with 1 click</p>
          </button>
        </div>
      </div>

      {/* Add to Cart Button */}
      <button
        type="button"
        onClick={handleAddToCart}
        disabled={isAddToCartDisabled}
        className={`w-full py-4 px-6 rounded-xl font-bold text-base md:text-lg flex items-center justify-center gap-2 transition-colors shadow-sm ${
          isAddToCartDisabled
            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
            : "bg-[#0b3b2c] hover:bg-[#062c20] text-white active:scale-[0.99]"
        }`}
        data-testid="product-add-to-cart-button"
      >
        {isAddingItem ? (
          <span className="animate-spin text-xl">⏳</span>
        ) : !hasAnyPrice ? (
          "NOT AVAILABLE IN YOUR REGION"
        ) : isInStock && variantHasPrice ? (
          <>
            <span>🛒</span>
            <span>Add to cart {orderFrequency === "repeat" ? "(Every 4 weeks)" : ""}</span>
          </>
        ) : (
          "OUT OF STOCK"
        )}
      </button>

      {/* Trust & Discreet delivery box */}
      <div className="mt-6 pt-5 border-t border-gray-100 flex flex-col gap-2.5 text-xs text-gray-600">
        <div className="flex items-center gap-2">
          <span className="text-base">📦</span>
          <span><strong>Plain box guarantee:</strong> Arrives in an unmarked brown box with no mention of healthcare or medical contents.</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-base">🚚</span>
          <span><strong>Fast Singapore delivery:</strong> Dispatched in 24 hours. Free delivery on orders over $50.</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-base">📞</span>
          <span><strong>Prefer telephone order?</strong> Call toll-free <a href="tel:18001234567" className="font-bold text-[#0b3b2c] underline">1800 123 4567</a> (Mon–Sat 9am–6pm).</span>
        </div>
      </div>

      {/* Seller message */}
      {user && product.seller && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <Chat
            user={user}
            seller={product.seller}
            buttonClassNames="w-full uppercase text-xs"
            product={product}
          />
        </div>
      )}
    </div>
  )
}
