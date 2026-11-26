// Brand copy for the SilverCircle (elder-friendly) storefront theme.
// Override the phone number per deployment with NEXT_PUBLIC_SUPPORT_PHONE.
export const BRAND = {
  name: "SilverCircle",
  tagline: "Care supplies, made easy to buy.",
  phone: process.env.NEXT_PUBLIC_SUPPORT_PHONE || "1800 XXX XXXX",
  hours: "9 am – 6 pm, every day",
}

export const phoneHref = `tel:${BRAND.phone.replace(/[^0-9+]/g, "")}`
