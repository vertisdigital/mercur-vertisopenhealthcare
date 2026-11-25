import { ProductDetails, ProductGallery } from "@/components/organisms"
import { listProducts } from "@/lib/data/products"
import { HomeProductSection } from "../HomeProductSection/HomeProductSection"
import NotFound from "@/app/not-found"

export const ProductDetailsPage = async ({
  handle,
  locale,
}: {
  handle: string
  locale: string
}) => {
  const prod = await listProducts({
    countryCode: locale,
    queryParams: { handle: [handle], limit: 1 },
    forceCache: true,
  }).then(({ response }) => response.products[0])

  if (!prod) return null

  if (prod.seller?.store_status === "SUSPENDED") {
    return NotFound()
  }

  return (
    <>
      <div className="flex flex-col md:flex-row lg:gap-12" data-testid="product-details-page">
        <div className="md:w-1/2 md:px-2 space-y-4" data-testid="product-gallery-container">
          <ProductGallery images={prod?.images || []} />
          {/* 3-Spec Summary Strip (Slide 3) */}
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl border border-[#e2e8f0] bg-[#fbfdfc] p-3.5">
              <span className="block text-[11px] font-medium text-gray-500">Delivery</span>
              <span className="block text-sm font-bold text-[#0b3b2c] mt-0.5">1–2 working days</span>
            </div>
            <div className="rounded-xl border border-[#e2e8f0] bg-[#fbfdfc] p-3.5">
              <span className="block text-[11px] font-medium text-gray-500">Packaging</span>
              <span className="block text-sm font-bold text-[#0b3b2c] mt-0.5">Plain, unmarked box</span>
            </div>
            <div className="rounded-xl border border-[#e2e8f0] bg-[#fbfdfc] p-3.5">
              <span className="block text-[11px] font-medium text-gray-500">Quality</span>
              <span className="block text-sm font-bold text-[#0b3b2c] mt-0.5">Hospital-grade</span>
            </div>
          </div>
        </div>
        <div className="md:w-1/2 md:px-2" data-testid="product-details-container">
          <ProductDetails product={prod} locale={locale} />
        </div>
      </div>
      <div className="my-8">
        <HomeProductSection
          heading="More from this seller"
          products={prod.seller?.products}
          // seller_handle={prod.seller?.handle}
          locale={locale}
        />
      </div>
    </>
  )
}
