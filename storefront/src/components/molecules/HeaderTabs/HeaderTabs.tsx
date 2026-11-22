"use client"

import { usePathname } from "next/navigation"
import LocalizedClientLink from "@/components/molecules/LocalizedLink/LocalizedLink"

const CTG_ROUTES = [
  "caregivers-training-ctg",
  "dementia-cognitive-care",
  "wound-palliative-nursing",
  "activities-of-daily-living-adl",
  "psychosocial-resilient-caregiver",
]

export const HeaderTabs = () => {
  const pathname = usePathname() || ""
  const isCTG = CTG_ROUTES.some((route) => pathname.includes(route))

  return (
    <div className="flex items-end gap-2">
      {/* Tab 1: SMF Consumables */}
      <LocalizedClientLink
        href="/"
        className={`text-xs md:text-sm px-4 md:px-5 py-2.5 rounded-t-lg transition-all flex items-center gap-2 cursor-pointer ${
          !isCTG
            ? "bg-[#e05626] text-white font-bold shadow-xs border-t-2 border-[#e05626]"
            : "bg-white text-[#e05626] border border-b-0 border-[#e05626] font-semibold hover:bg-orange-50"
        }`}
      >
        {!isCTG && (
          <span className="w-2 h-2 rounded-full bg-white animate-pulse shrink-0"></span>
        )}
        <span>SMF Consumables</span>
      </LocalizedClientLink>

      {/* Tab 2: CTG Caregivers Training Catalogue */}
      <LocalizedClientLink
        href="/categories/caregivers-training-ctg"
        className={`text-xs md:text-sm px-4 md:px-5 py-2.5 rounded-t-lg transition-all flex items-center gap-2 cursor-pointer ${
          isCTG
            ? "bg-[#e05626] text-white font-bold shadow-xs border-t-2 border-[#e05626]"
            : "bg-white text-[#e05626] border border-b-0 border-[#e05626] font-semibold hover:bg-orange-50"
        }`}
      >
        {isCTG && (
          <span className="w-2 h-2 rounded-full bg-white animate-pulse shrink-0"></span>
        )}
        <span>CTG Caregivers Training Catalogue</span>
        <span
          className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
            isCTG
              ? "bg-white/20 text-white"
              : "bg-orange-100 text-[#e05626]"
          }`}
        >
          21 Courses
        </span>
      </LocalizedClientLink>
    </div>
  )
}

