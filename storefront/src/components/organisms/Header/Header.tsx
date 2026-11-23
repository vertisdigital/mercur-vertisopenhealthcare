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
    <header className="w-full flex flex-col bg-white border-b border-gray-200" data-testid="header">
      {/* 1. TOP ANNOUNCEMENT & ACCESSIBILITY BAR (Elder-Friendly SilverCircle Style) */}
      <div className="w-full bg-[#fbfdfc] border-b border-[#e6f0ea] py-2 text-xs text-gray-700">
        <div className="max-w-7xl mx-auto w-full px-4 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-2 font-medium text-[#0b3b2c]">
            <span className="hidden sm:inline">📦</span>
            <span>Free delivery over S$50 · Plain, unmarked packaging</span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <a
              href="tel:18001234567"
              className="font-bold text-[#0b3b2c] hover:underline flex items-center gap-1"
            >
              <span>📞</span> Call 1800 XXX XXXX
            </a>

            <span className="text-gray-300 hidden md:inline">|</span>

            {/* Accessibility: Text Size Switcher */}
            <div className="hidden md:flex items-center gap-1">
              <span className="text-gray-500 font-medium">Text size</span>
              <div className="inline-flex items-center gap-0.5 ml-1">
                <button
                  type="button"
                  title="Normal text size"
                  className="w-5 h-5 rounded-full bg-[#0b3b2c] text-white text-[10px] font-bold flex items-center justify-center cursor-pointer"
                >
                  A
                </button>
                <button
                  type="button"
                  title="Large text size"
                  className="w-5 h-5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold flex items-center justify-center cursor-pointer"
                >
                  A
                </button>
                <button
                  type="button"
                  title="Extra large text size"
                  className="w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-bold flex items-center justify-center cursor-pointer"
                >
                  A
                </button>
              </div>
            </div>

            <span className="text-gray-300 hidden sm:inline">|</span>
            <CountrySelector regions={regions} />
          </div>
        </div>
      </div>

      {/* 2. MAIN HEADER (Clean White + Vertis Logo + Pill Search Bar) */}
      <div className="w-full bg-white py-4 border-b border-gray-100">
        <div className="max-w-7xl mx-auto w-full px-4 lg:px-8 flex items-center justify-between gap-4">
          {/* Logo & Mobile Menu */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="lg:hidden text-gray-900">
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
                src="/Logo.svg"
                width={160}
                height={44}
                alt="Vertis Open Healthcare"
                priority
                className="h-9 md:h-11 w-auto object-contain"
              />
            </LocalizedClientLink>
          </div>

          {/* SilverCircle-style Pill Search Bar */}
          <div className="flex-1 max-w-2xl mx-2 md:mx-6">
            <HealthcareSearchBar />
          </div>

          {/* Right Actions: User, Wishlist, Cart */}
          <div className="flex items-center gap-3 md:gap-5 shrink-0 text-gray-800">
            {isLoggedIn && <MessageButton />}

            <div className="flex items-center text-sm font-semibold text-[#0b3b2c]">
              <UserDropdown isLoggedIn={isLoggedIn} />
            </div>

            {isLoggedIn && (
              <LocalizedClientLink
                href="/user/wishlist"
                className="relative p-1 hover:text-[#0b3b2c] transition-colors"
                data-testid="header-wishlist-link"
              >
                <HeartIcon size={22} color="#0b3b2c" />
                {Boolean(wishlistCount) && (
                  <Badge
                    className="absolute -top-1 -right-2 w-4 h-4 p-0 bg-[#0b3b2c] text-white text-[10px]"
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

      {/* 3. AISLES CATEGORY NAVIGATION (6 Aisles from PDF) */}
      <nav className="w-full bg-[#fbfdfc] border-b border-[#e6f0ea] py-2.5">
        <div className="max-w-7xl mx-auto w-full px-4 lg:px-8 flex items-center justify-between text-xs md:text-sm">
          <div className="flex items-center gap-1 md:gap-6 overflow-x-auto whitespace-nowrap py-1 no-scrollbar font-medium">
            <LocalizedClientLink
              href="/categories"
              className="font-bold text-[#0b3b2c] hover:text-[#062c20] transition-colors uppercase tracking-tight flex items-center gap-1.5 pr-3 border-r border-gray-300"
            >
              <span>☰</span>
              <span>All Products</span>
            </LocalizedClientLink>

            {parentCategories.map((cat) => (
              <LocalizedClientLink
                key={cat.id}
                href={`/categories/${cat.handle}`}
                className="text-gray-700 hover:text-[#0b3b2c] transition-colors tracking-tight py-1 px-1.5 font-semibold"
              >
                {cat.name}
              </LocalizedClientLink>
            ))}

            <a
              href="tel:18001234567"
              className="text-gray-600 hover:text-[#0b3b2c] transition-colors py-1 px-1.5"
            >
              Help & contact
            </a>
          </div>

          <div className="hidden xl:flex items-center gap-1.5 text-xs font-semibold text-[#065f46] bg-[#ecfdf5] px-3 py-1 rounded-full border border-[#a7f3d0] shrink-0">
            <span>🛡️</span>
            <span>Unsubsidised Open Market</span>
          </div>
        </div>
      </nav>
    </header>
  )
}
