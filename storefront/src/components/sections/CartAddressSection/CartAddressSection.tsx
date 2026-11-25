"use client"

import { Heading, Text, useToggleState } from "@medusajs/ui"
import { setAddresses } from "@/lib/data/cart"
import compareAddresses from "@/lib/helpers/compare-addresses"
import { HttpTypes } from "@medusajs/types"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useActionState, useEffect } from "react"
import { Button } from "@/components/atoms"
import ErrorMessage from "@/components/molecules/ErrorMessage/ErrorMessage"
import Spinner from "@/icons/spinner"
import ShippingAddress from "@/components/organisms/ShippingAddress/ShippingAddress"
import { CheckCircleSolid } from "@medusajs/icons"
import LocalizedClientLink from "@/components/molecules/LocalizedLink/LocalizedLink"

export const CartAddressSection = ({
  cart,
  customer,
}: {
  cart: HttpTypes.StoreCart | null
  customer: HttpTypes.StoreCustomer | null
}) => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const isAddress = Boolean(
    cart?.shipping_address &&
      cart?.shipping_address.first_name &&
      cart?.shipping_address.last_name &&
      cart?.shipping_address.address_1 &&
      cart?.shipping_address.city &&
      cart?.shipping_address.postal_code &&
      cart?.shipping_address.country_code
  )
  const isOpen = searchParams.get("step") === "address" || !isAddress

  const { state: sameAsBilling, toggle: toggleSameAsBilling } = useToggleState(
    cart?.shipping_address && cart?.billing_address
      ? compareAddresses(cart?.shipping_address, cart?.billing_address)
      : true
  )

  const [message, formAction] = useActionState(setAddresses, sameAsBilling)

  useEffect(() => {
    if (!isAddress) {
      router.replace(pathname + "?step=address")
    }
  }, [isAddress])

  const handleEdit = () => {
    router.replace(pathname + "?step=address")
  }

  return (
    <div className="bg-white rounded-2xl border border-[#e2e8f0] p-6 shadow-xs" data-testid="checkout-step-address">
      <div className="flex flex-row items-center justify-between mb-5">
        <Heading
          level="h2"
          className="text-xl font-bold text-[#0b3b2c] flex flex-row gap-x-2 items-center"
        >
          {!isOpen && (
            <span className="w-6 h-6 rounded-full bg-[#0b3b2c] text-white text-xs flex items-center justify-center font-bold">✓</span>
          )}
          Where should we deliver?
        </Heading>
        {!isOpen && isAddress && (
          <button
            type="button"
            onClick={handleEdit}
            data-testid="checkout-address-edit-button"
            className="px-4 py-1.5 rounded-full border border-gray-300 text-xs font-semibold text-[#0b3b2c] hover:bg-gray-50 transition-colors"
          >
            Edit
          </button>
        )}
      </div>
      <form
        action={async (data) => {
          await formAction(data)
          router.replace(`${pathname}?step=delivery`)
          router.refresh()
        }}
      >
        {isOpen ? (
          <div className="pb-4">
            <ShippingAddress
              customer={customer}
              checked={sameAsBilling}
              onChange={toggleSameAsBilling}
              cart={cart}
            />
            <button
              type="submit"
              className="w-full mt-6 py-3.5 px-6 rounded-full font-bold text-sm md:text-base bg-[#0b3b2c] hover:bg-[#062c20] text-white transition-colors shadow-xs"
              data-testid="submit-address-button"
            >
              Continue to delivery
            </button>
            <ErrorMessage
              error={message !== "success" && message}
              data-testid="address-error-message"
            />
          </div>
        ) : (
          <div>
            <div className="text-small-regular">
              {cart && cart.shipping_address ? (
                <div className="flex items-start gap-x-8">
                  <div className="flex items-start gap-x-1 w-full">
                    <div>
                      <Text className="txt-medium-plus font-bold">
                        {cart.shipping_address.first_name}{" "}
                        {cart.shipping_address.last_name}
                      </Text>
                      <Text>
                        {cart.shipping_address.address_1}{" "}
                        {cart.shipping_address.address_2},{" "}
                        {cart.shipping_address.postal_code}{" "}
                        {cart.shipping_address.city},{" "}
                        {cart.shipping_address.country_code?.toUpperCase()}
                      </Text>
                      <Text>
                        {cart.email}, {cart.shipping_address.phone}
                      </Text>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <Spinner />
                </div>
              )}
            </div>
          </div>
        )}
        {isAddress && !searchParams.get("step") && (
          <LocalizedClientLink href="/checkout?step=delivery">
            <Button className="mt-6" variant="tonal">
              Continue to Delivery
            </Button>
          </LocalizedClientLink>
        )}
      </form>
    </div>
  )
}
