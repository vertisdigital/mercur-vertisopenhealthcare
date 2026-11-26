import LocalizedClientLink from "@/components/molecules/LocalizedLink/LocalizedLink"

import {
  ArrowRightIcon,
  CheckIcon,
  PhoneIcon,
  TruckIcon,
} from "../Icons"
import { phoneHref } from "../brand"

/** Illustrative "your delivery" card from the design — shows the service promise at a glance. */
const DeliveryCard = () => (
  <div
    className="w-full max-w-[420px] rounded-[24px] border border-[rgba(var(--brand-200))] bg-white p-6 shadow-[0_20px_60px_rgba(1,53,51,0.10)]"
    aria-label="Example of a repeat delivery"
    role="img"
  >
    <p className="text-[14px]">Your monthly delivery</p>
    <p className="mt-1 text-[22px] font-semibold text-[rgba(var(--brand-900))]">Arriving today, 2 pm – 5 pm</p>
    <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[rgba(var(--brand-900))] px-3 py-1 text-[14px] font-semibold text-white">
      <TruckIcon size={15} /> On its way
    </span>

    <div className="mt-5 divide-y divide-[rgba(var(--brand-50))] rounded-[16px] bg-[rgba(var(--brand-25))]">
      {[
        { name: "Intermittent Catheters, CH12", pack: "Box of 30", price: "S$54.00" },
        { name: "Silicone Foam Dressings", pack: "Pack of 10", price: "S$38.00" },
      ].map((item) => (
        <div key={item.name} className="flex items-center gap-3 p-3.5">
          <span className="h-11 w-11 shrink-0 rounded-[12px] border border-[rgba(var(--brand-50))] bg-white" />
          <div className="min-w-0 flex-1">
            <p className="text-[16px] font-semibold leading-[22px] text-[rgba(var(--brand-900))]">{item.name}</p>
            <p className="text-[14px]">{item.pack}</p>
          </div>
          <p className="text-[16px] font-semibold text-[rgba(var(--brand-900))]">{item.price}</p>
        </div>
      ))}
    </div>

    <ol className="mt-5 space-y-4">
      {[
        { title: "Packed in a plain box", body: "Nothing on the outside says what’s inside", state: "done" },
        { title: "Out for delivery", body: "Our driver will call 30 minutes before arriving", state: "now" },
        { title: "Next delivery: 21 December", body: "We’ll text you 3 days before — skip or change any time", state: "next" },
      ].map((step) => (
        <li key={step.title} className="flex gap-3">
          <span
            className={
              step.state === "done"
                ? "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[rgba(var(--brand-900))] text-white"
                : "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-[rgba(var(--brand-900))]"
            }
          >
            {step.state === "done" && <CheckIcon size={14} strokeWidth={2.5} />}
            {step.state === "now" && <span className="h-2.5 w-2.5 rounded-full bg-[rgba(var(--brand-900))]" />}
          </span>
          <div>
            <p className="text-[16px] font-semibold text-[rgba(var(--brand-900))]">{step.title}</p>
            <p className="text-[14px] leading-[20px]">{step.body}</p>
          </div>
        </li>
      ))}
    </ol>

    <div className="mt-5 flex items-center justify-between border-t border-primary pt-4">
      <p className="text-[15px]">Need to change something?</p>
      <span className="sc-pill h-10 px-4 text-[15px]">
        <PhoneIcon size={15} /> Call us
      </span>
    </div>
  </div>
)

export const HomeHero = () => (
  <section className="sc-tile-bg border-b border-primary" aria-labelledby="hero-heading">
    <div className="sc-shell grid items-center gap-12 py-14 md:py-20 lg:grid-cols-[1.1fr_1fr]">
      <div>
        <LocalizedClientLink
          href="/categories"
          className="inline-flex items-center gap-2 rounded-full border border-[rgba(var(--brand-200))] bg-white py-1 pl-1 pr-4 text-[15px] font-medium text-[rgba(var(--brand-900))] hover:bg-[rgba(var(--brand-25))]"
        >
          <span className="rounded-full bg-[rgba(var(--brand-900))] px-2.5 py-0.5 text-[13px] font-bold text-white">New</span>
          Repeat deliveries, so you never run out <ArrowRightIcon size={15} />
        </LocalizedClientLink>

        <h1 id="hero-heading" className="mt-6 text-[44px] font-bold leading-[1.02] md:text-[64px]">
          Care supplies,
          <br />
          <span className="text-[rgba(var(--brand-400))]">made simple.</span>
        </h1>
        <p className="mt-6 max-w-[520px] text-[19px] leading-[32px]">
          Catheters, wound dressings, mobility aids and more — delivered to your door in a plain box.
          Clear sizes, honest prices, and a real person to help whenever you need one.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <LocalizedClientLink href="/categories" className="sc-btn h-14 px-7 text-[18px]">
            Start shopping <ArrowRightIcon size={18} />
          </LocalizedClientLink>
          <a href="#how-it-works" className="sc-pill h-14 px-7 text-[18px]">
            How ordering works
          </a>
        </div>

        <ul className="mt-7 flex flex-wrap gap-x-6 gap-y-2 text-[16px]">
          {["No account needed", "Plain, unmarked packaging", "Pay on delivery"].map((point) => (
            <li key={point} className="flex items-center gap-2">
              <CheckIcon size={17} className="text-[rgba(var(--brand-900))]" /> {point}
            </li>
          ))}
        </ul>
        <p className="sr-only">
          Or call us on <a href={phoneHref}>our helpline</a>.
        </p>
      </div>

      <div className="flex justify-center lg:justify-end">
        <DeliveryCard />
      </div>
    </div>
  </section>
)
