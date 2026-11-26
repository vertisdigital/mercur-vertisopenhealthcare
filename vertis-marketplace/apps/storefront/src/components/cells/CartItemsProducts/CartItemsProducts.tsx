import { HttpTypes } from '@medusajs/types';
import Image from 'next/image';

import { DeleteCartItemButton } from '@/components/molecules/DeleteCartItemButton/DeleteCartItemButton';
import LocalizedClientLink from '@/components/molecules/LocalizedLink/LocalizedLink';
import { UpdateCartItemButton } from '@/components/molecules/UpdateCartItemButton/UpdateCartItemButton';
import { filterValidCartItems } from '@/lib/helpers/filter-valid-cart-items';
import { convertToLocale } from '@/lib/helpers/money';

export const CartItemsProducts = ({
  products,
  currency_code,
  delete_item = true,
  change_quantity = true
}: {
  products: HttpTypes.StoreCartLineItem[];
  currency_code: string;
  delete_item?: boolean;
  change_quantity?: boolean;
}) => {
  const validProducts = filterValidCartItems(products);

  return (
    <ul className="space-y-4">
      {validProducts.map(product => {
        const options = Object.entries(product.variant_option_values ?? {});
        const money = (amount: number) => convertToLocale({ amount, currency_code });
        const lineTotal = Number((product as any).original_total ?? product.total ?? product.subtotal ?? 0);
        const unit = product.quantity ? lineTotal / product.quantity : 0;
        const details = [
          ...options.map(([title, value]) => `${title}: ${String(value)}`),
          product.subtitle
        ].filter(Boolean);

        return (
          <li
            key={product.id}
            data-testid={`cart-item-${product.id}`}
            className="flex gap-5 rounded-[20px] border border-primary bg-white p-5"
          >
            <LocalizedClientLink
              href={`/products/${product.product_handle}`}
              className="sc-tile-bg relative h-24 w-24 shrink-0 overflow-hidden rounded-[16px] sm:h-28 sm:w-28"
              tabIndex={-1}
              data-testid="cart-item-image"
            >
              <Image
                src={product.thumbnail ? decodeURIComponent(product.thumbnail) : '/images/placeholder.svg'}
                alt=""
                fill
                sizes="112px"
                className={product.thumbnail ? 'object-contain p-2' : 'object-contain p-6 opacity-30'}
              />
            </LocalizedClientLink>

            <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:justify-between">
              <div className="min-w-0">
                <h3 className="text-[20px] font-semibold leading-[28px]" style={{ fontFamily: 'inherit', letterSpacing: 0 }} data-testid="cart-item-title">
                  <LocalizedClientLink href={`/products/${product.product_handle}`} className="hover:underline">
                    {product.product_title}
                  </LocalizedClientLink>
                </h3>
                {details.length > 0 && (
                  <p className="mt-1 text-[16px]" data-testid="cart-item-details">{details.join(' · ')}</p>
                )}
                <p className="mt-2 text-[16px]">{money(unit)} each</p>
                {delete_item && (
                  <div className="mt-3">
                    <DeleteCartItemButton id={product.id} />
                  </div>
                )}
              </div>

              <div className="flex flex-row items-center justify-between gap-4 sm:flex-col sm:items-end">
                <p className="text-[24px] font-bold text-[rgba(var(--brand-900))]" data-testid="cart-item-price">
                  {money(lineTotal)}
                </p>
                {change_quantity ? (
                  <UpdateCartItemButton quantity={product.quantity} lineItemId={product.id} />
                ) : (
                  <p className="text-[16px]">
                    Quantity: <span className="font-semibold text-[rgba(var(--brand-900))]">{product.quantity}</span>
                  </p>
                )}
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
};
