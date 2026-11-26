import { cn } from "@/lib/utils"

import Spinner from "@/icons/spinner"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "filled" | "tonal" | "text" | "destructive"
  size?: "small" | "large"
  loading?: boolean
  "data-testid"?: string
}

export function Button({
  children,
  variant = "filled",
  size = "small",
  loading = false,
  disabled = false,
  className,
  "data-testid": dataTestId,
  ...props
}: ButtonProps) {
  const baseClasses =
    "inline-flex items-center justify-center gap-2 min-h-[48px] text-[length:17px] font-semibold rounded-full transition-colors disabled:bg-disabled disabled:text-disabled disabled:cursor-not-allowed"

  const variantClasses = {
    filled: `bg-action text-action-on-primary hover:bg-action-hover active:bg-action-pressed ${
      loading && "button-text-filled"
    }`,
    tonal:
      "bg-white border-2 border-[rgba(var(--brand-200))] hover:bg-action-secondary-hover active:bg-action-secondary-pressed text-[rgba(var(--brand-900))]",
    text: "bg-transparent hover:bg-action-secondary-hover active:bg-action-secondary-pressed text-[rgba(var(--brand-900))]",
    destructive: `text-negative-on-primary bg-negative hover:bg-negative-hover active:bg-negative-pressed ${
      loading && "button-text-filled"
    }`,
  }

  const sizeClasses = {
    small: "px-5 py-2",
    large: "px-7 py-3",
  }

  return (
    <button
      disabled={disabled}
      className={cn(
        variantClasses[variant],
        sizeClasses[size],
        baseClasses,
        className
      )}
      data-testid={dataTestId ?? `button-${variant}-${size}`}
      {...props}
    >
      {loading ? <Spinner /> : children}
    </button>
  )
}
