"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { Input } from "@/components/atoms"
import { DollarIcon } from "@/icons"

export const PriceFilter = () => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [min, setMin] = useState("")
  const [max, setMax] = useState("")

  useEffect(() => {
    setMin(searchParams.get("min_price") || "")
    setMax(searchParams.get("max_price") || "")
  }, [searchParams])

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams(searchParams.toString())
    if (min.trim()) {
      params.set("min_price", min.trim())
    } else {
      params.delete("min_price")
    }

    if (max.trim()) {
      params.set("max_price", max.trim())
    } else {
      params.delete("max_price")
    }

    params.delete("page")
    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }

  const handleClear = () => {
    setMin("")
    setMax("")
    const params = new URLSearchParams(searchParams.toString())
    params.delete("min_price")
    params.delete("max_price")
    params.delete("page")
    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }

  const isPriceActive = Boolean(searchParams.get("min_price") || searchParams.get("max_price"))

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 flex items-center gap-1.5">
          <span>💰</span>
          <span>Price Range (S$)</span>
        </h4>
        {isPriceActive && (
          <button
            type="button"
            onClick={handleClear}
            className="text-[11px] text-gray-400 hover:text-[#e05626]"
          >
            Clear
          </button>
        )}
      </div>

      <form onSubmit={handleApply} className="space-y-2">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Min"
            icon={<DollarIcon size={14} />}
            onChange={(e) => setMin(e.target.value)}
            value={min}
            type="number"
            className="no-arrows-number-input text-xs"
          />
          <span className="text-gray-400 text-xs">-</span>
          <Input
            placeholder="Max"
            icon={<DollarIcon size={14} />}
            onChange={(e) => setMax(e.target.value)}
            value={max}
            type="number"
            className="no-arrows-number-input text-xs"
          />
        </div>
        <button
          type="submit"
          className="w-full py-1.5 px-3 bg-gray-100 hover:bg-[#e05626] hover:text-white text-gray-700 text-xs font-bold rounded transition-colors cursor-pointer"
        >
          Apply Price
        </button>
      </form>
    </div>
  )
}
