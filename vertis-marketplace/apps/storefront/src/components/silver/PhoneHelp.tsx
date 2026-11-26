import { cn } from "@/lib/utils"

import { PhoneIcon } from "./Icons"
import { BRAND, phoneHref } from "./brand"

/** Big "Prefer to order by phone?" band used on the home page. */
export const PhoneCta = () => (
  <section className="sc-shell py-16 md:py-20" aria-labelledby="phone-cta-heading">
    <div className="sc-tile-bg rounded-[28px] border border-[rgba(var(--brand-100))] px-6 py-14 text-center md:px-16">
      <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-[rgba(var(--brand-200))] bg-white text-[rgba(var(--brand-900))]">
        <PhoneIcon size={20} />
      </span>
      <h2 id="phone-cta-heading" className="heading-lg mt-5">
        Prefer to order by phone?
      </h2>
      <p className="mx-auto mt-4 max-w-[560px] text-[18px] leading-[30px]">
        Call us and a friendly member of our team will help you find the right product and size,
        place the order and arrange delivery. No computer needed.
      </p>
      <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <a href={phoneHref} className="sc-btn h-14 px-7 text-[18px]">
          <PhoneIcon size={18} /> Call {BRAND.phone}
        </a>
        <a href={`${phoneHref}`} className="sc-pill h-14 px-7 text-[18px]">
          Ask us to call you back
        </a>
      </div>
      <p className="mt-5 text-[15px]">Open {BRAND.hours}, including public holidays</p>
    </div>
  </section>
)

/** Small side-card: "Not sure? Call us." Used on product, cart and checkout. */
export const PhoneHelpCard = ({
  title,
  body,
  className,
  compact = false,
}: {
  title: string
  body: string
  className?: string
  compact?: boolean
}) => (
  <aside className={cn("sc-card p-6", className)}>
    {compact ? (
      <div className="flex gap-3">
        <PhoneIcon size={20} className="mt-1 shrink-0 text-[rgba(var(--brand-900))]" />
        <div>
          <p className="text-[18px] font-semibold text-[rgba(var(--brand-900))]">{title}</p>
          <p className="mt-1 text-[16px]">{body}</p>
        </div>
      </div>
    ) : (
      <>
        <p className="text-[18px] font-semibold text-[rgba(var(--brand-900))]">{title}</p>
        <p className="mt-2 text-[16px]">{body}</p>
        <a href={phoneHref} className="sc-pill mt-5 h-12 w-full">
          <PhoneIcon size={18} /> Call {BRAND.phone}
        </a>
      </>
    )}
  </aside>
)
