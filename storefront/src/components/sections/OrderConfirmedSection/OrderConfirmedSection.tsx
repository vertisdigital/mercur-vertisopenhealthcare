import { convertToLocale } from "@/lib/helpers/money"
import { HttpTypes } from "@medusajs/types"

export const OrderConfirmedSection = ({
  order,
}: {
  order: HttpTypes.StoreOrder
}) => {
  return (
    <div className="py-10 px-4">
      <div className="max-w-2xl mx-auto space-y-6" data-testid="order-complete-container">
        <div className="rounded-3xl border border-[#d5e7dd] bg-gradient-to-b from-[#ecfdf5]/70 to-white p-8 md:p-12 text-center shadow-xs space-y-6">
          <div className="w-12 h-12 rounded-full bg-[#0b3b2c] text-white text-xl font-bold flex items-center justify-center mx-auto">
            ✓
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl md:text-3xl font-bold text-[#0b3b2c]">
              Thank you — your order is placed
            </h1>
            <p className="text-sm text-gray-600 max-w-md mx-auto">
              We&apos;ve sent a confirmation to{" "}
              <span className="font-semibold text-[#0b3b2c]" data-testid="order-email">
                {order.email}
              </span>
              . You don&apos;t need to do anything else.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-[#e2e8f0] divide-y divide-gray-100 text-left max-w-md mx-auto">
            <div className="flex items-center justify-between px-5 py-3.5 text-sm">
              <span className="text-gray-500">Order number</span>
              <span className="font-bold text-[#0b3b2c]">#{order.display_id}</span>
            </div>
            <div className="flex items-center justify-between px-5 py-3.5 text-sm">
              <span className="text-gray-500">Total</span>
              <span className="font-bold text-[#0b3b2c]">
                {convertToLocale({
                  amount: order.total,
                  currency_code: order.currency_code,
                })}
              </span>
            </div>
          </div>
        </div>

        {/* What happens next (Slide 6) */}
        <div className="rounded-2xl border border-[#e2e8f0] bg-white p-6 space-y-4">
          <h2 className="text-base font-bold text-[#0b3b2c]">What happens next</h2>
          <div className="flex items-start gap-3">
            <span className="w-8 h-8 rounded-full bg-[#ecfdf5] border border-[#a7f3d0] flex items-center justify-center text-sm shrink-0">
              📦
            </span>
            <div>
              <p className="text-sm font-bold text-[#0b3b2c]">We pack your order in a plain box</p>
              <p className="text-xs text-gray-500 mt-0.5">
                Nothing on the outside says what&apos;s inside.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
