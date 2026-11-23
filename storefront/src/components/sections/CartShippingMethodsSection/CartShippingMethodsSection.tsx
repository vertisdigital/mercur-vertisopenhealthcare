'use client';

import { Fragment, useEffect, useState, useTransition, type FC } from 'react';

import { Listbox, Transition } from '@headlessui/react';
import { CheckCircleSolid, ChevronUpDown, Loader } from '@medusajs/icons';
import type { HttpTypes } from '@medusajs/types';
import { clx, Heading, Text } from '@medusajs/ui';
import clsx from 'clsx';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { Button } from '@/components/atoms';
import ErrorMessage from '@/components/molecules/ErrorMessage/ErrorMessage';
import { removeShippingMethod, setShippingMethod } from '@/lib/data/cart';
import { calculatePriceForShippingOption } from '@/lib/data/fulfillment';
import { convertToLocale } from '@/lib/helpers/money';

import { CartShippingMethodRow } from './CartShippingMethodRow';

// Extended cart item product type to include seller
type ExtendedStoreProduct = HttpTypes.StoreProduct & {
  seller?: {
    id: string;
    name: string;
  };
};

// Cart item type definition
type CartItem = {
  product?: ExtendedStoreProduct;
  // Include other cart item properties as needed
};

export type StoreCardShippingMethod = HttpTypes.StoreCartShippingOption & {
  seller_id?: string;
  service_zone?: {
    fulfillment_set: {
      type: string;
    };
  };
};

type ShippingProps = {
  cart: Omit<HttpTypes.StoreCart, 'items'> & {
    items?: CartItem[];
  };
  availableShippingMethods:
    | (StoreCardShippingMethod &
        {
          rules: any;
          seller_id: string;
          price_type: string;
          id: string;
          amount?: number;
        }[])
    | null;
};

