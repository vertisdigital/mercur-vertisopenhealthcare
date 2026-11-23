import React from "react"

export const ElderOrderingSteps = () => {
  const steps = [
    {
      step: "1",
      title: "Find what you need",
      desc: "Browse by need or search in plain words. Sizes, pack counts and prices are always shown up front.",
    },
    {
      step: "2",
      title: "Order once, or repeat it",
      desc: "Choose a one-off order or a repeat delivery every 4 weeks. Pay by card, PayNow, or cash when it arrives.",
    },
    {
      step: "3",
      title: "We bring it to your door",
      desc: "Everything arrives in a plain box. Our driver calls 30 minutes before and can carry it inside.",
    },
  ]

  return (
    <section id="how-it-works" className="w-full py-12 md:py-16 bg-[#fbfdfc] border-y border-[#e6f0ea]">
      <div className="max-w-7xl mx-auto w-full px-4 lg:px-8">
        <div className="mb-10 text-left">
          <h2 className="text-2xl md:text-3xl font-bold text-[#0b3b2c]">
            Ordering, in three steps
          </h2>
          <p className="text-sm md:text-base text-gray-600 mt-1">
            No passwords to remember and no surprises at the end.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((s, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-[#d5e7dd] p-7 shadow-2xs flex flex-col justify-between space-y-4"
            >
              <div className="w-9 h-9 rounded-full border-2 border-[#0b3b2c] text-[#0b3b2c] font-bold text-base flex items-center justify-center shrink-0">
                {s.step}
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-gray-900">
                  {s.title}
                </h3>
                <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
                  {s.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
