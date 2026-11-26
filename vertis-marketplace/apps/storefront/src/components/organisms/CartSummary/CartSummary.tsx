"use client"

import { convertToLocale } from "@/lib/helpers/money"

export const CartSummary = ({
  item_total,
  shipping_total,
  total,
  currency_code,
  tax,
  discount_total,
  item_count,
  has_shipping = true,
}: {
  item_total: number
  shipping_total: number
  total: number
  currency_code: string
  tax: number
  discount_total: number
  item_count?: number
  has_shipping?: boolean
}) => {
  const money = (amount: number) => convertToLocale({ amount, currency_code })

  const delivery = !has_shipping
    ? "Chosen at checkout"
    : shipping_total === 0
    ? "Free"
    : money(shipping_total)

  return (
    <div data-testid="cart-summary">
      <dl className="space-y-3.5 text-[17px]">
        <div className="flex justify-between gap-4" data-testid="cart-summary-items">
          <dt>Items{item_count ? ` (${item_count})` : ""}</dt>
          <dd className="font-semibold text-[rgba(var(--brand-900))]">{money(item_total)}</dd>
        </div>
        <div className="flex justify-between gap-4" data-testid="cart-summary-delivery">
          <dt>Delivery</dt>
          <dd className="text-right font-semibold text-[rgba(var(--brand-900))]">{delivery}</dd>
        </div>
        {discount_total > 0 && (
          <div className="flex justify-between gap-4" data-testid="cart-summary-discount">
            <dt>Discount</dt>
            <dd className="font-semibold text-[rgba(var(--brand-900))]">− {money(discount_total)}</dd>
          </div>
        )}
        <div className="flex justify-between gap-4" data-testid="cart-summary-tax">
          <dt>GST</dt>
          <dd className="font-semibold text-[rgba(var(--brand-900))]">
            {tax > 0 ? `${money(tax)} included` : "Included"}
          </dd>
        </div>
        <div
          className="flex items-center justify-between gap-4 border-t border-primary pt-5"
          data-testid="cart-summary-total"
        >
          <dt className="text-[19px] font-semibold text-[rgba(var(--brand-900))]">Total</dt>
          <dd className="font-display text-[34px] font-bold leading-none text-[rgba(var(--brand-900))]">
            {money(total)}
          </dd>
        </div>
      </dl>
    </div>
  )
}
