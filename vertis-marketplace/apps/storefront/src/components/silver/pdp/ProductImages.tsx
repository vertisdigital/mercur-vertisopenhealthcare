"use client"

import Image from "next/image"
import { useState } from "react"
import { HttpTypes } from "@medusajs/types"

import { cn } from "@/lib/utils"

/** One large image plus big thumbnail buttons — no swiping or auto-play. */
export const ProductImages = ({
  images,
  title,
}: {
  images: HttpTypes.StoreProduct["images"]
  title: string
}) => {
  const list = images ?? []
  const [active, setActive] = useState(0)
  const current = list[active]

  return (
    <div data-testid="product-gallery">
      <div className="sc-tile-bg relative flex aspect-square items-center justify-center overflow-hidden rounded-[24px] border border-primary">
        {current ? (
          <Image
            key={current.id}
            src={decodeURIComponent(current.url)}
            alt={`${title}, picture ${active + 1} of ${list.length}`}
            fill
            priority
            sizes="(min-width: 1024px) 520px, 100vw"
            className="object-contain p-10"
          />
        ) : (
          <Image src="/images/placeholder.svg" alt="" width={120} height={120} className="opacity-40" />
        )}
      </div>

      {list.length > 1 && (
        <ul className="mt-4 flex flex-wrap gap-3" aria-label="More pictures">
          {list.map((img, i) => (
            <li key={img.id}>
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-label={`Show picture ${i + 1}`}
                aria-pressed={i === active}
                className={cn(
                  "relative h-20 w-20 overflow-hidden rounded-[14px] border-2 bg-white",
                  i === active ? "border-[rgba(var(--brand-900))]" : "border-primary hover:border-[rgba(var(--brand-200))]"
                )}
              >
                <Image src={decodeURIComponent(img.url)} alt="" fill sizes="80px" className="object-contain p-1.5" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
