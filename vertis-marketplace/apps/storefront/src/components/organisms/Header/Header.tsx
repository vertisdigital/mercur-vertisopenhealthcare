import { Suspense } from "react"
import { HttpTypes } from "@medusajs/types"

import { CartButton } from "@/components/cells/CartButton/CartButton"
import { MobileNavbar } from "@/components/cells/MobileNavbar/MobileNavbar"
import { CategoryLinks } from "@/components/silver/CategoryLinks"
import { HeaderSearch } from "@/components/silver/HeaderSearch"
import { BagIcon, PhoneIcon } from "@/components/silver/Icons"
import { Logo } from "@/components/silver/Logo"
import { TextSizeControl } from "@/components/silver/TextSizeControl"
import { BRAND, phoneHref } from "@/components/silver/brand"
import LocalizedClientLink from "@/components/molecules/LocalizedLink/LocalizedLink"
import { listCategories } from "@/lib/data/categories"
import { HeaderAccount, HeaderAccountFallback } from "./HeaderAccount"

export const Header = async () => {
  const { categories, parentCategories } = (await listCategories({
    query: { include_ancestors_tree: true },
  })) as {
    categories: HttpTypes.StoreProductCategory[]
    parentCategories: HttpTypes.StoreProductCategory[]
  }

  const navCategories = parentCategories.slice(0, 7).map(({ id, name, handle }) => ({
    id,
    name,
    handle,
  }))

  return (
    <header data-testid="header" className="bg-white">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-2 focus:z-50 focus:rounded-full focus:bg-white focus:px-4 focus:py-2"
      >
        Skip to main content
      </a>

      {/* Utility bar */}
      <div className="border-b border-primary" data-testid="header-top">
        <div className="sc-shell flex min-h-[52px] items-center justify-between gap-4 py-1.5">
          <p className="hidden text-[15px] text-[rgba(var(--neutral-500))] md:block">
            Free standard delivery · Plain, unmarked packaging
          </p>
          <div className="flex flex-1 items-center justify-between gap-5 md:flex-none md:justify-end">
            <a
              href={phoneHref}
              className="inline-flex items-center gap-2 text-[15px] font-semibold text-[rgba(var(--brand-900))] hover:underline"
            >
              <PhoneIcon size={17} /> Call {BRAND.phone}
            </a>
            <TextSizeControl />
          </div>
        </div>
      </div>

      {/* Main bar */}
      <div className="border-b border-primary">
        <div className="sc-shell flex flex-wrap items-center gap-x-6 gap-y-3 py-3.5 lg:flex-nowrap">
          <div className="flex items-center gap-3">
            <MobileNavbar parentCategories={parentCategories} categories={categories} />
            <Logo />
          </div>
          <HeaderSearch className="order-last lg:order-none lg:max-w-[440px] xl:max-w-[480px]" />
          <div className="ml-auto flex items-center gap-2 sm:gap-3" data-testid="header-actions">
            <Suspense fallback={<HeaderAccountFallback />}>
              <HeaderAccount />
            </Suspense>
            <Suspense
              fallback={
                <LocalizedClientLink href="/cart" className="sc-pill h-12 border-2 border-[rgba(var(--brand-900))]">
                  <BagIcon size={18} /> Cart
                </LocalizedClientLink>
              }
            >
              <CartButton />
            </Suspense>
          </div>
        </div>
      </div>

      <CategoryLinks categories={navCategories} />
    </header>
  )
}
