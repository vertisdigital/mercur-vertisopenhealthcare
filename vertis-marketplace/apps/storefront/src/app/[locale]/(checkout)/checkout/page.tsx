import { Suspense } from 'react';

import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import PaymentWrapper from '@/components/organisms/PaymentContainer/PaymentWrapper';
import { CartAddressSection } from '@/components/sections/CartAddressSection/CartAddressSection';
import CartPaymentSection from '@/components/sections/CartPaymentSection/CartPaymentSection';
import CartReview from '@/components/sections/CartReview/CartReview';
import CartShippingMethodsSection from '@/components/sections/CartShippingMethodsSection/CartShippingMethodsSection';
import { retrieveCart } from '@/lib/data/cart';
import { retrieveCustomer } from '@/lib/data/customer';
import { listCartShippingMethods } from '@/lib/data/fulfillment';
import { listCartPaymentMethods } from '@/lib/data/payment';
import { CheckoutStepper } from '@/components/silver/checkout/CheckoutStepper';
import { PhoneHelpCard } from '@/components/silver/PhoneHelp';

export const metadata: Metadata = {
  title: 'Checkout',
  description: 'My cart page - Checkout',
  robots: { index: false, follow: false }
};

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={<div className="container flex items-center justify-center" data-testid="checkout-page-loading">Loading...</div>}
    >
      <CheckoutPageContent />
    </Suspense>
  );
}

async function CheckoutPageContent() {
  const cart = await retrieveCart();

  if (!cart) {
    return notFound();
  }

  const shippingMethods = await listCartShippingMethods(cart.id, false);
  const paymentMethods = await listCartPaymentMethods(cart.region?.id ?? '');
  const customer = await retrieveCustomer();

  return (
    <PaymentWrapper cart={cart}>
      <main className="container" data-testid="checkout-page">
        <CheckoutStepper />
        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          <div className="flex flex-col gap-5" data-testid="checkout-steps-container">
            <CartAddressSection
              cart={cart}
              customer={customer}
            />
            <CartShippingMethodsSection
              cart={cart}
              availableShippingMethods={shippingMethods as any}
            />
            <CartPaymentSection
              cart={cart}
              availablePaymentMethods={paymentMethods}
            />
          </div>

          <div className="space-y-5" data-testid="checkout-review-container">
            <CartReview cart={cart} />
            <PhoneHelpCard
              compact
              title="Stuck on something?"
              body="Call us and we’ll finish the order with you."
            />
          </div>
        </div>
      </main>
    </PaymentWrapper>
  );
}