const CartShippingMethodsSection: FC<ShippingProps> = ({ cart, availableShippingMethods }) => {
  const [isLoadingPrices, setIsLoadingPrices] = useState(false);
  const [calculatedPricesMap, setCalculatedPricesMap] = useState<Record<string, number>>({});
  const [error, setError] = useState<string | null>(null);
  const [isPendingDeleteRow, startTransitionDeleteRow] = useTransition();

  const [selectedDay, setSelectedDay] = useState<'tomorrow' | 'day2' | 'day3'>('tomorrow');
  const [selectedSlot, setSelectedSlot] = useState<'morning' | 'afternoon'>('morning');
  const [deliveryNote, setDeliveryNote] = useState('');

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const isOpen = searchParams.get('step') === 'delivery';

  const rawMethods = Array.isArray(availableShippingMethods)
    ? availableShippingMethods
    : typeof availableShippingMethods === 'object' && availableShippingMethods !== null
    ? Object.values(availableShippingMethods).flat()
    : [];

  const _shippingMethods = rawMethods.filter(
    (sm: any) => sm?.rules?.find((rule: any) => rule?.attribute === 'is_return')?.value !== 'true'
  );

  useEffect(() => {
    const set = new Set<string>();
    cart.items?.forEach(item => {
      if (item?.product?.seller?.id) {
        set.add(item.product.seller.id);
      }
    });
  }, [cart]);

  useEffect(() => {
    if (_shippingMethods?.length) {
      const promises = _shippingMethods
        .filter(sm => sm.price_type === 'calculated')
        .map(sm => calculatePriceForShippingOption(sm.id, cart.id));

      if (promises.length) {
        Promise.allSettled(promises).then(res => {
          const pricesMap: Record<string, number> = {};
          res
            .filter(r => r.status === 'fulfilled')
            .forEach(p => (pricesMap[p.value?.id || ''] = p.value?.amount!));

          setCalculatedPricesMap(pricesMap);
          setIsLoadingPrices(false);
        });
      }
    }
  }, [availableShippingMethods, _shippingMethods, cart.id]);

  const handleSubmit = () => {
    router.push(pathname + '?step=payment', { scroll: false });
  };

  const handleSetShippingMethod = async (id: string | null) => {
    if (!id) {
      return;
    }

    try {
      setError(null);
      setIsLoadingPrices(true);
      const res = await setShippingMethod({
        cartId: cart.id,
        shippingMethodId: id
      });
      if (!res.ok) {
        return setError(res.error?.message);
      }
    } catch (error: any) {
      setError(
        error?.message?.replace('Error setting up the request: ', '') || 'An error occurred'
      );
    } finally {
      setIsLoadingPrices(false);
      router.refresh();
    }
  };

  const handleRemoveShippingMethod = (methodId: string) => {
    startTransitionDeleteRow(async () => {
      await removeShippingMethod(methodId);
    });
    router.refresh();
  };

  useEffect(() => {
    setError(null);
  }, [isOpen]);

  const groupedBySellerId = _shippingMethods?.reduce((acc: any, method: any) => {
    const sellerId = method.seller_id || method.seller?.id || 'default';

    if (!acc[sellerId]) {
      acc[sellerId] = [];
    }

    const amount = Number(
      method.price_type === 'flat' ? method.amount : calculatedPricesMap[method.id]
    );

    if (!isNaN(amount)) {
      acc[sellerId]?.push({
        ...method,
        seller_name: method.seller_name || method.seller?.name || 'Standard Delivery'
      });
    }

    return acc;
  }, {});

  const handleEdit = () => {
    router.replace(pathname + '?step=delivery');
  };
  const isEditEnabled = !isOpen && !!cart?.shipping_methods?.length;

  const filteredGroupedBySellerId = Object.keys(groupedBySellerId || {}).filter(
    key => (groupedBySellerId?.[key]?.[0]?.seller_name || groupedBySellerId?.[key]?.[0]?.seller?.name || groupedBySellerId?.[key]?.length > 0)
  );

  return (
    <div className="bg-ui-bg-interactive rounded-sm border p-4">
      <div className="mb-6 flex flex-row items-center justify-between">
        <Heading
          level="h2"
          className="text-3xl-regular flex flex-row items-baseline gap-x-2"
        >
          {!isOpen && (cart.shipping_methods?.length ?? 0) > 0 && <CheckCircleSolid />}
          Delivery
        </Heading>
        {isEditEnabled && (
          <Text>
            <Button
              onClick={handleEdit}
              variant="tonal"
            >
              Edit
            </Button>
          </Text>
        )}
      </div>
      {isOpen ? (
        <>
          <div className="grid">
            <div data-testid="delivery-options-container">
              <div className="pb-8 pt-2 md:pt-0">
                {filteredGroupedBySellerId.length === 0
                  ? 'No shipping options available'
                  : filteredGroupedBySellerId.map(key => (
                      <div
                        key={key}
                        className="mb-4"
                      >
                        <Heading
                          level="h3"
                          className="mb-2"
                        >
                          {groupedBySellerId[key][0].seller_name}
                        </Heading>
                        <Listbox
                          value={cart.shipping_methods?.[0]?.id}
                          onChange={value => {
                            handleSetShippingMethod(value);
                          }}
                        >
                          <div className="relative">
                            <Listbox.Button
                              className={clsx(
                                'text-base-regular relative flex h-12 w-full cursor-default items-center justify-between rounded-lg border bg-component-secondary px-4 text-left focus:outline-none focus-visible:border-gray-300 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-300'
                              )}
                            >
                              {({ open }) => (
                                <>
                                  <span className="block truncate">Choose delivery option</span>
                                  <ChevronUpDown
                                    className={clx('transition-rotate duration-200', {
                                      'rotate-180 transform': open
                                    })}
                                  />
                                </>
                              )}
                            </Listbox.Button>
                            <Transition
                              as={Fragment}
                              leave="transition ease-in duration-100"
                              leaveFrom="opacity-100"
                              leaveTo="opacity-0"
                            >
                              <Listbox.Options
                                className="text-small-regular border-top-0 absolute z-20 max-h-60 w-full overflow-auto rounded-lg border bg-white focus:outline-none sm:text-sm"
                                data-testid="shipping-address-options"
                              >
                                {groupedBySellerId[key].map((option: any) => (
                                  <Listbox.Option
                                    className="relative cursor-pointer select-none border-b py-4 pl-6 pr-10 hover:bg-gray-50"
                                    value={option.id}
                                    key={option.id}
                                  >
                                    {option.name}
                                    {' - '}
                                    {option.price_type === 'flat' ? (
                                      convertToLocale({
                                        amount: option.amount!,
                                        currency_code: cart?.currency_code
                                      })
                                    ) : calculatedPricesMap[option.id] ? (
                                      convertToLocale({
                                        amount: calculatedPricesMap[option.id],
                                        currency_code: cart?.currency_code
                                      })
                                    ) : isLoadingPrices ? (
                                      <Loader />
                                    ) : (
                                      '-'
                                    )}
                                  </Listbox.Option>
                                ))}
                              </Listbox.Options>
                            </Transition>
                          </div>
                        </Listbox>
                      </div>
                    ))}
                {!!cart?.shipping_methods?.length && (
                  <div className="flex flex-col gap-4 mt-2">
                    {cart.shipping_methods?.map(method => (
                      <CartShippingMethodRow
                        key={method.id}
                        method={method}
                        currency_code={cart.currency_code}
                        onRemoveShippingMethod={handleRemoveShippingMethod}
                      />
                    ))}

                    {/* Elder Delivery Preference & Day Selector */}
                    <div className="mt-4 p-5 rounded-2xl bg-[#fbfdfc] border border-[#e6f0ea] flex flex-col gap-5">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-sm font-bold text-gray-800">
                            1. Select preferred delivery date
                          </label>
                          <span className="text-xs font-semibold text-[#065f46] bg-[#ecfdf5] px-2 py-0.5 rounded-full border border-[#a7f3d0]">
                            Plain box delivery
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          <button
                            type="button"
                            onClick={() => setSelectedDay('tomorrow')}
                            className={`p-2.5 rounded-xl border text-center transition-all ${
                              selectedDay === 'tomorrow'
                                ? 'border-[#0b3b2c] bg-[#ecfdf5] text-[#0b3b2c] font-bold shadow-sm'
                                : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                            }`}
                          >
                            <span className="block text-xs uppercase tracking-wider text-gray-500">Fastest</span>
                            <span className="block text-sm">Tomorrow</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setSelectedDay('day2')}
                            className={`p-2.5 rounded-xl border text-center transition-all ${
                              selectedDay === 'day2'
                                ? 'border-[#0b3b2c] bg-[#ecfdf5] text-[#0b3b2c] font-bold shadow-sm'
                                : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                            }`}
                          >
                            <span className="block text-xs uppercase tracking-wider text-gray-500">Standard</span>
                            <span className="block text-sm">Thu 27 Nov</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setSelectedDay('day3')}
                            className={`p-2.5 rounded-xl border text-center transition-all ${
                              selectedDay === 'day3'
                                ? 'border-[#0b3b2c] bg-[#ecfdf5] text-[#0b3b2c] font-bold shadow-sm'
                                : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                            }`}
                          >
                            <span className="block text-xs uppercase tracking-wider text-gray-500">Flexible</span>
                            <span className="block text-sm">Fri 28 Nov</span>
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-800 mb-2">
                          2. Preferred arrival window
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            type="button"
                            onClick={() => setSelectedSlot('morning')}
                            className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                              selectedSlot === 'morning'
                                ? 'border-[#0b3b2c] bg-[#ecfdf5] text-[#0b3b2c] font-bold shadow-sm'
                                : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                            }`}
                          >
                            <div>
                              <span className="block text-sm">🌅 Morning slot</span>
                              <span className="block text-xs text-gray-500 font-normal">9:00 AM – 1:00 PM</span>
                            </div>
                            <span className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                              selectedSlot === 'morning' ? 'border-[#0b3b2c] bg-[#0b3b2c]' : 'border-gray-300'
                            }`}>
                              {selectedSlot === 'morning' && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                            </span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setSelectedSlot('afternoon')}
                            className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                              selectedSlot === 'afternoon'
                                ? 'border-[#0b3b2c] bg-[#ecfdf5] text-[#0b3b2c] font-bold shadow-sm'
                                : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                            }`}
                          >
                            <div>
                              <span className="block text-sm">🌇 Afternoon slot</span>
                              <span className="block text-xs text-gray-500 font-normal">2:00 PM – 6:00 PM</span>
                            </div>
                            <span className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                              selectedSlot === 'afternoon' ? 'border-[#0b3b2c] bg-[#0b3b2c]' : 'border-gray-300'
                            }`}>
                              {selectedSlot === 'afternoon' && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                            </span>
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-800 mb-1.5">
                          3. Safe place / Doorstep notes (Optional)
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Leave outside door if unattended, or ring door chime"
                          value={deliveryNote}
                          onChange={(e) => setDeliveryNote(e.target.value)}
                          className="w-full text-sm p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#0b3b2c] focus:ring-1 focus:ring-[#0b3b2c] bg-white placeholder-gray-400"
                        />
                      </div>

                      <div className="flex items-center gap-2 text-xs text-gray-600 bg-white p-3 rounded-xl border border-gray-100">
                        <span className="text-base">📦</span>
                        <span><strong>Discreet packaging guarantee:</strong> Your parcel will arrive in a plain, sturdy brown carton with no healthcare markings.</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="mt-6">
            <ErrorMessage
              error={error}
              data-testid="delivery-option-error-message"
            />
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!cart.shipping_methods?.[0] || isPendingDeleteRow}
              className={`w-full py-4 px-6 rounded-xl font-bold text-base flex items-center justify-center gap-2 transition-colors shadow-sm ${
                !cart.shipping_methods?.[0] || isPendingDeleteRow
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-[#0b3b2c] hover:bg-[#062c20] text-white active:scale-[0.99]'
              }`}
            >
              {isLoadingPrices ? (
                <span className="animate-spin">⏳</span>
              ) : (
                <>
                  <span>Continue to Payment</span>
                  <span>→</span>
                </>
              )}
            </button>
          </div>
        </>
      ) : (
        <div>
          <div className="text-small-regular">
            {cart && (cart.shipping_methods?.length ?? 0) > 0 && (
              <div className="flex flex-col">
                {cart.shipping_methods?.map(method => (
                  <div
                    key={method.id}
                    className="mb-4 rounded-md border p-4"
                  >
                    <Text className="txt-medium-plus text-ui-fg-base mb-1">Method</Text>
                    <Text className="txt-medium text-ui-fg-subtle">
                      {method.name}{' '}
                      {convertToLocale({
                        amount: method.amount!,
                        currency_code: cart?.currency_code
                      })}
                    </Text>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CartShippingMethodsSection;
