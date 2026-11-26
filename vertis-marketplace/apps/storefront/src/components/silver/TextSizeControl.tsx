"use client"

import { useEffect, useState } from "react"

import { cn } from "@/lib/utils"

type TextSize = "normal" | "large" | "xlarge"

const OPTIONS: { value: TextSize; label: string; px: number }[] = [
  { value: "normal", label: "Standard text size", px: 14 },
  { value: "large", label: "Larger text size", px: 16 },
  { value: "xlarge", label: "Largest text size", px: 19 },
]

const STORAGE_KEY = "sc-text-size"

const apply = (size: TextSize) => {
  const root = document.documentElement
  if (size === "normal") delete root.dataset.textSize
  else root.dataset.textSize = size
}

export const TextSizeControl = ({ className }: { className?: string }) => {
  const [size, setSize] = useState<TextSize>("normal")

  useEffect(() => {
    const current = document.documentElement.dataset.textSize as TextSize | undefined
    if (current === "large" || current === "xlarge") setSize(current)
  }, [])

  const choose = (next: TextSize) => {
    setSize(next)
    apply(next)
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // Private mode: the choice still applies for this page view.
    }
  }

  return (
    <div
      role="radiogroup"
      aria-label="Text size"
      className={cn("flex items-center gap-2", className)}
      data-testid="text-size-control"
    >
      <span className="hidden text-[14px] text-[rgba(var(--neutral-500))] sm:inline">Text size</span>
      {OPTIONS.map((option) => {
        const selected = size === option.value
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={selected}
            aria-label={option.label}
            onClick={() => choose(option.value)}
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-full border font-semibold transition-colors",
              selected
                ? "border-[rgba(var(--brand-900))] bg-[rgba(var(--brand-900))] text-white"
                : "border-[rgba(var(--brand-200))] bg-white text-[rgba(var(--brand-900))] hover:bg-[rgba(var(--brand-25))]"
            )}
            style={{ fontSize: option.px }}
          >
            A
          </button>
        )
      })}
    </div>
  )
}
