'use client';

import { useSearchParams } from 'next/navigation';

export const CheckoutProgress = () => {
  const searchParams = useSearchParams();
  const stepParam = searchParams.get('step') || 'address';

  const currentStep =
    stepParam === 'payment'
      ? 2
      : stepParam === 'review'
      ? 3
      : 1;

  const steps = [
    { num: 1, label: 'Delivery' },
    { num: 2, label: 'Payment' },
    { num: 3, label: 'Review' },
  ];

  return (
    <div className="mb-8 grid grid-cols-3 gap-4">
      {steps.map((s) => {
        const isCompleted = currentStep > s.num;
        const isActive = currentStep === s.num;

        return (
          <div key={s.num} className="flex flex-col gap-2.5">
            <div
              className={`h-1 rounded-full transition-colors ${
                isCompleted || isActive ? 'bg-[#0b3b2c]' : 'bg-gray-200'
              }`}
            />
            <div className="flex items-center gap-2.5">
              <span
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                  isCompleted
                    ? 'bg-[#0b3b2c] text-white'
                    : isActive
                    ? 'border-2 border-[#0b3b2c] text-[#0b3b2c] bg-white'
                    : 'border border-gray-300 text-gray-400 bg-white'
                }`}
              >
                {isCompleted ? '✓' : s.num}
              </span>
              <div className="leading-tight">
                <span className="block text-[11px] text-gray-500 font-medium">
                  Step {s.num} of 3
                </span>
                <span
                  className={`block text-xs md:text-sm font-bold ${
                    isActive || isCompleted ? 'text-[#0b3b2c]' : 'text-gray-400'
                  }`}
                >
                  {s.label}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
