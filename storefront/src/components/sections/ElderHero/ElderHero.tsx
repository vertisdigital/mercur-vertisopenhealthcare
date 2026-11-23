"use client"

import React from "react"
import Link from "next/link"

export const ElderHero = () => {
  return (
    <section className="w-full bg-[#fbfdfc] border-b border-[#e6f0ea] py-10 md:py-16">
      <div className="max-w-7xl mx-auto w-full px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Headline & Value Proposition */}
          <div className="lg:col-span-7 flex flex-col items-start space-y-6">
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 bg-[#0b3b2c] text-white text-xs md:text-sm font-medium px-4 py-1.5 rounded-full">
              <span className="font-bold">New</span>
              <span>Repeat deliveries, so you never run out →</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-[#0b3b2c] leading-[1.15]">
              Care supplies, <br />
              made simple.
            </h1>

            {/* Subheading */}
            <p className="text-base md:text-xl text-[#334e45] max-w-xl leading-relaxed">
              Catheters, wound dressings, mobility aids and more — delivered to your door in a plain box. Clear sizes, honest prices, and a real person to help whenever you need one.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/categories"
                className="bg-[#0b3b2c] hover:bg-[#062c20] text-white text-base md:text-lg font-bold px-8 py-3.5 rounded-full shadow-sm hover:shadow transition-all inline-flex items-center gap-2"
              >
                Start shopping →
              </Link>
              <a
                href="#how-it-works"
                className="bg-white hover:bg-gray-50 border border-gray-300 text-[#0b3b2c] text-base md:text-lg font-semibold px-7 py-3.5 rounded-full transition-all"
              >
                How ordering works
              </a>
            </div>

            {/* 3 Trust Checkmarks */}
            <div className="flex flex-wrap items-center gap-6 pt-4 text-xs md:text-sm font-semibold text-[#0b3b2c]">
              <div className="flex items-center gap-2">
                <span className="text-emerald-700 font-bold">✓</span>
                <span>No account needed</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-emerald-700 font-bold">✓</span>
                <span>Plain, unmarked packaging</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-emerald-700 font-bold">✓</span>
                <span>Pay on delivery</span>
              </div>
            </div>
          </div>

          {/* Right Column: Live Order & Delivery Tracker Preview Card */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-3xl border border-[#d5e7dd] p-6 md:p-8 shadow-sm">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <div>
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Your monthly delivery
                  </div>
                  <div className="text-lg md:text-xl font-bold text-[#0b3b2c] mt-0.5">
                    Arriving today, 2 pm – 5 pm
                  </div>
                </div>
                <span className="inline-flex items-center gap-1.5 bg-[#ecfdf5] text-[#065f46] text-xs font-bold px-3 py-1.5 rounded-full border border-[#a7f3d0]">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  On its way
                </span>
              </div>

              {/* Items List */}
              <div className="py-4 space-y-3 border-b border-gray-100">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#f0fdf4] border border-[#d1fae5] flex items-center justify-center text-lg">
                      🧴
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">Intermittent Catheters, CH12</div>
                      <div className="text-xs text-gray-500">Box of 30</div>
                    </div>
                  </div>
                  <div className="font-bold text-[#0b3b2c]">S$54.00</div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#f0fdf4] border border-[#d1fae5] flex items-center justify-center text-lg">
                      🩹
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">Silicone Foam Dressings</div>
                      <div className="text-xs text-gray-500">Pack of 10</div>
                    </div>
                  </div>
                  <div className="font-bold text-[#0b3b2c]">S$38.00</div>
                </div>
              </div>

              {/* Delivery Stepper */}
              <div className="py-4 space-y-4 text-xs md:text-sm">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#0b3b2c] text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                    ✓
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">Packed in a plain box</div>
                    <div className="text-gray-500 text-xs">Nothing on the outside says what's inside</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full border-2 border-[#0b3b2c] bg-white text-[#0b3b2c] flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                    ●
                  </div>
                  <div>
                    <div className="font-bold text-[#0b3b2c]">Out for delivery</div>
                    <div className="text-gray-600 text-xs">Our driver will call 30 minutes before arriving</div>
                  </div>
                </div>

                <div className="flex items-start gap-3 opacity-60">
                  <div className="w-5 h-5 rounded-full border border-gray-300 bg-white text-gray-400 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                    ○
                  </div>
                  <div>
                    <div className="font-bold text-gray-800">Next delivery: 21 December</div>
                    <div className="text-gray-500 text-xs">We'll text you 3 days before — skip or change any time</div>
                  </div>
                </div>
              </div>

              {/* Bottom Support Callout */}
              <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                <span className="text-xs font-medium text-gray-600">Need to change something?</span>
                <a
                  href="tel:18001234567"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0b3b2c] hover:text-[#062c20] bg-[#f0fdf4] hover:bg-[#dcfce7] border border-[#bbf7d0] px-3.5 py-1.5 rounded-full transition-colors"
                >
                  <span>📞</span> Call us
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
