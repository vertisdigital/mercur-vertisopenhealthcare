// Line icons for the SilverCircle theme (24px grid, 1.75 stroke).
import type { SVGProps } from "react"

type IconProps = SVGProps<SVGSVGElement> & { size?: number }

const make = (paths: React.ReactNode, displayName: string) => {
  const Icon = ({ size = 20, strokeWidth = 1.75, ...props }: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {paths}
    </svg>
  )
  Icon.displayName = displayName
  return Icon
}

export const PhoneIcon = make(
  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />,
  "PhoneIcon"
)
export const SearchIcon = make(
  <>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </>,
  "SearchIcon"
)
export const UserIcon = make(
  <>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21a8 8 0 0 1 16 0" />
  </>,
  "UserIcon"
)
export const BagIcon = make(
  <>
    <path d="M6 7h12l1 14H5L6 7z" />
    <path d="M9 7a3 3 0 0 1 6 0" />
  </>,
  "BagIcon"
)
export const ArrowRightIcon = make(<path d="M5 12h14m-6-6 6 6-6 6" />, "ArrowRightIcon")
export const ArrowLeftIcon = make(<path d="M19 12H5m6 6-6-6 6-6" />, "ArrowLeftIcon")
export const ArrowUpIcon = make(<path d="M12 19V5m-6 6 6-6 6 6" />, "ArrowUpIcon")
export const CheckIcon = make(<path d="m5 12 5 5L20 7" />, "CheckIcon")
export const PlusIcon = make(<path d="M12 5v14M5 12h14" />, "PlusIcon")
export const MinusIcon = make(<path d="M5 12h14" />, "MinusIcon")
export const InfoIcon = make(
  <>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 11v5M12 8h.01" />
  </>,
  "InfoIcon"
)
export const LockIcon = make(
  <>
    <rect x="5" y="11" width="14" height="10" rx="2" />
    <path d="M8 11V7a4 4 0 0 1 8 0v4" />
  </>,
  "LockIcon"
)
export const TrashIcon = make(
  <path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" />,
  "TrashIcon"
)
export const TruckIcon = make(
  <>
    <path d="M2 6h11v10H2zM13 9h4l4 4v3h-8" />
    <circle cx="6" cy="17.5" r="1.8" />
    <circle cx="17" cy="17.5" r="1.8" />
  </>,
  "TruckIcon"
)
export const BoxIcon = make(
  <>
    <path d="m21 8-9-5-9 5v8l9 5 9-5V8z" />
    <path d="m3 8 9 5 9-5M12 13v8" />
  </>,
  "BoxIcon"
)
export const RepeatIcon = make(
  <>
    <path d="M20 11a8 8 0 0 0-14.3-4.9L4 8" />
    <path d="M4 4v4h4" />
    <path d="M4 13a8 8 0 0 0 14.3 4.9L20 16" />
    <path d="M20 20v-4h-4" />
  </>,
  "RepeatIcon"
)
export const ReturnIcon = make(
  <path d="M9 14 4 9l5-5M4 9h11a5 5 0 0 1 0 10h-3" />,
  "ReturnIcon"
)
export const CheckCircleIcon = make(
  <>
    <circle cx="12" cy="12" r="9" />
    <path d="m8 12 3 3 5-6" />
  </>,
  "CheckCircleIcon"
)
export const PouchIcon = make(
  <>
    <rect x="5" y="3" width="14" height="18" rx="2" />
    <path d="M5 7h14" />
  </>,
  "PouchIcon"
)

/* Category ("Shop by need") icons */
export const DropletIcon = make(<path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z" />, "DropletIcon")
export const BandageIcon = make(
  <>
    <rect x="3" y="8" width="18" height="8" rx="4" />
    <path d="M10 10v4M14 10v4" />
  </>,
  "BandageIcon"
)
export const MobilityIcon = make(
  <>
    <circle cx="13" cy="4" r="1.6" />
    <path d="M12 7v6h5l2 6M12 10H8M9 21a5 5 0 1 1 3-9" />
  </>,
  "MobilityIcon"
)
export const BathIcon = make(
  <>
    <path d="M3 12h18v3a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4v-3z" />
    <path d="M6 12V6a2 2 0 0 1 4 0M7 19l-1 2M17 19l1 2" />
  </>,
  "BathIcon"
)
export const CutleryIcon = make(
  <path d="M7 3v8a2 2 0 0 0 2 2v8M11 3v8a2 2 0 0 1-2 2M17 21V3c-2 1-3 3-3 6v4h3" />,
  "CutleryIcon"
)
export const BottleIcon = make(
  <>
    <rect x="7" y="8" width="10" height="13" rx="2" />
    <path d="M10 8V5h4v3M10 3h4M10 13h4" />
  </>,
  "BottleIcon"
)
export const HeartIcon = make(
  <path d="M20.8 5.6a5 5 0 0 0-7.1 0L12 7.3l-1.7-1.7a5 5 0 0 0-7.1 7.1L12 21.5l8.8-8.8a5 5 0 0 0 0-7.1z" />,
  "HeartIcon"
)
export const GridIcon = make(
  <>
    <rect x="4" y="4" width="7" height="7" rx="1.5" />
    <rect x="13" y="4" width="7" height="7" rx="1.5" />
    <rect x="4" y="13" width="7" height="7" rx="1.5" />
    <rect x="13" y="13" width="7" height="7" rx="1.5" />
  </>,
  "GridIcon"
)
export const TrainingIcon = make(
  <>
    <path d="M12 5 2 9.5l10 4.5 10-4.5z" />
    <path d="M6 11.8V16c3.3 2.4 8.7 2.4 12 0v-4.2" />
    <path d="M22 9.5V15" />
  </>,
  "TrainingIcon"
)
export const PulseIcon = make(<path d="M3 12h4l2.5-6 4 12 2.5-6H21" />, "PulseIcon")
