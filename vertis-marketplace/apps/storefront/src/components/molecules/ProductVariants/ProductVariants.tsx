"use client"

import { HttpTypes } from "@medusajs/types"

import useUpdateSearchParams from "@/hooks/useUpdateSearchParams"
import { cn } from "@/lib/utils"

/** Large pill choices for each product option (e.g. Size: CH10 / CH12 / CH14). */
export const ProductVariants = ({
  product,
  selectedVariant,
}: {
  product: HttpTypes.StoreProduct
  selectedVariant: Record<string, string>
}) => {
  const updateSearchParams = useUpdateSearchParams()

  const setOptionValue = (optionKey: string, value: string) => {
    if (value) updateSearchParams(optionKey, value)
  }

  const options = (product.options || []).filter((o) => (o.values?.length ?? 0) > 1)
  if (!options.length) return null

  return (
    <div className="space-y-6" data-testid="product-variants">
      {options.map(({ id, title, values }: HttpTypes.StoreProductOption) => {
        const key = title.toLowerCase()
        const selected = selectedVariant[key]
        return (
          <fieldset key={id} data-testid={`product-variant-${key}`}>
            <legend className="text-[18px] font-semibold text-[rgba(var(--brand-900))]">
              {title}:{" "}
              <span className="font-normal" data-testid={`product-variant-selected-${key}`}>
                {selected}
              </span>
            </legend>
            {key === "size" && (
              <p className="mt-1 text-[15px]">Your size is printed on your prescription or your old box.</p>
            )}
            <div
              role="radiogroup"
              aria-label={title}
              className="mt-3 flex flex-wrap gap-3"
              data-testid={`product-variant-options-${key}`}
            >
              {(values || []).map(({ id, value }: Partial<HttpTypes.StoreProductOptionValue>) => {
                const isSelected = selected === value
                return (
                  <button
                    key={id}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() => setOptionValue(key, value || "")}
                    className={cn(
                      "min-h-[52px] min-w-[84px] rounded-full border-2 px-5 text-[17px] font-semibold text-[rgba(var(--brand-900))] transition-colors",
                      isSelected
                        ? "border-[rgba(var(--brand-900))] bg-[rgba(var(--brand-25))]"
                        : "border-[rgba(var(--brand-200))] bg-white hover:border-[rgba(var(--brand-400))]"
                    )}
                    data-testid={`product-variant-chip-${key}-${value?.toLowerCase().replace(/\s+/g, "-")}`}
                  >
                    {value}
                  </button>
                )
              })}
            </div>
          </fieldset>
        )
      })}
    </div>
  )
}
