"use client"

import Image from "next/image"
import { HttpTypes } from "@medusajs/types"
import { cn } from "@/lib/utils"
import LocalizedClientLink from "@/components/molecules/LocalizedLink/LocalizedLink"
import { getProductPrice } from "@/lib/helpers/get-product-price"
import { Product } from "@/types/product"

export const ProductCard = ({
  product,
  className,
}: {
  product: HttpTypes.StoreProduct | Product,
  className?: string
}) => {
  if (!product) {
    return null
  }

  const { cheapestPrice } = getProductPrice({ product: product as HttpTypes.StoreProduct })

  const productName = String(product.title || "Product")
  const meta = ((product as any).metadata || {}) as Record<string, any>
  
  const isCourse = Boolean(
    meta.isCourse ||
    product.id?.startsWith('prod_ctg_') ||
    product.handle?.startsWith('basic-wound') ||
    product.handle?.startsWith('caregivers-') ||
    product.handle?.startsWith('fundamentals-of-autism') ||
    product.handle?.startsWith('wsq-managing') ||
    product.handle?.startsWith('basic-caregiving') ||
    product.handle?.startsWith('preparing-for') ||
    product.handle?.startsWith('supporting-your') ||
    product.handle?.startsWith('my-child-with') ||
    product.handle?.startsWith('managing-challenges') ||
    product.handle?.startsWith('infection-control') ||
    product.handle?.startsWith('basic-home-care') ||
    product.handle?.startsWith('fundamental-principles') ||
    product.handle?.startsWith('from-school-to') ||
    product.categories?.some(c => c.name?.includes('Caregiver') || c.handle?.includes('ctg'))
  )

  // 1. GENUINE VERTIS CTG COURSE CARD
  if (isCourse) {
    const skillName = meta.skillName || "Identifying and Understanding Conditions (Disability)"
    const provider = meta.providerName || (product as any).seller?.name || "Accredited Training Institute"
    const mode = meta.mode || "Class Based"
    const courseType = meta.courseType || "Eldercare caregiving courses"
    const languages = meta.languages || "English"
    const duration = meta.duration || "3 hrs"
    const minPrice = meta.minPrice || 79.42
    const maxPrice = meta.maxPrice || minPrice
    const priceDisplay = minPrice === maxPrice ? `S$${Number(minPrice).toFixed(2)}` : `S$${Number(minPrice).toFixed(2)} - S$${Number(maxPrice).toFixed(2)}`

    return (
      <div
        className={cn(
          "relative group border border-gray-200 rounded-lg flex flex-col justify-between overflow-hidden bg-white hover:shadow-lg hover:border-orange-400 transition-all duration-200 w-full",
          className
        )}
        data-testid="product-card"
        data-product-handle={product.handle}
      >
        {/* Top Orange Ribbon (Category/Skill Banner) */}
        <div className="bg-[#e05626] text-white text-[11px] font-bold px-3 py-1.5 truncate tracking-tight">
          {skillName}
        </div>

        {/* Thumbnail Image */}
        <LocalizedClientLink
          href={`/products/${product.handle}`}
          className="relative w-full aspect-[16/10] bg-amber-50 overflow-hidden block"
        >
          {product.thumbnail ? (
            <Image
              src={decodeURIComponent(product.thumbnail)}
              alt={productName}
              width={360}
              height={225}
              priority
              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <Image
              src="/images/placeholder.svg"
              alt={productName}
              width={360}
              height={225}
              className="object-cover w-full h-full"
            />
          )}
        </LocalizedClientLink>

        {/* Course Info */}
        <div className="p-3.5 flex flex-col flex-1 justify-between">
          <div>
            <LocalizedClientLink
              href={`/products/${product.handle}`}
              data-testid="product-card-title"
              className="font-bold text-sm text-gray-900 hover:text-[#e05626] line-clamp-2 min-h-[40px] mb-1.5 transition-colors leading-snug block"
            >
              {product.title}
            </LocalizedClientLink>

            {/* Provider */}
            <div className="text-xs text-[#e05626] font-semibold underline truncate mb-2">
              By: {provider}
            </div>

            {/* Price */}
            <div className="text-base font-extrabold text-gray-900 mb-2.5">
              {priceDisplay}
            </div>

            {/* 3 Bullet points */}
            <ul className="text-xs text-gray-600 space-y-1 mb-3">
              <li className="flex items-center gap-1.5">
                <span className="text-gray-400">•</span>
                <span className="truncate">{mode}</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="text-gray-400">•</span>
                <span className="truncate">{courseType}</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="text-gray-400">•</span>
                <span className="truncate">{languages}</span>
              </li>
            </ul>
          </div>

          {/* Footer: Duration & View Details */}
          <div className="pt-2.5 border-t border-gray-100 flex items-center justify-between text-xs mt-auto">
            <span className="text-gray-500 font-medium text-[11px]">
              Course Duration: <strong className="text-gray-700">{duration}</strong>
            </span>
            <LocalizedClientLink
              href={`/products/${product.handle}`}
              className="inline-flex items-center gap-1 bg-[#e05626] hover:bg-[#c8461b] text-white font-bold px-3 py-1.5 rounded-full transition-colors shadow-2xs text-[11px]"
            >
              <span>View Details</span>
            </LocalizedClientLink>
          </div>
        </div>
      </div>
    )
  }

  // 2. SMF PHYSICAL CONSUMABLE CARD (Shopee Mall Style)
  const sellerName = (product as any).seller?.name || ""

  return (
    <div
      className={cn(
        "relative group border border-gray-200 rounded-lg flex flex-col justify-between p-2.5 w-full bg-white hover:shadow-lg hover:border-orange-300 transition-all duration-200",
        className
      )}
      data-testid="product-card"
      data-product-handle={product.handle}
    >
      <div className="relative w-full aspect-square bg-gray-50 rounded-md overflow-hidden" data-testid="product-card-image-container">
        <span className="absolute top-2 left-2 z-10 bg-red-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded shadow-sm uppercase tracking-wide">
          Mall
        </span>
        <span className="absolute top-2 right-2 z-10 bg-emerald-700 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm">
          Free SG Ship
        </span>

        <LocalizedClientLink
          href={`/products/${product.handle}`}
          aria-label={`View ${productName}`}
          title={`View ${productName}`}
          data-testid="product-card-link"
        >
          <div className="overflow-hidden rounded-md w-full h-full flex justify-center items-center">
            {product.thumbnail ? (
              <Image
                priority
                fetchPriority="high"
                src={decodeURIComponent(product.thumbnail)}
                alt={`${productName} image`}
                width={200}
                height={200}
                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover aspect-square w-full object-center h-full group-hover:scale-105 transition-transform duration-300 rounded-md"
                data-testid="product-card-image"
              />
            ) : (
              <Image
                priority
                fetchPriority="high"
                src="/images/placeholder.svg"
                alt={`${productName} image placeholder`}
                width={200}
                height={200}
                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                data-testid="product-card-placeholder-image"
              />
            )}
          </div>
        </LocalizedClientLink>
      </div>

      <LocalizedClientLink
        href={`/products/${product.handle}`}
        aria-label={`Go to ${productName} page`}
        title={`Go to ${productName} page`}
      >
        <div className="flex flex-col p-2.5" data-testid="product-card-info">
          <div className="flex items-center justify-between gap-1 text-[11px] mb-1">
            <span className="font-semibold text-gray-500 uppercase tracking-wide truncate">
              {product.categories?.[0]?.name || "SMF Consumable"}
            </span>
            {sellerName && (
              <span className="font-bold text-[#e05626] bg-orange-50 border border-orange-200 px-1.5 py-0.2 rounded text-[10px] shrink-0 truncate max-w-[130px]">
                {sellerName}
              </span>
            )}
          </div>
          <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 min-h-[40px] hover:text-[#e05626] transition-colors" data-testid="product-card-title">
            {product.title}
          </h3>

          {/* Stars & Social Proof */}
          <div className="flex items-center gap-1.5 my-1 text-xs text-amber-500">
            <span>★★★★★</span>
            <span className="font-bold text-gray-700 text-[11px]">4.9</span>
            <span className="text-gray-400 text-[11px]">• 120+ sold in SG</span>
          </div>

          <div className="flex items-baseline gap-2 mt-1" data-testid="product-card-price">
            <p className="text-base md:text-lg font-extrabold text-[#e05626]" data-testid="product-card-current-price">
              {cheapestPrice?.calculated_price}
            </p>
            {cheapestPrice?.calculated_price !==
              cheapestPrice?.original_price && (
              <p className="text-xs text-gray-400 line-through" data-testid="product-card-original-price">
                {cheapestPrice?.original_price}
              </p>
            )}
          </div>

          <div className="mt-2.5">
            <div className="w-full text-center text-xs font-bold uppercase py-2 px-3 rounded bg-orange-50 text-[#e05626] border border-orange-200 group-hover:bg-[#e05626] group-hover:text-white transition-all shadow-2xs">
              View Product →
            </div>
          </div>
        </div>
      </LocalizedClientLink>
    </div>
  )
}
