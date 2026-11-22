import Link from "next/link"

export const OfficialBrandMalls = () => {
  const brands = [
    {
      name: "TENA Singapore",
      tagline: "No. 1 Adult Incontinence Care in Singapore",
      badge: "Official Mall",
      badgeColor: "bg-red-100 text-red-700",
      query: "TENA",
      products: "Adult Pants, Diapers, Wet Wipes",
      rating: "4.9 ★ (3.2k reviews)",
    },
    {
      name: "Abbott Nutrition SG",
      tagline: "Complete & Balanced Medical Nutrition",
      badge: "Official Mall",
      badgeColor: "bg-red-100 text-red-700",
      query: "Ensure",
      products: "Ensure Life Vanilla, Glucerna Triple Care",
      rating: "5.0 ★ (4.8k reviews)",
    },
    {
      name: "Omron Healthcare SG",
      tagline: "Clinically Validated Home Healthcare Monitors",
      badge: "Official Mall",
      badgeColor: "bg-red-100 text-red-700",
      query: "Omron",
      products: "BP Monitors, Forehead Thermometers",
      rating: "4.9 ★ (2.1k reviews)",
    },
    {
      name: "Autism Resource Centre (Singapore)",
      tagline: "Singapore Pioneer in Autism Caregiving & Workplace Inclusion",
      badge: "CTG Training Institute",
      badgeColor: "bg-emerald-100 text-emerald-800",
      query: "Autism",
      products: "Fundamentals of Autism, Dialogic Reading, Teenager Support",
      rating: "5.0 ★ (1.5k graduates)",
    },
    {
      name: "Academy of Human Development Pte Ltd",
      tagline: "WSQ Accredited Senior Caregiving & Behaviour Management",
      badge: "WSQ Certified",
      badgeColor: "bg-emerald-100 text-emerald-800",
      query: "Challenging",
      products: "Managing Challenging Behaviours of Seniors, Dementia Care",
      rating: "4.9 ★ (890+ graduates)",
    },
    {
      name: "Jaga-Me Pte Ltd",
      tagline: "Premier Home-Based Caregiving & Personal Hygiene Training",
      badge: "Home-Based Care",
      badgeColor: "bg-emerald-100 text-emerald-800",
      query: "Jaga",
      products: "Basic Caregiving for Persons with Disabilities, ADL Training",
      rating: "5.0 ★ (620+ graduates)",
    },
  ]

  return (
    <section className="w-full my-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="bg-red-600 text-white text-[11px] font-extrabold uppercase px-2 py-0.5 rounded tracking-wider shadow-xs">
            VERIFIED PARTNERS
          </span>
          <h3 className="text-xl md:text-2xl font-extrabold text-gray-900 uppercase tracking-tight">
            Official Suppliers & Accredited CTG Training Institutes
          </h3>
        </div>
        <Link
          href="/categories"
          className="text-xs md:text-sm font-semibold text-[#e05626] hover:underline"
        >
          View Full Directory →
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {brands.map((brand) => (
          <Link
            key={brand.name}
            href={`/categories?query=${encodeURIComponent(brand.query)}`}
            className="group block p-4 md:p-5 rounded-xl border border-gray-200 bg-white hover:border-orange-400 hover:shadow-md transition-all relative overflow-hidden"
          >
            <div className="flex items-start justify-between mb-2.5">
              <div>
                <span className={`inline-block ${brand.badgeColor} text-[10px] font-bold uppercase px-2 py-0.5 rounded-full mb-1`}>
                  ✓ {brand.badge}
                </span>
                <h4 className="text-sm md:text-base font-bold text-gray-900 group-hover:text-[#e05626] transition-colors line-clamp-1">
                  {brand.name}
                </h4>
              </div>
              <span className="text-xs font-semibold text-amber-500 shrink-0">
                {brand.rating}
              </span>
            </div>
            <p className="text-xs text-gray-600 mb-2 line-clamp-1">{brand.tagline}</p>
            <div className="text-[11px] text-gray-400 truncate">
              <span className="font-medium text-gray-500">Focus: </span>
              {brand.products}
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
