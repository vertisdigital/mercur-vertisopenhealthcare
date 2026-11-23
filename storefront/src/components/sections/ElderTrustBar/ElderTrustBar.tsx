import React from "react"

export const ElderTrustBar = () => {
  const pillars = [
    {
      icon: "🚚",
      title: "Free delivery",
      desc: "On all orders over S$50",
    },
    {
      icon: "📦",
      title: "Discreet packaging",
      desc: "A plain box, no product names",
    },
    {
      icon: "🔄",
      title: "Repeat deliveries",
      desc: "Skip or cancel any time",
    },
    {
      icon: "📞",
      title: "Real people",
      desc: "Call us 9 am – 6 pm, every day",
    },
  ]

  return (
    <div className="w-full bg-white border-b border-gray-200 py-6">
      <div className="max-w-7xl mx-auto w-full px-4 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {pillars.map((p, idx) => (
            <div key={idx} className="flex items-start gap-3.5">
              <span className="text-2xl shrink-0 mt-0.5">{p.icon}</span>
              <div>
                <h4 className="text-sm md:text-base font-bold text-[#0b3b2c]">
                  {p.title}
                </h4>
                <p className="text-xs text-gray-600 mt-0.5">
                  {p.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
