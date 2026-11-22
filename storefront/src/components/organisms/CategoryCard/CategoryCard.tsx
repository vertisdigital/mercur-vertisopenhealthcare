import LocalizedClientLink from "@/components/molecules/LocalizedLink/LocalizedLink"
import Image from "next/image"

const CATEGORY_ICONS: Record<string, { icon: string; bg: string; color: string }> = {
  "incontinence-care": { icon: "💧", bg: "bg-blue-50", color: "text-blue-600" },
  "medical-nutrition": { icon: "🥛", bg: "bg-amber-50", color: "text-amber-600" },
  "medical-devices": { icon: "🩺", bg: "bg-red-50", color: "text-red-600" },
  "wound-skin-care": { icon: "🩹", bg: "bg-emerald-50", color: "text-emerald-600" },
  "daily-living-aids": { icon: "🦯", bg: "bg-purple-50", color: "text-purple-600" },
  "caregivers-training-ctg": { icon: "🎓", bg: "bg-teal-50", color: "text-teal-700" },
}

export function CategoryCard({
  category,
}: {
  category: { name: string; handle: string }
}) {
  const catVisual = CATEGORY_ICONS[category.handle] || {
    icon: "🏥",
    bg: "bg-orange-50",
    color: "text-[#e05626]",
  }

  return (
    <LocalizedClientLink
      href={`/categories/${category.handle}`}
      className="relative flex flex-col items-center justify-between border border-gray-200 rounded-xl bg-white p-5 transition-all hover:shadow-md hover:border-orange-300 w-[200px] aspect-square group"
    >
      <div
        className={`w-24 h-24 rounded-full ${catVisual.bg} flex items-center justify-center text-4xl shadow-inner group-hover:scale-110 transition-transform`}
      >
        <span>{catVisual.icon}</span>
      </div>
      <h3 className="w-full text-center text-xs md:text-sm font-bold text-gray-800 group-hover:text-[#e05626] transition-colors line-clamp-2">
        {category.name}
      </h3>
    </LocalizedClientLink>
  )
}

