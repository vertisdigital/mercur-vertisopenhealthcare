"use client"

import LocalizedClientLink from "@/components/molecules/LocalizedLink/LocalizedLink"
import { useCartContext } from "@/components/providers"
import { BagIcon } from "@/components/silver/Icons"

// Labelled "Cart" pill that goes straight to the cart page — clearer for older
// shoppers than an icon that opens a drawer.
export const CartButton = () => {
  const { cart } = useCartContext()

  const count = cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0

  return (
    <LocalizedClientLink
      href="/cart"
      className="sc-pill h-12 border-2 border-[rgba(var(--brand-900))] px-4 text-[17px]"
      aria-label={`Cart, ${count} ${count === 1 ? "item" : "items"}`}
      data-testid="header-cart-button"
    >
      <BagIcon size={18} />
      <span>Cart</span>
      <span
        className="flex h-7 min-w-7 items-center justify-center rounded-full bg-[rgba(var(--brand-900))] px-2 text-[14px] font-bold text-white"
        data-testid="header-cart-count"
      >
        {count}
      </span>
    </LocalizedClientLink>
  )
}
