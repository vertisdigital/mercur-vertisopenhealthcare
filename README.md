# Mercur Vertis Open Healthcare Marketplace

A modern, multi-vendor healthcare commerce and training catalog platform built with **Medusa v2**, **Mercur Marketplace**, and **Next.js 15**.

Designed for Singapore healthcare and caregiving ecosystems, combining:
- **Seniors' Mobility and Enabling Fund (SMF)** consumable subsidies and medical supplies (diapers, nutrition, blood pressure monitors, catheters, wound care).
- **Caregivers Training Grant (CTG)** & **SkillsFuture (SFC)** training course catalog and registrations, synced from live OrderCloud endpoints.
- High-performance multi-vendor marketplace dynamics inspired by Shopee / Lazada Singapore (official brand malls, AIC-accredited training providers, flash badges, subsidies filtering).

---

## 🏗 Architecture

```
mercur-vertisopenhealthcare/
├── storefront/               # Next.js 15 App Router storefront
│   ├── src/
│   │   ├── app/              # Localized routing, categories, products
│   │   ├── components/       # UI molecules, organisms, sections, cells
│   │   ├── lib/              # Data fetching, Medusa client, filters
│   │   └── const/            # App constants, pagination, regions
│   └── public/               # Logos, category illustrations, banners
├── vertis-marketplace/       # Medusa v2 multi-vendor backend
│   ├── apps/                 # API server, admin portal, vendor dashboard
│   ├── packages/             # Marketplace modules, payment, fulfillment
│   └── docker-compose.yml    # Postgres & Redis containers
├── convert_to_healthcare.sql # SQL migration for SMF consumables & healthcare sellers
├── update_remaining.sql      # Additional medical consumables & brand mappings
└── seed_ctg_courses.js       # Live OrderCloud CTG training course ingestion script
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- [Bun](https://bun.sh/) (recommended) or pnpm
- Docker & Docker Compose (for Postgres and Redis)

---

### 1. Database Setup

Start Postgres and Redis:
```bash
cd vertis-marketplace
docker compose up -d
```

Seed initial healthcare products and sellers:
```bash
# Execute SQL migration on postgres database 'mercur'
psql -U postgres -d mercur -f ../convert_to_healthcare.sql
psql -U postgres -d mercur -f ../update_remaining.sql
```

Fetch & seed live CTG training courses from OrderCloud:
```bash
node ../seed_ctg_courses.js
```

---

### 2. Backend (Medusa v2 & Mercur)

```bash
cd vertis-marketplace
bun install
bun run dev
```

The Medusa server starts at `http://localhost:9000`.

---

### 3. Storefront (Next.js 15)

```bash
cd storefront
bun install
bun run dev
```

The marketplace storefront runs at `http://localhost:3000`.

---

## 💡 Key Features
- **CTG Training Course Catalogue**: Dedicated course cards with training provider attribution, venue/mode tags, target conditions, and CTG subsidy badges.
- **SMF Consumables & Official Malls**: Verified brand stores for TENA, Abbott Ensure, Omron Healthcare, Salvation Army, and Home Nursing Foundation.
- **Dual-Mode Interactive Filtering**: Dynamic sidebar filters tailoring attributes according to product catalog type (Skills & Care Target for CTG; Subsidies & Brands for SMF).
- **Pixel-Perfect Unified UI**: Symmetrical responsive containers aligned across all navigation levels and product grids.

---

## 📄 License
Internal proprietary - Vertis Digital Pte Ltd.
