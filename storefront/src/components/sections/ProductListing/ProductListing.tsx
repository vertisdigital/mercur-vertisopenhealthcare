import {
  ProductListingActiveFilters,
  ProductListingHeader,
  ProductSidebar,
  ProductsList,
  ProductsPagination,
} from "@/components/organisms"
import { PRODUCT_LIMIT } from "@/const"
import { listProductsWithSort } from "@/lib/data/products"

export const ProductListing = async ({
  category_id,
  collection_id,
  seller_id,
  showSidebar = false,
  locale = process.env.NEXT_PUBLIC_DEFAULT_REGION || "pl",
  searchParams = {},
}: {
  category_id?: string | string[]
  collection_id?: string
  seller_id?: string
  showSidebar?: boolean
  locale?: string
  searchParams?: Record<string, string | string[] | undefined>
}) => {
  const brand = typeof searchParams.brand === "string" ? searchParams.brand : undefined
  const scheme = typeof searchParams.scheme === "string" ? searchParams.scheme : undefined
  const skill = typeof searchParams.skill === "string" ? searchParams.skill : undefined
  const min_price = typeof searchParams.min_price === "string" ? searchParams.min_price : undefined
  const max_price = typeof searchParams.max_price === "string" ? searchParams.max_price : undefined
  const query = typeof searchParams.query === "string" ? searchParams.query : undefined
  const sortBy = (typeof searchParams.sortBy === "string" ? searchParams.sortBy : "created_at") as any
  const page = typeof searchParams.page === "string" ? parseInt(searchParams.page, 10) || 1 : 1

  const { response } = await listProductsWithSort({
    page,
    seller_id,
    category_id,
    collection_id,
    countryCode: locale,
    sortBy,
    filters: {
      brand,
      scheme,
      skill,
      min_price,
      max_price,
      query,
    },
    queryParams: {
      limit: PRODUCT_LIMIT,
    },
  })

  const { products, count } = await response

  const pages = Math.ceil(count / PRODUCT_LIMIT) || 1

  return (
    <div className="py-4 w-full" data-testid="product-listing-container">
      <ProductListingHeader total={count} />
      <div className="hidden md:block">
        <ProductListingActiveFilters />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6 w-full">
        {showSidebar && (
          <div className="md:col-span-1">
            <ProductSidebar />
          </div>
        )}
        <section
          className={showSidebar ? "md:col-span-3 min-w-0" : "col-span-4 min-w-0"}
          data-testid="product-listing-section"
        >
          <div
            className={
              showSidebar
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full"
                : "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full"
            }
            data-testid="product-list"
          >
            <ProductsList products={products} />
          </div>
          <ProductsPagination pages={pages} />
        </section>
      </div>
    </div>
  )
}
