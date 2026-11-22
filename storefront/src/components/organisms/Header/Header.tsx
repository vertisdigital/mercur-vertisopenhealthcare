import Image from "next/image"
import { HttpTypes } from "@medusajs/types"

import { CartDropdown, MobileNavbar } from "@/components/cells"
import { HeartIcon } from "@/icons"
import { UserDropdown } from "@/components/cells/UserDropdown/UserDropdown"
import { Wishlist } from "@/types/wishlist"
import { Badge } from "@/components/atoms"
import CountrySelector from "@/components/molecules/CountrySelector/CountrySelector"
import LocalizedClientLink from "@/components/molecules/LocalizedLink/LocalizedLink"
import { MessageButton } from "@/components/molecules/MessageButton/MessageButton"
import { listCategories } from "@/lib/data/categories"
import { listRegions } from "@/lib/data/regions"
import { getUserWishlists } from "@/lib/data/wishlist"
import { retrieveCustomer } from "@/lib/data/customer"
import { HealthcareSearchBar } from "@/components/molecules/HealthcareSearchBar/HealthcareSearchBar"
import { HeaderTabs } from "@/components/molecules/HeaderTabs/HeaderTabs"

export const Header = async ({ locale }: { locale: string }) => {
  const user = await retrieveCustomer().catch(() => null)
  const isLoggedIn = Boolean(user)

  let wishlist: Wishlist = { products: [] }
  if (user) {
    wishlist = await getUserWishlists({ countryCode: locale })
  }

  const regions = await listRegions()
  const wishlistCount = wishlist?.products.length || 0

  const { categories, parentCategories } = (await listCategories({
    query: { include_ancestors_tree: true },
  })) as {
    categories: HttpTypes.StoreProductCategory[]
    parentCategories: HttpTypes.StoreProductCategory[]
  }

  return (
    <header className="w-full flex flex-col" data-testid="header">
      {/* 1. TOP TABS BAR (Vertis Healthcare Official Style) */}
      <div className="w-full bg-[#f3f4f6] border-b border-gray-200 pt-2">
        <div className="max-w-7xl mx-auto w-full px-4 lg:px-8 flex items-end justify-between">
          {/* Interactive Official Tabs with Path Detection */}
          <HeaderTabs />

          {/* Quick Support Links */}
          <div className="flex items-center gap-3 pb-2 text-[11px] text-gray-600">
            <a
              href="https://healthcare.vertis.digital/home"
              target="_blank"
              rel="noreferrer"
              className="hover:text-[#e05626] transition-colors hidden md:inline-flex items-center gap-1 font-medium"
            >
              <span>🏛️</span> Corporate Portal
            </a>
            <span className="text-gray-300 hidden md:inline">|</span>
            <span className="hidden sm:inline-flex items-center gap-1 font-medium">
              <span>🇸🇬</span> Singapore (SGD)
            </span>
            <span className="text-gray-300 hidden sm:inline">|</span>
            <CountrySelector regions={regions} />
          </div>
        </div>
      </div>

      {/* 2. MAIN HEADER (Dark Slate #1a202c - Vertis Brand + Shopee Search Bar) */}
      <div className="w-full bg-[#1a202c] py-3.5 shadow-md">
        <div className="max-w-7xl mx-auto w-full px-4 lg:px-8 flex items-center justify-between gap-4">
          {/* Logo & Mobile Menu */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="lg:hidden text-white">
              <MobileNavbar
                parentCategories={parentCategories}
                categories={categories}
              />
            </div>
            <LocalizedClientLink
              href="/"
              className="flex items-center cursor-pointer"
              data-testid="header-logo-link"
            >
              <Image
                src="/Logo-white.svg"
                width={160}
                height={44}
                alt="Vertis Healthcare"
                priority
                className="h-9 md:h-11 w-auto object-contain"
              />
            </LocalizedClientLink>
          </div>

          {/* Shopee-style Search Bar */}
          <div className="flex-1 max-w-2xl mx-2 md:mx-6">
            <HealthcareSearchBar />
          </div>

          {/* Right Actions: User, Wishlist, Cart */}
          <div className="flex items-center gap-3 md:gap-5 shrink-0 text-white">
            {isLoggedIn && <MessageButton />}

            <div className="flex items-center">
              <UserDropdown isLoggedIn={isLoggedIn} />
            </div>

            {isLoggedIn && (
              <LocalizedClientLink
                href="/user/wishlist"
                className="relative p-1 hover:text-[#e05626] transition-colors"
                data-testid="header-wishlist-link"
              >
                <HeartIcon size={22} color="#ffffff" />
                {Boolean(wishlistCount) && (
                  <Badge
                    className="absolute -top-1 -right-2 w-4 h-4 p-0 bg-[#e05626] text-white text-[10px]"
                    data-testid="wishlist-count-badge"
                  >
                    {wishlistCount}
                  </Badge>
                )}
              </LocalizedClientLink>
            )}

            <div className="relative">
              <CartDropdown />
            </div>
          </div>
        </div>
      </div>

      {/* 3. HEALTHCARE CATEGORY BAR (White / Light Background) */}
      <nav className="w-full bg-white border-b border-gray-200 py-2.5">
        <div className="max-w-7xl mx-auto w-full px-4 lg:px-8 flex items-center justify-between text-xs md:text-sm">
          <div className="flex items-center gap-1 md:gap-6 overflow-x-auto whitespace-nowrap py-1 no-scrollbar">
            <LocalizedClientLink
              href="/categories"
              className="font-bold text-gray-900 hover:text-[#e05626] transition-colors uppercase tracking-tight flex items-center gap-1.5 pr-2 border-r border-gray-200"
            >
              <span>☰</span>
              <span>All Categories</span>
            </LocalizedClientLink>

            {parentCategories.map((cat) => (
              <LocalizedClientLink
                key={cat.id}
                href={`/categories/${cat.handle}`}
                className="font-semibold text-gray-700 hover:text-[#e05626] transition-colors uppercase tracking-tight py-1 px-1.5"
              >
                {cat.name}
              </LocalizedClientLink>
            ))}
          </div>

          <div className="hidden xl:flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 shrink-0">
            <span>🛡️</span>
            <span>SMF / AIC Subsidies Eligible</span>
          </div>
        </div>
      </nav>
    </header>
  )
}
