import LocalizedClientLink from "@/components/molecules/LocalizedLink/LocalizedLink"
import { cn } from "@/lib/utils"

export const LogoMark = ({ size = 26 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 26 26" aria-hidden="true">
    <circle cx="13" cy="13" r="10.5" fill="none" stroke="currentColor" strokeWidth="3" />
    <circle cx="13" cy="13" r="4" fill="currentColor" />
  </svg>
)

export const Logo = ({
  className,
  size = "md",
}: {
  className?: string
  size?: "sm" | "md"
}) => (
  <LocalizedClientLink
    href="/"
    aria-label="SilverCircle home"
    className={cn(
      "inline-flex shrink-0 items-center gap-2.5 text-[rgba(var(--brand-900))]",
      className
    )}
    data-testid="header-logo-link"
  >
    <LogoMark size={size === "sm" ? 22 : 26} />
    <span
      className={cn(
        "font-display leading-none tracking-[-0.03em]",
        size === "sm" ? "text-[22px]" : "text-[26px]"
      )}
      style={{ fontFamily: '"Funnel Display", sans-serif' }}
    >
      <span className="font-medium">Silver</span>
      <span className="font-bold">Circle</span>
    </span>
  </LocalizedClientLink>
)
