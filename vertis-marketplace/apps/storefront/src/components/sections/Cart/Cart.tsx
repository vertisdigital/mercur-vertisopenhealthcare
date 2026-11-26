'use client';

import LocalizedClientLink from '@/components/molecules/LocalizedLink/LocalizedLink';
import { CartEmpty } from '@/components/organisms/CartEmpty/CartEmpty';
import { CartItems } from '@/components/organisms/CartItems/CartItems';
import { CartSummary } from '@/components/organisms/CartSummary/CartSummary';
import { useCartContext } from '@/components/providers';
import { ArrowLeftIcon, ArrowRightIcon, LockIcon } from '@/components/silver/Icons';
import { PhoneHelpCard } from '@/components/silver/PhoneHelp';

export const Cart = () => {
  const { cart, isUpdating } = useCartContext();

  if (!cart || !cart.items?.length) {
    return <CartEmpty />;
  }

  const count = cart.items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="col-span-12">
      <LocalizedClientLink href="/categories" className="sc-pill h-12 text-[16px]">
        <ArrowLeftIcon size={18} /> Continue shopping
      </LocalizedClientLink>
      <h1 className="heading-xl mt-8 flex items-baseline gap-4">
        Your cart
        <span className="text-[20px] font-normal text-[rgba(var(--neutral-500))]" style={{ letterSpacing: 0 }}>
          {count} {count === 1 ? 'item' : 'items'}
        </span>
      </h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
        <div>
          <CartItems cart={cart} />
        </div>
        <div className="space-y-5">
          <div className="sc-card p-7 shadow-[0_10px_40px_rgba(1,53,51,0.06)]" aria-busy={isUpdating || undefined}>
            <h2 className="heading-md">Order summary</h2>
            <div className="mt-5">
              <CartSummary
                item_total={(cart as any)?.original_item_total ?? cart?.item_total ?? cart?.item_subtotal ?? 0}
                shipping_total={cart?.shipping_total ?? cart?.shipping_subtotal ?? 0}
                total={cart?.total || 0}
                currency_code={cart?.currency_code || ''}
                tax={cart?.tax_total || 0}
                discount_total={cart?.discount_subtotal || 0}
                item_count={count}
                has_shipping={!!cart?.shipping_methods?.length}
              />
            </div>
            <LocalizedClientLink
              href="/checkout?step=address"
              className="sc-btn mt-6 h-16 w-full text-[19px]"
              data-testid="cart-checkout-button"
            >
              Go to checkout <ArrowRightIcon size={18} />
            </LocalizedClientLink>
            <p className="mt-5 flex gap-2 text-[16px]">
              <LockIcon size={18} className="mt-1 shrink-0" />
              You won’t pay anything until you confirm your order on the last step.
            </p>
          </div>
          <PhoneHelpCard
            title="Would you rather order by phone?"
            body="Read us your cart and we’ll place the order for you."
          />
        </div>
      </div>
    </div>
  );
};
