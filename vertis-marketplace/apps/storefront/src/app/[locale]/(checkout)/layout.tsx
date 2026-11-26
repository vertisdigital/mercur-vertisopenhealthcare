import { LockIcon, PhoneIcon } from "@/components/silver/Icons"
import { Logo } from "@/components/silver/Logo"
import { TextSizeControl } from "@/components/silver/TextSizeControl"
import { BRAND, phoneHref } from "@/components/silver/brand"

export default async function CheckoutLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <header className="border-b border-primary bg-white">
        <div className="sc-shell flex flex-wrap items-center justify-between gap-4 py-4">
          <div className="flex items-center gap-4">
            <Logo />
            <span className="sc-pill hidden h-10 px-4 text-[15px] sm:inline-flex">
              <LockIcon size={16} /> Secure checkout
            </span>
          </div>
          <div className="flex items-center gap-5">
            <a
              href={phoneHref}
              className="hidden items-center gap-2 text-[16px] font-semibold text-[rgba(var(--brand-900))] hover:underline md:inline-flex"
            >
              <PhoneIcon size={17} /> Need help? {BRAND.phone}
            </a>
            <TextSizeControl />
          </div>
        </div>
      </header>
      <div id="main">{children}</div>
      <footer className="border-t border-primary bg-white">
        <div className="sc-shell flex flex-col gap-3 py-8 text-[15px] sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-center gap-2">
            <LockIcon size={16} /> Your details are sent securely and never shared.
          </p>
          <p>© 2026 {BRAND.name}. All prices include GST.</p>
        </div>
      </footer>
    </>
  )
}
