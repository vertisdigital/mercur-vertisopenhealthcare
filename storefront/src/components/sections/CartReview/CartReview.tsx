'use client';

import LocalizedClientLink from '@/components/molecules/LocalizedLink/LocalizedLink';
import { CartSummary } from '@/components/organisms';
import { PromoCode } from '@/components/organisms/PromoCode/PromoCode';

import { CartItems } from './CartItems';
import PaymentButton from './PaymentButton';

const Review = ({ cart }: { cart: any }) => {
  const paidByGiftcard = cart?.gift_cards && cart?.gift_cards?.length > 0 && cart?.total === 0;

  const previousStepsCompleted =
    cart.shipping_address &&
    cart.shipping_methods.length > 0 &&
    (cart.payment_collection || paidByGiftcard);

  return (
    <div className="space-y-4">
      <div className="w-full rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-xs space-y-5">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <h2 className="text-lg font-bold text-[#0b3b2c]">Your order</h2>
          <LocalizedClientLink
            href="/cart"
            className="text-xs font-semibold text-[#0b3b2c] underline hover:text-[#062c20]"
          >
            Edit cart
          </LocalizedClientLink>
        </div>

        <div className="w-full">
          <CartItems cart={cart} />
        </div>

        <div className="pt-2 border-t border-gray-100">
          <CartSummary
            item_total={cart?.item_subtotal || 0}
            shipping_total={cart?.shipping_subtotal || 0}
            total={cart?.total || 0}
            currency_code={cart?.currency_code || ''}
            tax={cart?.tax_total || 0}
            discount_total={cart?.discount_total || 0}
          />
        </div>

        <div>
          <PromoCode cart={cart} />
        </div>

        {previousStepsCompleted && (
          <PaymentButton
            cart={cart}
            data-testid="submit-order-button"
          />
        )}
      </div>

      {/* Stuck on something? card (Slide 5) */}
      <div className="rounded-2xl border border-[#e2e8f0] bg-[#fbfdfc] p-5 flex items-start gap-3">
        <span className="text-lg leading-none mt-0.5">📞</span>
        <div>
          <h3 className="text-sm font-bold text-[#0b3b2c]">Stuck on something?</h3>
          <p className="text-xs text-gray-600 mt-1">
            Call us at <a href="tel:18001234567" className="font-bold text-[#0b3b2c] underline">1800 XXX XXXX</a> and we&apos;ll finish the order with you.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Review;
