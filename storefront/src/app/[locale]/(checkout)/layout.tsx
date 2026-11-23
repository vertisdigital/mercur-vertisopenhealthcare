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
      <header className="border-b border-[#e6f0ea] bg-[#fbfdfc]">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-3.5 flex items-center justify-between">
          <div>
            <LocalizedClientLink href="/cart">
              <Button variant="tonal" className="flex items-center gap-2 text-xs font-semibold text-gray-700 hover:text-[#0b3b2c]">
                <CollapseIcon className="rotate-90" />
                <span>Back to cart</span>
              </Button>
            </LocalizedClientLink>
          </div>
          <div className="flex items-center justify-center">
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
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#0b3b2c]">
            <span className="hidden sm:inline text-gray-500 font-normal">Need help ordering?</span>
            <a href="tel:18001234567" className="flex items-center gap-1 bg-[#ecfdf5] px-3 py-1.5 rounded-full border border-[#a7f3d0] hover:bg-[#d1fae5] transition-colors">
              <span>📞</span>
              <span>1800 123 4567</span>
            </a>
          </div>
        </div>
      </header>
      {children}
    </>
  )
}
