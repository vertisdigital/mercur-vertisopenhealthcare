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

export const metadata: Metadata = {
  title: 'Checkout',
  description: 'My cart page - Checkout'
};

export default async function CheckoutPage({}) {
  return (
    <Suspense
      fallback={<div className="container flex items-center justify-center" data-testid="checkout-page-loading">Loading...</div>}
    >
      <CheckoutPageContent />
    </Suspense>
  );
}

async function CheckoutPageContent({}) {
  const cart = await retrieveCart();

  if (!cart) {
    return notFound();
  }

  const shippingMethods = await listCartShippingMethods(cart.id, false);
  const paymentMethods = await listCartPaymentMethods(cart.region?.id ?? '');
  const customer = await retrieveCustomer();

  return (
    <PaymentWrapper cart={cart}>
      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-8" data-testid="checkout-page">
        {/* Step Indicator Header */}
        <div className="mb-8 p-4 bg-white rounded-2xl border border-[#e6f0ea] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-6 text-sm font-semibold">
            <div className="flex items-center gap-2 text-[#0b3b2c]">
              <span className="w-7 h-7 rounded-full bg-[#0b3b2c] text-white flex items-center justify-center text-xs font-bold">1</span>
              <span>Delivery & Address</span>
            </div>
            <span className="text-gray-300">→</span>
            <div className="flex items-center gap-2 text-gray-700">
              <span className="w-7 h-7 rounded-full bg-gray-100 text-gray-700 flex items-center justify-center text-xs font-bold border border-gray-300">2</span>
              <span>Payment</span>
            </div>
            <span className="text-gray-300">→</span>
            <div className="flex items-center gap-2 text-gray-400">
              <span className="w-7 h-7 rounded-full bg-gray-50 text-gray-400 flex items-center justify-center text-xs font-bold border border-gray-200">3</span>
              <span>Review</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-[#065f46] font-medium bg-[#ecfdf5] px-3 py-1.5 rounded-full border border-[#a7f3d0]">
            <span>📦</span>
            <span>Unmarked Plain Box Delivery</span>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-11">
          <div className="flex flex-col gap-4 lg:col-span-6" data-testid="checkout-steps-container">
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

          <div className="lg:col-span-5" data-testid="checkout-review-container">
            <CartReview cart={cart} />
          </div>
        </div>
      </main>
    </PaymentWrapper>
  );
}
