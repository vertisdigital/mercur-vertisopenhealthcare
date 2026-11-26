'use client';

import { useCartContext } from '@/components/providers';
import { MinusIcon, PlusIcon } from '@/components/silver/Icons';
import { cn } from '@/lib/utils';
import { toast } from '@/lib/helpers/toast';

const MAX_QUANTITY = 99;

export const UpdateCartItemButton = ({
  quantity,
  lineItemId,
  compact = false
}: {
  quantity: number;
  lineItemId: string;
  compact?: boolean;
}) => {
  const { updateCartItem } = useCartContext();
  const isOptimisticLine = !lineItemId || lineItemId.startsWith('optimistic:');

  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity < 1 || newQuantity > MAX_QUANTITY) return;

    try {
      await updateCartItem(lineItemId, newQuantity);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message.replace('Error setting up the request: ', '')
          : 'Failed to update quantity';
      toast.error({
        title: 'Error updating cart',
        description: errorMessage
      });
    }
  };

  const buttonClassName = cn(
    'flex cursor-pointer items-center justify-center disabled:cursor-not-allowed disabled:opacity-40',
    'rounded-full text-[rgba(var(--brand-900))] bg-[rgba(var(--brand-25))] hover:bg-[rgba(var(--brand-50))]',
    compact ? 'h-9 w-9' : 'h-12 w-12'
  );

  return (
    <div
      aria-label="Item quantity"
      role="group"
      className={cn(
        'inline-flex items-center gap-1 rounded-full border-2 border-[rgba(var(--brand-200))] bg-white p-1'
      )}
      data-testid="cart-item-quantity"
    >
      <button
        type="button"
        aria-label="One fewer"
        className={buttonClassName}
        disabled={isOptimisticLine || quantity <= 1}
        onClick={() => handleQuantityChange(quantity - 1)}
        data-testid="cart-item-quantity-decrease"
      >
        <MinusIcon size={compact ? 16 : 20} />
      </button>
      <span
        aria-live="polite"
        role="status"
        className={cn('text-center font-bold tabular-nums text-[rgba(var(--brand-900))]', compact ? 'w-8 text-[17px]' : 'w-10 text-[20px]')}
        data-testid="cart-item-quantity-value"
      >
        {quantity}
      </span>
      <button
        type="button"
        aria-label="One more"
        className={buttonClassName}
        disabled={isOptimisticLine || quantity >= MAX_QUANTITY}
        onClick={() => handleQuantityChange(quantity + 1)}
        data-testid="cart-item-quantity-increase"
      >
        <PlusIcon size={compact ? 16 : 20} />
      </button>
    </div>
  );
};
