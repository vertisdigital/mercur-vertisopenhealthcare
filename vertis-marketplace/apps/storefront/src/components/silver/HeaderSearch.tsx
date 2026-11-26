"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Suspense, useState } from "react"

import { useLocale } from "@/components/providers/Locale/LocaleProvider"
import { cn } from "@/lib/utils"

import { SearchIcon } from "./Icons"

type Props = { className?: string; placeholder?: string }

export const HeaderSearch = (props: Props) => (
  <Suspense fallback={<SearchForm {...props} initialQuery="" />}>
    <SearchWithQuery {...props} />
  </Suspense>
)

const SearchWithQuery = (props: Props) => {
  const searchParams = useSearchParams()
  return <SearchForm {...props} initialQuery={searchParams.get("query") || ""} />
}

const SearchForm = ({
  className,
  placeholder = "Search, for example “dressings”",
  initialQuery,
}: Props & { initialQuery: string }) => {
  const [query, setQuery] = useState(initialQuery)
  const router = useRouter()
  const locale = useLocale()

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const q = query.trim()
    router.push(`/${locale}/categories${q ? `?query=${encodeURIComponent(q)}` : ""}`)
  }

  return (
    <form
      role="search"
      onSubmit={submit}
      className={cn(
        "flex h-14 w-full items-center gap-2 rounded-full border border-[rgba(var(--brand-200))] bg-white pl-5 pr-1.5 focus-within:border-[rgba(var(--brand-900))]",
        className
      )}
      data-testid="header-search"
    >
      <SearchIcon className="shrink-0 text-[rgba(var(--neutral-500))]" />
      <label htmlFor="header-search-input" className="sr-only">
        Search products
      </label>
      <input
        id="header-search-input"
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="h-full min-w-0 flex-1 bg-transparent text-[17px] text-[rgba(var(--brand-900))] placeholder:text-[rgba(var(--neutral-400))] focus:outline-none"
      />
      <button type="submit" className="sc-btn h-11 px-5 text-[16px]">
        Search
      </button>
    </form>
  )
}
