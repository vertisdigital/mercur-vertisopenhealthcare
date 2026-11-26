'use client';

import { CartSummary } from '@/components/organisms/CartSummary/CartSummary';
import LocalizedClientLink from '@/components/molecules/LocalizedLink/LocalizedLink';
import { PromoCode } from '@/components/organisms/PromoCode/PromoCode';
import { convertToLocale } from '@/lib/helpers/money';
import { filterValidCartItems } from '@/lib/helpers/filter-valid-cart-items';

import PaymentButton from './PaymentButton';

const Review = ({ cart }: { cart: any }) => {
  const paidByGiftcard = cart?.gift_cards && cart?.gift_cards?.length > 0 && cart?.total === 0;

  // Every seller in the cart must have a shipping method. The backend enforces
  // one method per seller, so covering each seller means one method per seller.
  const cartSellerCount = new Set(
    (cart?.items ?? [])
      .map((item: any) => item.offer?.seller_id)
      .filter(Boolean)
  ).size;
  const allSellersHaveShipping =
    cart.shipping_methods.length > 0 &&
    cart.shipping_methods.length >= cartSellerCount;

  const previousStepsCompleted =
    cart.shipping_address &&
    allSellersHaveShipping &&
    (cart.payment_collection || paidByGiftcard);

  const items = filterValidCartItems(cart?.items ?? []);
  const count = items.reduce((acc: number, item: any) => acc + item.quantity, 0);

  return (
    <div className="sc-card p-7 shadow-[0_10px_40px_rgba(1,53,51,0.06)]" data-testid="checkout-order-summary">
      <div className="flex items-baseline justify-between">
        <h2 className="heading-md">Your order</h2>
        <LocalizedClientLink href="/cart" className="sc-link text-[16px]">
          Edit cart
        </LocalizedClientLink>
      </div>

      <ul className="mt-5 space-y-4 border-b border-primary pb-5">
        {items.map((item: any) => {
          const options = Object.values(item.variant_option_values ?? {}).map(String);
          return (
            <li key={item.id} className="flex justify-between gap-4">
              <div className="min-w-0">
                <p className="text-[17px] font-semibold leading-[24px] text-[rgba(var(--brand-900))]">{item.product_title}</p>
                <p className="text-[15px]">{[...options, `Qty ${item.quantity}`].join(' · ')}</p>
              </div>
              <p className="shrink-0 text-[17px] font-semibold text-[rgba(var(--brand-900))]">
                {convertToLocale({ amount: item.original_total ?? item.total ?? item.subtotal ?? 0, currency_code: cart.currency_code })}
              </p>
            </li>
          );
        })}
      </ul>

      <div className="mt-5">
        <CartSummary
          item_total={cart?.original_item_total ?? cart?.item_total ?? cart?.item_subtotal ?? 0}
          shipping_total={cart?.shipping_total ?? cart?.shipping_subtotal ?? 0}
          total={cart?.total || 0}
          currency_code={cart?.currency_code || ''}
          tax={cart?.tax_total || 0}
          discount_total={cart?.discount_total || 0}
          item_count={count}
          has_shipping={!!cart?.shipping_methods?.length}
        />
      </div>

      <div className="mt-5">
        <PromoCode cart={cart} />
      </div>

      {previousStepsCompleted && (
        <div className="mt-6">
          <PaymentButton
            cart={cart}
            data-testid="submit-order-button"
          />
        </div>
      )}
    </div>
  );
};

export default Review;
