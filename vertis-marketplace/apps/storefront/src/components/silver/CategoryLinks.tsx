"use client"

import { usePathname } from "next/navigation"
import { Suspense } from "react"

import LocalizedClientLink from "@/components/molecules/LocalizedLink/LocalizedLink"
import { cn } from "@/lib/utils"

export type NavCategory = { id: string; name: string; handle: string }

// usePathname() must sit under Suspense with Cache Components; the fallback is
// the same nav without the active underline.
export const CategoryLinks = ({ categories }: { categories: NavCategory[] }) => (
  <Suspense fallback={<CategoryNav categories={categories} pathname={null} />}>
    <CategoryLinksWithPath categories={categories} />
  </Suspense>
)

const CategoryLinksWithPath = ({ categories }: { categories: NavCategory[] }) => (
  <CategoryNav categories={categories} pathname={usePathname()} />
)

const CategoryNav = ({ categories, pathname }: { categories: NavCategory[]; pathname: string | null }) => {

  return (
    <nav aria-label="Shop by need" className="hidden border-b border-primary bg-white lg:block">
      <div className="sc-shell flex items-center gap-1">
        <ul className="flex flex-1 flex-wrap items-center gap-x-6">
          {categories.map((category) => {
            const active = pathname?.includes(`/categories/${category.handle}`)
            return (
              <li key={category.id}>
                <LocalizedClientLink
                  href={`/categories/${category.handle}`}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "inline-block border-b-[3px] py-3.5 text-[16px] font-medium text-[rgba(var(--brand-900))] transition-colors hover:border-[rgba(var(--brand-200))]",
                    active ? "border-[rgba(var(--brand-900))]" : "border-transparent"
                  )}
                >
                  {category.name}
                </LocalizedClientLink>
              </li>
            )
          })}
        </ul>
        <LocalizedClientLink
          href="/categories"
          className="py-3.5 text-[16px] font-medium text-[rgba(var(--brand-900))] hover:underline"
        >
          All products
        </LocalizedClientLink>
      </div>
    </nav>
  )
}
