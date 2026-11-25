"use client"

import { HttpTypes } from "@medusajs/types"
import useUpdateSearchParams from "@/hooks/useUpdateSearchParams"

export const ProductVariants = ({
  product,
  selectedVariant,
}: {
  product: HttpTypes.StoreProduct
  selectedVariant: Record<string, string>
}) => {
  const updateSearchParams = useUpdateSearchParams()

  // update the options when a variant is selected
  const setOptionValue = (optionId: string, value: string) => {
    if (value) updateSearchParams(optionId, value)
  }

  if (!product.options?.length) return null

  return (
    <div className="my-4 space-y-4" data-testid="product-variants">
      {(product.options || []).map(
        ({ id, title, values }: HttpTypes.StoreProductOption) => {
          const key = title.toLowerCase()
          const currentVal = selectedVariant[key]
          const isSize = key.includes("size")

          return (
            <div key={id} data-testid={`product-variant-${key}`}>
              <div className="flex items-baseline gap-1.5">
                <span className="text-sm font-bold text-gray-900">{title}:</span>
                <span
                  className="text-sm font-semibold text-[#0b3b2c]"
                  data-testid={`product-variant-selected-${key}`}
                >
                  {currentVal}
                </span>
              </div>
              {isSize && (
                <p className="text-xs text-gray-500 mt-0.5">
                  Your size is printed on your prescription or your old box.
                </p>
              )}
              <div
                className="flex flex-wrap gap-2.5 mt-2.5"
                data-testid={`product-variant-options-${key}`}
              >
                {(values || []).map(
                  ({
                    id: valId,
                    value,
                  }: Partial<HttpTypes.StoreProductOptionValue>) => {
                    const isSelected = currentVal === value
                    return (
                      <button
                        type="button"
                        key={valId}
                        onClick={() => setOptionValue(key, value || "")}
                        data-testid={`product-variant-chip-${key}-${value
                          ?.toLowerCase()
                          .replace(/\s+/g, "-")}`}
                        className={`px-4 py-2 rounded-full text-sm font-semibold transition-all border ${
                          isSelected
                            ? "border-2 border-[#0b3b2c] bg-[#ecfdf5]/60 text-[#0b3b2c] shadow-xs"
                            : "border-gray-300 bg-white text-gray-800 hover:border-[#0b3b2c]/60 hover:bg-gray-50"
                        }`}
                      >
                        {value}
                      </button>
                    )
                  }
                )}
              </div>
            </div>
          )
        }
      )}
    </div>
  )
}
