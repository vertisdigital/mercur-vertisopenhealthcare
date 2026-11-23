import {
  HomeProductSection,
} from "@/components/sections"
import { ElderHero } from "@/components/sections/ElderHero/ElderHero"
import { ElderTrustBar } from "@/components/sections/ElderTrustBar/ElderTrustBar"
import { ElderShopByNeed } from "@/components/sections/ElderShopByNeed/ElderShopByNeed"
import { ElderOrderingSteps } from "@/components/sections/ElderOrderingSteps/ElderOrderingSteps"
import { ElderPhoneOrderCallout } from "@/components/sections/ElderPhoneOrderCallout/ElderPhoneOrderCallout"

import type { Metadata } from "next"
import { headers } from "next/headers"
import Script from "next/script"
import { listRegions } from "@/lib/data/regions"
import { toHreflang } from "@/lib/helpers/hreflang"
import Link from "next/link"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params

  const headersList = await headers()
  const host = headersList.get("host")
  const protocol = headersList.get("x-forwarded-proto") || "https"
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `${protocol}://${host}`

  let languages: Record<string, string> = {}
  try {
    const regions = await listRegions()
    const locales = Array.from(
      new Set(
        (regions || [])
          .map((r) => r.countries?.map((c) => c.iso_2) || [])
          .flat()
          .filter(Boolean)
      )
    ) as string[]

    languages = locales.reduce<Record<string, string>>((acc, code) => {
      const hrefLang = toHreflang(code)
      acc[hrefLang] = `${baseUrl}/${code}`
      return acc
    }, {})
  } catch {
    languages = { [toHreflang(locale)]: `${baseUrl}/${locale}` }
  }

  const title = "Vertis Open Healthcare | Care supplies, made simple"
  const description =
    "Singapore's trusted elder-friendly healthcare marketplace. Catheters, wound dressings, mobility aids and more — delivered to your door in a plain box."
  const canonical = `${baseUrl}/${locale}`

  return {
    title,
    description,
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical,
      languages: {
        ...languages,
        "x-default": baseUrl,
      },
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "Vertis Open Healthcare",
      type: "website",
    },
  }
}

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  const headersList = await headers()
  const host = headersList.get("host")
  const protocol = headersList.get("x-forwarded-proto") || "https"
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `${protocol}://${host}`
  const siteName = "Vertis Open Healthcare"

  return (
    <main className="flex flex-col w-full text-gray-900 bg-white">
      {/* Organization JSON-LD */}
      <Script
        id="ld-org"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: siteName,
            url: `${baseUrl}/${locale}`,
            logo: `${baseUrl}/Logo.svg`,
          }),
        }}
      />

      {/* 1. HERO SECTION (Care supplies, made simple + Monthly delivery tracker preview) */}
      <ElderHero />

      {/* 2. TRUST PILLARS BAR (Free delivery, Discreet packaging, Repeat deliveries, Real people) */}
      <ElderTrustBar />

      {/* 3. SHOP BY NEED (Six Simple Aisles Grid) */}
      <ElderShopByNeed />

      {/* 4. MOST REORDERED CARE SUPPLIES */}
      <section className="w-full py-12 md:py-16 bg-[#fbfdfc] border-t border-[#e6f0ea]">
        <div className="max-w-7xl mx-auto w-full px-4 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-[#0b3b2c]">
                Most reordered
              </h2>
              <p className="text-sm md:text-base text-gray-600 mt-1">
                The supplies our customers come back for, with sizes and pack counts shown clearly.
              </p>
            </div>
            <Link
              href="/categories"
              className="text-sm font-bold text-[#0b3b2c] hover:underline inline-flex items-center gap-1 shrink-0"
            >
              See all products →
            </Link>
          </div>

          <HomeProductSection
            heading=""
            locale={locale}
            home
          />
        </div>
      </section>

      {/* 5. ORDERING IN THREE STEPS */}
      <ElderOrderingSteps />

      {/* 6. PREFER TO ORDER BY PHONE? */}
      <ElderPhoneOrderCallout />
    </main>
  )
}
