import React from "react"
import Link from "next/link"

export const ElderShopByNeed = () => {
  const aisles = [
    {
      icon: "💧",
      title: "Continence care",
      desc: "Catheters, drainage bags, pads",
      href: "/categories/incontinence-care",
    },
    {
      icon: "🩹",
      title: "Wound care",
      desc: "Dressings, bandages, skin barriers",
      href: "/categories/wound-skin-care",
    },
    {
      icon: "🦯",
      title: "Mobility aids",
      desc: "Rollators, walking sticks, wheelchairs",
      href: "/categories/daily-living-aids",
    },
    {
      icon: "🚿",
      title: "Bathroom safety",
      desc: "Grab rails, shower chairs, raised seats",
      href: "/categories/medical-devices",
    },
    {
      icon: "🍴",
      title: "Daily living",
      desc: "Easy-grip cutlery, pill organisers, reachers",
      href: "/categories/daily-living-aids",
    },
    {
      icon: "🧴",
      title: "Skin & personal care",
      desc: "Barrier creams, wipes, gloves",
      href: "/categories/wound-skin-care",
    },
  ]

  return (
    <section className="w-full py-10 md:py-14 bg-white">
      <div className="max-w-7xl mx-auto w-full px-4 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-[#0b3b2c]">
              Shop by need
            </h2>
            <p className="text-sm md:text-base text-gray-600 mt-1">
              Six simple aisles. Every product shows its size, pack count and price up front.
            </p>
          </div>
          <Link
            href="/categories"
            className="text-sm font-bold text-[#0b3b2c] hover:underline inline-flex items-center gap-1 shrink-0"
          >
            See all products →
          </Link>
        </div>

        {/* 6 Aisles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {aisles.map((aisle, idx) => (
            <Link
              key={idx}
              href={aisle.href}
              className="group border border-gray-200 hover:border-[#0b3b2c] rounded-2xl p-6 bg-white hover:bg-[#fbfdfc] transition-all duration-200 flex items-center justify-between shadow-2xs hover:shadow-md"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#f0fdf4] border border-[#d1fae5] flex items-center justify-center text-2xl group-hover:scale-105 transition-transform">
                  {aisle.icon}
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#0b3b2c] group-hover:text-[#062c20]">
                    {aisle.title}
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                    {aisle.desc}
                  </p>
                </div>
              </div>
              <span className="text-gray-400 group-hover:text-[#0b3b2c] text-lg font-bold transition-colors">
                →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
