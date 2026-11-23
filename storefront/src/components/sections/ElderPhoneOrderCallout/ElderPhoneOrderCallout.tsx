"use client"

import React from "react"

export const ElderPhoneOrderCallout = () => {
  return (
    <section className="w-full py-12 md:py-16 bg-white">
      <div className="max-w-4xl mx-auto w-full px-4 text-center">
        <div className="rounded-3xl border border-[#d5e7dd] bg-[#fbfdfc] p-8 md:p-12 shadow-xs">
          <div className="w-12 h-12 rounded-full bg-[#f0fdf4] border border-[#a7f3d0] text-emerald-800 text-xl flex items-center justify-center mx-auto mb-4">
            📞
          </div>
          
          <h2 className="text-2xl md:text-3xl font-bold text-[#0b3b2c] mb-3">
            Prefer to order by phone?
          </h2>
          
          <p className="text-sm md:text-base text-gray-600 max-w-xl mx-auto leading-relaxed mb-6">
            Call us and a friendly member of our team will help you find the right product and size, place the order and arrange delivery. No computer needed.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="tel:18001234567"
              className="bg-[#0b3b2c] hover:bg-[#062c20] text-white text-sm md:text-base font-bold px-7 py-3 rounded-full transition-all inline-flex items-center gap-2 shadow-sm"
            >
              <span>📞</span> Call 1800 XXX XXXX
            </a>
            <button
              type="button"
              onClick={() => alert("Our team will call you back within 15 minutes during operating hours (9am - 6pm).")}
              className="bg-white hover:bg-gray-50 border border-gray-300 text-[#0b3b2c] text-sm md:text-base font-semibold px-6 py-3 rounded-full transition-all"
            >
              Ask us to call you back
            </button>
          </div>

          <p className="text-xs text-gray-500 mt-5">
            Open 9 am – 6 pm, every day including public holidays
          </p>
        </div>
      </div>
    </section>
  )
}
