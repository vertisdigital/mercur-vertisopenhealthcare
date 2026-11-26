"use client"

import { useCartContext } from "@/components/providers"
import { TrashIcon } from "@/components/silver/Icons"
import { toast } from "@/lib/helpers/toast"

/** A labelled "Remove" link — easier to understand than a bare bin icon. */
export const DeleteCartItemButton = ({
  id,
  disabled,
}: {
  id: string
  disabled?: boolean
}) => {
  const { removeCartItem } = useCartContext()

  const handleDelete = async () => {
    try {
      await removeCartItem(id)
    } catch (error) {
      console.error("Error deleting cart item:", error)
      toast.error({ title: "Sorry, we couldn’t remove that item" })
    }
  }

  const isBtnDisabled = disabled || !id || id.startsWith("optimistic:")

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isBtnDisabled}
      className="inline-flex min-h-[44px] items-center gap-2 text-[16px] font-semibold text-[rgba(var(--brand-900))] disabled:opacity-40"
      data-testid="cart-item-remove"
    >
      <TrashIcon size={18} />
      <span className="underline decoration-2 underline-offset-4">Remove</span>
    </button>
  )
}
