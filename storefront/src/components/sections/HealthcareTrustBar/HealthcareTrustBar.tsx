export const HealthcareTrustBar = () => {
  const benefits = [
    {
      icon: "🛡️",
      title: "100% Genuine Supplies",
      desc: "Direct from TENA, Abbott & Omron SG",
      tag: "Official Brands",
    },
    {
      icon: "🇸🇬",
      title: "SMF Subsidy Eligible",
      desc: "AIC Senior Mobility scheme ready",
      tag: "Govt Scheme",
    },
    {
      icon: "🚚",
      title: "Islandwide Delivery",
      desc: "Free standard delivery above S$50",
      tag: "Singapore Only",
    },
    {
      icon: "🏢",
      title: "Corporate Portal",
      desc: "For nursing homes, hospitals & VWOs",
      tag: "B2B Support",
    },
  ]

  return (
    <div className="w-full bg-[#f8fafc] border-y border-gray-200 py-3">
      <div className="max-w-7xl mx-auto w-full px-4 lg:px-8 grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {benefits.map((b) => (
          <div
            key={b.title}
            className="flex items-center gap-3 p-2 rounded-md bg-white border border-gray-100 shadow-xs hover:border-orange-200 transition-colors"
          >
            <span className="text-2xl p-2 rounded-md bg-orange-50 shrink-0">
              {b.icon}
            </span>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h4 className="text-xs md:text-sm font-bold text-gray-900 truncate">
                  {b.title}
                </h4>
                <span className="hidden xl:inline-block text-[9px] font-semibold uppercase px-1.5 py-0.5 rounded bg-orange-100 text-[#e05626]">
                  {b.tag}
                </span>
              </div>
              <p className="text-[11px] text-gray-500 truncate">{b.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
