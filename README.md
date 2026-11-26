# Mercur Vertis Open Healthcare Marketplace

A multi-vendor healthcare marketplace for Singapore, built on **Mercur 2.4** (Medusa v2) with the elder-friendly **SilverCircle** storefront (Next.js 16).

It combines:
- **Care supplies** (SMF-style consumables): continence care, wound care, mobility aids, bathroom safety, daily living, skin care, health monitoring and nutrition.
- **Official brand stores**: TENA Singapore, Abbott Nutrition SG and Omron Healthcare SG, next to the SilverCircle Care and CarePlus Pharmacy shops. Several products are sold by more than one seller, so shoppers can compare offers.
- **Caregivers Training Grant (CTG) courses** from AIC-accredited training providers (The Salvation Army Peacehaven, Home Nursing Foundation, HCA Hospice, Econ Careskill).

Prices are in **SGD with 9% GST included**.

---

## Architecture

Everything lives in one Turborepo monorepo, so a single `bun run dev` starts all of it:

```
vertis-marketplace/
├── packages/api/             # Medusa v2 + Mercur backend (port 9000)
│   ├── src/scripts/seed.ts       # base Mercur seed (store, sales channel, shipping profile, API key)
│   ├── src/scripts/seed-care.ts  # Singapore healthcare catalogue, sellers, CTG courses
│   └── static/care/              # product illustrations served at /static/care
├── apps/admin/               # Admin panel  → http://localhost:9000/dashboard (Vite, port 7000)
├── apps/vendor/              # Seller panel → http://localhost:9000/seller   (Vite, port 7001)
├── apps/storefront/          # SilverCircle storefront (Next.js 16, port 3000)
│   └── src/components/silver/    # design kit: header, home sections, PDP, checkout
└── docker-compose.yml        # Postgres + Redis
```

The admin and seller panels are served through the backend URL, which proxies to their Vite dev servers. If you start only `packages/api`, those URLs show "Dashboard not built".

---

## Getting started

### Prerequisites
- Node.js 22+
- [Bun](https://bun.sh/)
- Docker

### 1. Database
```bash
cd vertis-marketplace
docker compose up -d
```

### 2. Backend env and data
```bash
cp packages/api/.env.template packages/api/.env   # defaults match docker-compose
bun install

cd packages/api
bunx medusa db:migrate
bun run seed                 # base Mercur data
bun run seed:care            # healthcare catalogue, sellers, CTG courses
bunx medusa user -e admin@mercur-test.com -p supersecret
```

`seed:care` is idempotent: run it again and it skips whatever already exists. It hides the base fashion demo (inactive categories, draft products) instead of deleting it.

### 3. Storefront env
```bash
cp apps/storefront/.env.template apps/storefront/.env.local
```
Set `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY` to the key created by `bun run seed` (Admin → Settings → Publishable API keys, or `select token from api_key where type='publishable'`).

### 4. Run
```bash
cd vertis-marketplace
bun run dev
```

| | URL | Login |
|---|---|---|
| Storefront | http://localhost:3000/sg | register, or check out as a guest |
| Admin | http://localhost:9000/dashboard | admin@mercur-test.com / supersecret |
| Seller | http://localhost:9000/seller | e.g. silvercircle@mercur.dev, tena@mercur.dev, peacehaven@mercur.dev / supersecret |

All seeded sellers use the password `supersecret`. Their e-mails: `silvercircle`, `careplus`, `tena`, `abbott`, `omron`, `peacehaven`, `hnf`, `hca`, `econ` (each `@mercur.dev`).

---

## Demo notes
- **Courses are products** in the *Caregiver training* aisle. The provider, mode, duration, topic and CTG eligibility appear as product facts. Training providers offer a free "Course confirmation by e-mail" option instead of delivery.
- **Checkout splits by seller.** One cart becomes an order group with one order per seller, and each seller fulfils its own order in the seller panel.
- **Commission** is Mercur's default 10% of the pre-GST amount. Payouts need a payout provider, such as the Stripe Connect plugin, which is not installed.
- **Design-only features:** repeat deliveries and delivery day/time slots are shown in the UI but have no backend support yet.

## License
Internal proprietary - Vertis Digital Pte Ltd.
