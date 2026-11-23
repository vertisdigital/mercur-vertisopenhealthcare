import Image from "next/image"
import LocalizedClientLink from "@/components/molecules/LocalizedLink/LocalizedLink"

export function Footer() {
  return (
    <footer className="w-full bg-[#fbfdfc] border-t border-[#e6f0ea] mt-16" data-testid="footer">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Brand & Purpose Column */}
          <div className="space-y-4">
            <LocalizedClientLink href="/" className="inline-block">
              <Image
                src="/Logo.svg"
                width={150}
                height={40}
                alt="Vertis Open Healthcare"
                className="h-9 w-auto object-contain"
              />
            </LocalizedClientLink>
            <p className="text-sm text-gray-600 leading-relaxed">
              Care supplies, made simple. High-quality incontinence, wound care, and mobility essentials delivered straight to your door in discreet, unmarked plain boxes.
            </p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#ecfdf5] border border-[#a7f3d0] text-xs font-semibold text-[#065f46]">
              <span>🛡️</span>
              <span>Open, Unsubsidised Marketplace</span>
            </div>
          </div>

          {/* Need Help / Phone Column */}
          <div className="bg-[#ecfdf5]/50 border border-[#a7f3d0] rounded-2xl p-5 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#065f46]">Telephone Support</span>
            <h3 className="text-base font-bold text-[#0b3b2c]">
              Prefer to order or ask by phone?
            </h3>
            <p className="text-xs text-gray-600">
              Our Singapore care advisors can take your order or help you choose the right sizes.
            </p>
            <a
              href="tel:18001234567"
              className="inline-flex items-center gap-2 text-base font-extrabold text-[#0b3b2c] hover:underline"
            >
              <span>📞</span>
              <span>1800 123 4567</span>
            </a>
            <p className="text-[11px] text-gray-500">
              Monday to Saturday: 9:00 AM – 6:00 PM
            </p>
          </div>

          {/* Customer Care Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-[#0b3b2c]">
              Help & Information
            </h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <LocalizedClientLink href="/categories" className="hover:text-[#0b3b2c] transition-colors">
                  All Healthcare Products
                </LocalizedClientLink>
              </li>
              <li>
                <a href="#ordering-steps" className="hover:text-[#0b3b2c] transition-colors">
                  How Ordering Works
                </a>
              </li>
              <li>
                <span className="hover:text-[#0b3b2c] transition-colors cursor-pointer">
                  Discreet Packaging Guarantee
                </span>
              </li>
              <li>
                <span className="hover:text-[#0b3b2c] transition-colors cursor-pointer">
                  Delivery & Time Slots
                </span>
              </li>
              <li>
                <span className="hover:text-[#0b3b2c] transition-colors cursor-pointer">
                  Caregivers Training (CTG)
                </span>
              </li>
            </ul>
          </div>

          {/* Privacy & Legal */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-[#0b3b2c]">
              Privacy & Trust
            </h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <span className="hover:text-[#0b3b2c] transition-colors cursor-pointer">
                  Plain Unmarked Packaging
                </span>
              </li>
              <li>
                <span className="hover:text-[#0b3b2c] transition-colors cursor-pointer">
                  Privacy Policy & Data Security
                </span>
              </li>
              <li>
                <span className="hover:text-[#0b3b2c] transition-colors cursor-pointer">
                  Terms of Service
                </span>
              </li>
              <li>
                <span className="hover:text-[#0b3b2c] transition-colors cursor-pointer">
                  Returns & Replacements
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>© 2026 Vertis Open Healthcare Pte Ltd. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>🇸🇬 Serving all Singapore addresses</span>
            <span>•</span>
            <span>No account required</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
