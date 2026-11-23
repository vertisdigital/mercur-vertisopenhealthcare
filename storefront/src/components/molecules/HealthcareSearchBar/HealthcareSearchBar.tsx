"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { SearchIcon } from "@/icons"

interface Props {
  className?: string
}

const QUICK_TAGS = [
  { label: "TENA Adult Pants", query: "TENA" },
  { label: "Ensure Life Vanilla", query: "Ensure" },
  { label: "Omron BP Monitor", query: "Omron" },
  { label: "Dementia Care (CTG)", query: "Dementia" },
  { label: "Basic Wound Management", query: "Wound" },
  { label: "ADL Elderly Care", query: "Activities" },
]

export const HealthcareSearchBar = ({ className }: Props) => {
  const router = useRouter()
  const [query, setQuery] = useState("")

  const handleSearch = (searchTerm?: string) => {
    const q = (searchTerm !== undefined ? searchTerm : query).trim()
    if (q) {
      router.push(`/categories?query=${encodeURIComponent(q)}`)
    } else {
      router.push(`/categories`)
    }
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    handleSearch()
  }

  return (
    <div className={`w-full ${className || ""}`}>
      <form onSubmit={handleSubmit} className="relative flex items-center w-full">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder='Search, for example "dressings", "catheters", "walking stick"...'
          className="w-full bg-white text-gray-900 placeholder:text-gray-400 text-sm md:text-base pl-5 pr-28 py-3 rounded-full border border-gray-300 focus:outline-none focus:border-[#0b3b2c] focus:ring-1 focus:ring-[#0b3b2c] shadow-2xs"
        />
        <button
          type="submit"
          className="absolute right-1.5 top-1.5 bottom-1.5 bg-[#0b3b2c] hover:bg-[#062c20] text-white px-6 rounded-full font-bold text-xs md:text-sm flex items-center gap-1.5 transition-colors shadow-2xs"
          aria-label="Search"
        >
          <SearchIcon size={16} color="#ffffff" />
          <span>Search</span>
        </button>
      </form>

      <div className="hidden lg:flex items-center gap-2 mt-1.5 text-[11px] text-gray-500 overflow-x-auto whitespace-nowrap no-scrollbar px-2">
        <span className="font-semibold text-gray-400">Suggestions:</span>
        {QUICK_TAGS.map((tag) => (
          <button
            key={tag.label}
            type="button"
            onClick={() => {
              setQuery(tag.query)
              handleSearch(tag.query)
            }}
            className="hover:text-[#0b3b2c] hover:underline transition-colors cursor-pointer"
          >
            {tag.label}
          </button>
        ))}
      </div>
    </div>
  )
}
