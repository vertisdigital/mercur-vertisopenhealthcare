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
          placeholder="Search SMF consumables, TENA diapers, Ensure, Omron, CTG Dementia courses..."
          className="w-full bg-white text-gray-900 placeholder:text-gray-400 text-sm pl-4 pr-28 py-2.5 rounded-md border border-gray-300 focus:outline-none focus:border-[#e05626] focus:ring-1 focus:ring-[#e05626] shadow-inner"
        />
        <button
          type="submit"
          className="absolute right-1 top-1 bottom-1 bg-[#e05626] hover:bg-[#c8461b] text-white px-5 rounded-md font-semibold text-xs md:text-sm flex items-center gap-1.5 transition-colors shadow-sm"
          aria-label="Search"
        >
          <SearchIcon size={16} color="#ffffff" />
          <span className="hidden md:inline">Search</span>
        </button>
      </form>

      <div className="hidden lg:flex items-center gap-2 mt-1.5 text-[11px] text-gray-300 overflow-x-auto whitespace-nowrap no-scrollbar">
        <span className="text-gray-400">Popular:</span>
        {QUICK_TAGS.map((tag) => (
          <button
            key={tag.label}
            type="button"
            onClick={() => {
              setQuery(tag.query)
              handleSearch(tag.query)
            }}
            className="hover:text-white hover:underline transition-colors cursor-pointer"
          >
            {tag.label}
          </button>
        ))}
      </div>
    </div>
  )
}
