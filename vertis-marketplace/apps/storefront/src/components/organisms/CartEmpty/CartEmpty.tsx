import LocalizedClientLink from "@/components/molecules/LocalizedLink/LocalizedLink"
import { ArrowRightIcon, BagIcon, PhoneIcon } from "@/components/silver/Icons"
import { BRAND, phoneHref } from "@/components/silver/brand"

export function CartEmpty() {
  return (
    <div className="col-span-12 flex justify-center py-10" data-testid="cart-empty">
      <div className="sc-tile-bg flex w-full max-w-[560px] flex-col items-center rounded-[28px] border border-primary px-8 py-14 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full border border-[rgba(var(--brand-200))] bg-white text-[rgba(var(--brand-900))]">
          <BagIcon size={24} />
        </span>
        <h1 className="heading-lg mt-5">Your cart is empty</h1>
        <p className="mt-3 text-[18px]">Browse by need, or search in plain words for what you use.</p>
        <LocalizedClientLink href="/categories" className="sc-btn mt-8 h-14 px-8 text-[18px]">
          Start shopping <ArrowRightIcon size={18} />
        </LocalizedClientLink>
        <a href={phoneHref} className="sc-link mt-6 inline-flex items-center gap-2 text-[17px]">
          <PhoneIcon size={17} /> Or order by phone: {BRAND.phone}
        </a>
      </div>
    </div>
  )
}
