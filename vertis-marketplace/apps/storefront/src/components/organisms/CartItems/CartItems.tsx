import { CartItemsProducts } from '@/components/cells/CartItemsProducts/CartItemsProducts';
import { HttpTypes } from "@medusajs/types"
import { CartEmpty } from "@/components/organisms/CartEmpty/CartEmpty"

export const CartItems = ({ cart }: { cart: HttpTypes.StoreCart | null }) => {
  if (!cart) return null

  const groupedItems: any = groupItemsBySeller(cart)

  if (!Object.keys(groupedItems).length) return <CartEmpty />

  return Object.keys(groupedItems).map((key) => (
    <div key={key} className="mb-6" data-testid={`cart-items-seller-${key}`}>
      {Object.keys(groupedItems).length > 1 && (
        <p className="mb-3 text-[16px]">
          Sold and delivered by{" "}
          <span className="font-semibold text-[rgba(var(--brand-900))]">{groupedItems[key]?.seller?.name}</span>
        </p>
      )}
      <CartItemsProducts
        products={groupedItems[key].items || []}
        currency_code={cart.currency_code}
      />
    </div>
  ))
}

function groupItemsBySeller(cart: HttpTypes.StoreCart) {
  const groupedBySeller: any = {}

  cart.items?.forEach((item: any) => {
    const seller = item.offer?.seller
    if (seller) {
      if (!groupedBySeller[seller.id]) {
        groupedBySeller[seller.id] = {
          seller: { ...seller, photo: seller.photo ?? seller.logo },
          items: [],
        }
      }
      groupedBySeller[seller.id].items.push(item)
    } else {
      if (!groupedBySeller["fleek"]) {
        groupedBySeller["fleek"] = {
          seller: {
            name: "SilverCircle",
            id: "fleek",
            photo: "/Logo.svg",
            created_at: new Date(),
          },
          items: [],
        }
      }
      groupedBySeller["fleek"].items.push(item)
    }
  })

  return groupedBySeller
}
