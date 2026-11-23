'use client';

import { Button } from '@/components/atoms';
import LocalizedClientLink from '@/components/molecules/LocalizedLink/LocalizedLink';
import { CartEmpty, CartItems, CartSummary } from '@/components/organisms';
import { useCartContext } from '@/components/providers';

export const Cart = () => {
  const { cart } = useCartContext();

  if (!cart || !cart.items?.length) {
    return <CartEmpty />;
  }

  return (
    <>
      <div className="col-span-12 lg:col-span-6">
        <CartItems cart={cart} />
      </div>
      <div className="lg:col-span-2"></div>
      <div className="col-span-12 lg:col-span-4">
        <div className="h-fit rounded-2xl border border-[#e6f0ea] bg-white p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#ecfdf5] border border-[#a7f3d0] text-xs font-semibold text-[#065f46]">
            <span>📦</span>
            <span>Unmarked Plain Box Delivery Included</span>
          </div>

          <CartSummary
            item_total={cart?.item_subtotal || 0}
            shipping_total={cart?.shipping_subtotal || 0}
            total={cart?.total || 0}
            currency_code={cart?.currency_code || ''}
            tax={cart?.tax_total || 0}
            discount_total={cart?.discount_subtotal || 0}
          />

          <LocalizedClientLink href="/checkout?step=address" className="block">
            <button
              type="button"
              className="w-full py-4 px-6 rounded-xl font-bold text-base flex items-center justify-center gap-2 bg-[#0b3b2c] hover:bg-[#062c20] text-white active:scale-[0.99] transition-all shadow-sm"
            >
              <span>Proceed to Checkout</span>
              <span>→</span>
            </button>
          </LocalizedClientLink>

          <div className="pt-3 border-t border-gray-100 text-center text-xs text-gray-500">
            <span>Prefer to order over the phone? </span>
            <a href="tel:18001234567" className="font-bold text-[#0b3b2c] underline">
              Call 1800 123 4567
            </a>
          </div>
        </div>
      </div>
    </>
  );
};
