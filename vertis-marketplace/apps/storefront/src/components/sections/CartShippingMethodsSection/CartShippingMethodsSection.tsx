'use client';

import { useEffect, useState, useTransition, type FC } from 'react';

import { CheckCircleSolid } from '@medusajs/icons';
import type { HttpTypes } from '@medusajs/types';
import { Heading, Text } from '@medusajs/ui';
import clsx from 'clsx';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { Button } from '@/components/atoms/Button/Button';
import ErrorMessage from '@/components/molecules/ErrorMessage/ErrorMessage';
import { removeShippingMethod, setShippingMethod } from '@/lib/data/cart';
import { calculatePriceForShippingOption } from '@/lib/data/fulfillment';
import { convertToLocale } from '@/lib/helpers/money';


type ExtendedStoreProduct = HttpTypes.StoreProduct & {
  seller?: {
    id: string;
    name: string;
  };
};

type CartItem = {
  product?: ExtendedStoreProduct;
};

export type StoreCardShippingMethod = HttpTypes.StoreCartShippingOption & {
  seller_id?: string;
  seller_name?: string;
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

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const isOpen = searchParams.get('step') === 'delivery';

  const _shippingMethods = availableShippingMethods?.filter(
    sm => sm.rules?.find((rule: any) => rule.attribute === 'is_return')?.value !== 'true'
  );

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

  const groupedBySellerId = _shippingMethods?.reduce((acc: any, method) => {
    const sellerId = method.seller_id!;

    if (!acc[sellerId]) {
      acc[sellerId] = [];
    }

    const amount = Number(
      method.price_type === 'flat' ? method.amount : calculatedPricesMap[method.id]
    );

    if (!isNaN(amount)) {
      acc[sellerId]?.push(method);
    }

    return acc;
  }, {});

  const handleEdit = () => {
    router.replace(pathname + '?step=delivery');
  };
  const isEditEnabled = !isOpen && !!cart?.shipping_methods?.length;

  const filteredGroupedBySellerId = Object.keys(groupedBySellerId || {}).filter(
    key => groupedBySellerId?.[key]?.[0]?.seller_name
  );

  // The shipping method a seller currently has selected in the cart, matched by
  // the option ids that belong to that seller.
  const getSelectedMethodForSeller = (key: string) => {
    const optionIds = new Set<string>(
      (groupedBySellerId?.[key] ?? []).map((o: any) => o.id)
    );
    return cart.shipping_methods?.find(
      method =>
        !!method.shipping_option_id && optionIds.has(method.shipping_option_id)
    );
  };

  // Payment is only reachable once every seller in the cart has a method.
  const allSellersHaveMethod =
    filteredGroupedBySellerId.length > 0 &&
    filteredGroupedBySellerId.every(key => !!getSelectedMethodForSeller(key));


  return (
    <div className="sc-card p-6 md:p-8">
      <div className="mb-6 flex flex-row items-center justify-between">
        <Heading
          level="h2"
          className="heading-md flex flex-row items-center gap-x-3"
        >
          {!isOpen && (cart.shipping_methods?.length ?? 0) > 0 && <CheckCircleSolid />}
          Choose your delivery
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
                  : filteredGroupedBySellerId.map(key => {
                      const selectedMethod = getSelectedMethodForSeller(key);

                      return (
                      <div
                        key={key}
                        className="mb-4"
                      >
                        {filteredGroupedBySellerId.length > 1 && (
                          <p className="mb-3 text-[17px] font-semibold text-[rgba(var(--brand-900))]">
                            From {groupedBySellerId[key][0].seller_name}
                          </p>
                        )}
                        <div
                          role="radiogroup"
                          aria-label={`Delivery from ${groupedBySellerId[key][0].seller_name}`}
                          className="grid gap-3 sm:grid-cols-2"
                          data-testid="shipping-address-options"
                        >
                          {[...groupedBySellerId[key]]
                            .sort((a: any, b: any) => Number(a.amount ?? 0) - Number(b.amount ?? 0))
                            .map((option: any) => {
                            const selected = selectedMethod?.shipping_option_id === option.id;
                            const amount =
                              option.price_type === 'flat' ? option.amount : calculatedPricesMap[option.id];
                            const price =
                              amount === undefined || amount === null
                                ? isLoadingPrices
                                  ? '…'
                                  : '-'
                                : Number(amount) === 0
                                  ? 'Free'
                                  : convertToLocale({ amount: Number(amount), currency_code: cart?.currency_code });
                            return (
                              <button
                                key={option.id}
                                type="button"
                                role="radio"
                                aria-checked={selected}
                                onClick={() => handleSetShippingMethod(option.id)}
                                className={clsx(
                                  'flex min-h-[88px] items-start gap-3 rounded-[16px] border-2 p-4 text-left transition-colors',
                                  selected
                                    ? 'border-[rgba(var(--brand-900))] bg-[rgba(var(--brand-25))]'
                                    : 'border-[rgba(var(--brand-100))] bg-white hover:border-[rgba(var(--brand-300))]'
                                )}
                                data-testid="shipping-option"
                              >
                                <span
                                  className={clsx(
                                    'mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2',
                                    selected ? 'border-[rgba(var(--brand-900))]' : 'border-[rgba(var(--brand-300))]'
                                  )}
                                  aria-hidden
                                >
                                  {selected && <span className="h-3 w-3 rounded-full bg-[rgba(var(--brand-900))]" />}
                                </span>
                                <span className="min-w-0 flex-1">
                                  <span className="block text-[18px] font-semibold text-[rgba(var(--brand-900))]">
                                    {option.name}
                                  </span>
                                  {option.type?.description && (
                                    <span className="mt-0.5 block text-[15px]">{option.type.description}</span>
                                  )}
                                  <span className="mt-1 block text-[17px] font-semibold text-[rgba(var(--brand-900))]">
                                    {price}
                                  </span>
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                      );
                    })}
              </div>
            </div>
          </div>
          <div>
            <ErrorMessage
              error={error}
              data-testid="delivery-option-error-message"
            />
            <Button
              onClick={handleSubmit}
              className="w-full h-14 text-[length:18px]"
              disabled={!allSellersHaveMethod || isPendingDeleteRow}
              loading={isLoadingPrices}
            >
              Continue to payment
            </Button>
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
                    <Text className="text-[17px] font-semibold text-[rgba(var(--brand-900))] mb-1">Method</Text>
                    <Text className="text-[16px]">
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
