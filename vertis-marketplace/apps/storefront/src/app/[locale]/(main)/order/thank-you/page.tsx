import { Metadata } from "next"
import { Suspense } from "react"

import LocalizedClientLink from "@/components/molecules/LocalizedLink/LocalizedLink"
import { BoxIcon, CheckIcon, PhoneIcon, TruckIcon } from "@/components/silver/Icons"
import { BRAND, phoneHref } from "@/components/silver/brand"
import { convertToLocale } from "@/lib/helpers/money"

export const metadata: Metadata = {
  title: "Thank you for your order",
  robots: { index: false, follow: false },
}

type SearchParams = Promise<{ total?: string; currency?: string; orders?: string }>

export default function ThankYouPage({ searchParams }: { searchParams: SearchParams }) {
  return (
    <main className="container">
      <Suspense fallback={<div className="h-96" aria-busy="true" />}>
        <ThankYou searchParams={searchParams} />
      </Suspense>
    </main>
  )
}

async function ThankYou({ searchParams }: { searchParams: SearchParams }) {
  const { total, currency, orders } = await searchParams

  const orderList = (orders ?? "")
    .split("|")
    .filter(Boolean)
    .map((entry) => {
      const [number, seller] = entry.split("~")
      return { number, seller }
    })

  const totalLabel =
    total && currency && !Number.isNaN(Number(total))
      ? convertToLocale({ amount: Number(total), currency_code: currency })
      : null

  return (
    <div className="mx-auto max-w-[720px] py-6" data-testid="order-thank-you">
      <div className="sc-tile-bg rounded-[28px] border border-primary px-6 py-12 text-center md:px-12">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[rgba(var(--brand-900))] text-white">
          <CheckIcon size={30} strokeWidth={2.5} />
        </span>
        <h1 className="heading-xl mt-6">Thank you — your order is placed</h1>
        <p className="mx-auto mt-4 max-w-[520px] text-[19px] leading-[30px]">
          We’ve sent a confirmation to your email. You don’t need to do anything else.
        </p>

        {(orderList.length > 0 || totalLabel) && (
          <dl className="mx-auto mt-8 max-w-[440px] divide-y divide-[rgba(var(--brand-50))] rounded-[18px] border border-primary bg-white text-left">
            {orderList.map((o) => (
              <div key={`${o.number}-${o.seller}`} className="flex justify-between gap-4 px-5 py-4 text-[17px]">
                <dt>
                  Order number
                  {orderList.length > 1 && o.seller ? <span className="block text-[15px]">from {o.seller}</span> : null}
                </dt>
                <dd className="text-[20px] font-bold text-[rgba(var(--brand-900))]">#{o.number}</dd>
              </div>
            ))}
            {totalLabel && (
              <div className="flex justify-between gap-4 px-5 py-4 text-[17px]">
                <dt>Total</dt>
                <dd className="text-[20px] font-bold text-[rgba(var(--brand-900))]">{totalLabel}</dd>
              </div>
            )}
          </dl>
        )}
      </div>

      <h2 className="heading-md mt-12">What happens next</h2>
      <ol className="mt-5 space-y-5">
        {[
          { icon: BoxIcon, title: "We pack your order in a plain box", body: "Nothing on the outside says what’s inside." },
          { icon: TruckIcon, title: "Our driver calls before arriving", body: "About 30 minutes before, on the mobile number you gave us." },
          { icon: CheckIcon, title: "Pay when it arrives, if you chose to", body: "Cash or PayNow at the door." },
        ].map(({ icon: Icon, title, body }) => (
          <li key={title} className="flex gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[rgba(var(--brand-200))] text-[rgba(var(--brand-900))]">
              <Icon size={20} />
            </span>
            <div>
              <p className="text-[18px] font-semibold text-[rgba(var(--brand-900))]">{title}</p>
              <p className="text-[16px]">{body}</p>
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        <LocalizedClientLink href="/" className="sc-btn h-14 flex-1 text-[18px]">
          Back to the shop
        </LocalizedClientLink>
        <a href={phoneHref} className="sc-pill h-14 flex-1 text-[18px]">
          <PhoneIcon size={18} /> Call {BRAND.phone}
        </a>
      </div>
    </div>
  )
}
