"use client"

import { useSearchParams } from "next/navigation"

import { cn } from "@/lib/utils"

const STEPS = ["Delivery", "Payment", "Review"]

const stepIndex = (step: string | null) => {
  if (step === "payment") return 1
  if (step === "review") return 2
  return 0 // address + delivery
}

export const CheckoutStepper = () => {
  const searchParams = useSearchParams()
  const current = stepIndex(searchParams.get("step"))

  return (
    <ol className="mb-10 grid grid-cols-3 gap-3" aria-label="Checkout progress" data-testid="checkout-stepper">
      {STEPS.map((label, i) => {
        const done = i < current
        const active = i === current
        return (
          <li key={label} aria-current={active ? "step" : undefined}>
            <div
              className={cn(
                "h-1.5 rounded-full",
                i <= current ? "bg-[rgba(var(--brand-900))]" : "bg-[rgba(var(--brand-50))]"
              )}
            />
            <div className="mt-3 flex items-center gap-3">
              <span
                className={cn(
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 text-[17px] font-semibold",
                  done
                    ? "border-[rgba(var(--brand-900))] bg-[rgba(var(--brand-900))] text-white"
                    : active
                    ? "border-[rgba(var(--brand-900))] text-[rgba(var(--brand-900))]"
                    : "border-[rgba(var(--brand-200))] text-[rgba(var(--neutral-500))]"
                )}
              >
                {done ? "✓" : i + 1}
              </span>
              <span className="min-w-0">
                <span className="block text-[14px]">Step {i + 1} of 3</span>
                <span
                  className={cn(
                    "block text-[18px] font-semibold",
                    active || done ? "text-[rgba(var(--brand-900))]" : "text-[rgba(var(--neutral-500))]"
                  )}
                >
                  {label}
                </span>
              </span>
            </div>
          </li>
        )
      })}
    </ol>
  )
}
