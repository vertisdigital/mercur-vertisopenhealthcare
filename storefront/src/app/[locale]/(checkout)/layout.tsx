import { Button } from "@/components/atoms"
import LocalizedClientLink from "@/components/molecules/LocalizedLink/LocalizedLink"
import { CollapseIcon } from "@/icons"
import Image from "next/image"

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <header className="border-b border-[#e6f0ea] bg-white">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <LocalizedClientLink href="/" className="inline-block">
              <Image
                src="/Logo.svg"
                width={140}
                height={38}
                alt="Vertis Open Healthcare"
                priority
                className="h-8 md:h-9 w-auto object-contain"
              />
            </LocalizedClientLink>
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fbfdfc] border border-gray-200 text-xs font-semibold text-gray-700">
              <span>🔒</span>
              <span>Secure checkout</span>
            </span>
          </div>

          <div className="flex items-center gap-3 md:gap-5 text-xs font-semibold text-[#0b3b2c]">
            <a
              href="tel:18001234567"
              className="flex items-center gap-1.5 hover:underline"
            >
              <span>📞</span>
              <span className="hidden sm:inline">Need help?</span>
              <span>1800 XXX XXXX</span>
            </a>

            <div className="hidden md:flex items-center gap-1.5 text-gray-500 font-normal">
              <span>Text size</span>
              <span className="w-6 h-6 rounded-full bg-[#0b3b2c] text-white text-[11px] font-bold flex items-center justify-center">
                A
              </span>
              <span className="w-6 h-6 rounded-full border border-gray-300 text-gray-700 text-xs font-bold flex items-center justify-center">
                A
              </span>
              <span className="w-6 h-6 rounded-full border border-gray-300 text-gray-700 text-sm font-bold flex items-center justify-center">
                A
              </span>
            </div>

            <LocalizedClientLink href="/cart">
              <Button variant="tonal" className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 hover:text-[#0b3b2c] rounded-full">
                <CollapseIcon className="rotate-90" />
                <span className="hidden sm:inline">Cart</span>
              </Button>
            </LocalizedClientLink>
          </div>
        </div>
      </header>
      {children}
    </>
  )
}
