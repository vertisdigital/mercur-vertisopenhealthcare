import { HttpTypes } from "@medusajs/types"

import LocalizedClientLink from "@/components/molecules/LocalizedLink/LocalizedLink"
import { ArrowUpIcon } from "@/components/silver/Icons"
import { Logo } from "@/components/silver/Logo"
import { BRAND } from "@/components/silver/brand"
import { listCategories } from "@/lib/data/categories"

const help = [
  { label: "Track my order", path: "/user/orders" },
  { label: "My account", path: "/user" },
  { label: "Contact us", path: "#contact" },
  { label: "Accessibility", path: "#accessibility" },
]

const company = [
  { label: "About us", path: "#about" },
  { label: "Our promise", path: "#promise" },
  { label: "Privacy", path: "#privacy" },
  { label: "Terms", path: "#terms" },
]

const FooterColumn = ({
  title,
  links,
}: {
  title: string
  links: { label: string; path: string }[]
}) => (
  <nav aria-label={title}>
    <h2 className="mb-4 text-[17px] font-semibold">{title}</h2>
    <ul className="space-y-3">
      {links.map(({ label, path }) => (
        <li key={label}>
          {path.startsWith("#") ? (
            <a href={path} className="text-[16px] hover:text-[rgba(var(--brand-900))] hover:underline">
              {label}
            </a>
          ) : (
            <LocalizedClientLink
              href={path}
              className="text-[16px] hover:text-[rgba(var(--brand-900))] hover:underline"
            >
              {label}
            </LocalizedClientLink>
          )}
        </li>
      ))}
    </ul>
  </nav>
)

export async function Footer() {
  const { parentCategories } = (await listCategories().catch(() => ({
    parentCategories: [],
  }))) as { parentCategories: HttpTypes.StoreProductCategory[] }

  const shop = parentCategories.slice(0, 4).map((c) => ({
    label: c.name,
    path: `/categories/${c.handle}`,
  }))

  return (
    <footer className="border-t border-primary bg-white" data-testid="footer">
      <div className="sc-shell grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo />
          <p className="mt-4 max-w-[220px] text-[16px]">{BRAND.tagline}</p>
        </div>
        <FooterColumn title="Shop" links={shop.length ? shop : [{ label: "All products", path: "/categories" }]} />
        <FooterColumn title="Help" links={help} />
        <FooterColumn title={BRAND.name} links={company} />
      </div>
      <div className="sc-shell">
        <div
          className="flex flex-col gap-4 border-t border-primary py-8 text-[15px] sm:flex-row sm:items-center sm:justify-between"
          data-testid="footer-copyright"
        >
          <p>
            © 2026 {BRAND.name}. All prices include GST. Always follow the advice of your doctor or nurse.
          </p>
          <a href="#main" className="inline-flex items-center gap-1.5 font-semibold text-[rgba(var(--brand-900))]">
            Back to top <ArrowUpIcon size={16} />
          </a>
        </div>
      </div>
    </footer>
  )
}
