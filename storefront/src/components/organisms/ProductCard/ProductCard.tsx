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
          "relative group border border-[#d5e7dd] rounded-2xl flex flex-col justify-between overflow-hidden bg-white hover:shadow-lg hover:border-[#0b3b2c] transition-all duration-200 w-full",
          className
        )}
        data-testid="product-card"
        data-product-handle={product.handle}
      >
        {/* Top Pine Green Ribbon (Category/Skill Banner) */}
        <div className="bg-[#0b3b2c] text-white text-[11px] font-bold px-3 py-1.5 truncate tracking-tight">
          {skillName}
        </div>

        {/* Thumbnail Image */}
        <LocalizedClientLink
          href={`/products/${product.handle}`}
          className="relative w-full aspect-[16/10] bg-[#f0fdf4] overflow-hidden block"
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
        <div className="p-4 flex flex-col flex-1 justify-between">
          <div>
            <LocalizedClientLink
              href={`/products/${product.handle}`}
              data-testid="product-card-title"
              className="font-bold text-sm text-[#0b3b2c] hover:text-[#062c20] line-clamp-2 min-h-[40px] mb-1.5 transition-colors leading-snug block"
            >
              {product.title}
            </LocalizedClientLink>

            {/* Provider */}
            <div className="text-xs text-[#065f46] font-semibold truncate mb-2">
              By: {provider}
            </div>

            {/* Price */}
            <div className="text-base font-extrabold text-[#0b3b2c] mb-2.5">
              {priceDisplay} <span className="text-xs font-normal text-gray-500">incl. GST</span>
            </div>

            {/* 3 Bullet points */}
            <ul className="text-xs text-gray-600 space-y-1 mb-3">
              <li className="flex items-center gap-1.5">
                <span className="text-emerald-700 font-bold">•</span>
                <span className="truncate">{mode}</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="text-emerald-700 font-bold">•</span>
                <span className="truncate">{courseType}</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="text-emerald-700 font-bold">•</span>
                <span className="truncate">{languages}</span>
              </li>
            </ul>
          </div>

          {/* Footer: Duration & View Details */}
          <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs mt-auto">
            <span className="text-gray-500 font-medium text-[11px]">
              Duration: <strong className="text-gray-800">{duration}</strong>
            </span>
            <LocalizedClientLink
              href={`/products/${product.handle}`}
              className="inline-flex items-center gap-1 bg-[#0b3b2c] hover:bg-[#062c20] text-white font-bold px-3.5 py-1.5 rounded-full transition-colors shadow-2xs text-[11px]"
            >
              <span>View Details →</span>
            </LocalizedClientLink>
          </div>
        </div>
      </div>
    )
  }

  // 2. HEALTHCARE CONSUMABLE CARD (Elder-friendly SilverCircle Style)
  const sellerName = (product as any).seller?.name || ""

  return (
    <div
      className={cn(
        "relative group border border-[#d5e7dd] rounded-2xl flex flex-col justify-between p-4 w-full bg-white hover:shadow-lg hover:border-[#0b3b2c] transition-all duration-200",
        className
      )}
      data-testid="product-card"
      data-product-handle={product.handle}
    >
      <div className="relative w-full aspect-square bg-[#fbfdfc] rounded-xl overflow-hidden flex items-center justify-center p-2" data-testid="product-card-image-container">
        <span className="absolute top-2.5 left-2.5 z-10 bg-[#ecfdf5] border border-[#a7f3d0] text-[#065f46] text-[10px] font-bold px-2 py-0.5 rounded-full shadow-2xs">
          Care Supply
        </span>
        <span className="absolute top-2.5 right-2.5 z-10 bg-white border border-gray-200 text-gray-700 text-[9px] font-semibold px-2 py-0.5 rounded-full shadow-2xs">
          Plain box
        </span>

        <LocalizedClientLink
          href={`/products/${product.handle}`}
          aria-label={`View ${productName}`}
          title={`View ${productName}`}
          data-testid="product-card-link"
          className="w-full h-full flex items-center justify-center"
        >
          {product.thumbnail ? (
            <Image
              priority
              fetchPriority="high"
              src={decodeURIComponent(product.thumbnail)}
              alt={`${productName} image`}
              width={220}
              height={220}
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
              className="object-contain max-h-full max-w-full group-hover:scale-105 transition-transform duration-300"
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
        </LocalizedClientLink>
      </div>

      <div className="flex flex-col pt-3 flex-1 justify-between" data-testid="product-card-info">
        <div>
          <div className="flex items-center justify-between gap-1 text-[11px] mb-1">
            <span className="font-semibold text-gray-500 uppercase tracking-wide truncate">
              {product.categories?.[0]?.name || "Care Supply"}
            </span>
            {sellerName && (
              <span className="font-medium text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full text-[10px] shrink-0 truncate max-w-[120px]">
                {sellerName}
              </span>
            )}
          </div>

          <LocalizedClientLink
            href={`/products/${product.handle}`}
            className="text-base font-bold text-[#0b3b2c] hover:text-[#062c20] line-clamp-2 min-h-[44px] leading-snug transition-colors"
            data-testid="product-card-title"
          >
            {product.title}
          </LocalizedClientLink>

          <p className="text-xs text-gray-500 mt-1 line-clamp-1">
            {product.description || "Clear sizes and fast doorstep delivery"}
          </p>

          <div className="flex items-baseline gap-1.5 mt-2" data-testid="product-card-price">
            <p className="text-lg md:text-xl font-extrabold text-[#0b3b2c]" data-testid="product-card-current-price">
              {cheapestPrice?.calculated_price}
            </p>
            <span className="text-xs text-gray-500 font-medium">incl. GST</span>
          </div>
        </div>

        <div className="mt-3.5 pt-2 border-t border-gray-100">
          <LocalizedClientLink
            href={`/products/${product.handle}`}
            className="w-full text-center text-xs font-bold py-2.5 px-4 rounded-full bg-[#0b3b2c] hover:bg-[#062c20] text-white transition-all shadow-xs flex items-center justify-center gap-1.5"
          >
            <span>+ Add to cart</span>
          </LocalizedClientLink>
        </div>
      </div>
    </div>
  )
}
