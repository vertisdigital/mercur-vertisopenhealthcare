/**
 * Vertis Open Healthcare demo data: a Singapore care catalogue (SMF-style
 * consumables, official brand stores and CTG caregiver-training courses) for
 * the elder-friendly SilverCircle storefront.
 *
 *   bun run seed        # base Mercur seed (store, sales channel, shipping profile)
 *   bun run seed:care   # this script
 *
 * What it does (each step is skipped if it already exists, so it can be re-run):
 *  1. Adds SGD to the store (default) and creates a "Singapore" region
 *     (SGD, prices include 9% GST) plus the SG tax region.
 *  2. Hides the original fashion demo: its categories become inactive and its
 *     products go to draft. Nothing is deleted.
 *  3. Creates the "Shop by need" aisles, including Caregiver training.
 *  4. Creates the Singapore sellers (care shops, brand stores, AIC training
 *     providers), each with a warehouse, delivery zone and shipping options.
 *  5. Creates the master products (inline variant axes + text facts) with
 *     illustrations served from packages/api/static/care, and SGD offers.
 *  6. Puts four products in a "Most reordered" collection for the home page.
 */
import { ExecArgs } from "@medusajs/framework/types"
import {
  ContainerRegistrationKeys,
  Modules,
  ProductStatus,
} from "@medusajs/framework/utils"
import {
  createWorkflow,
  transform,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import {
  createCollectionsWorkflow,
  createPricePreferencesWorkflow,
  createLocationFulfillmentSetWorkflow,
  createProductCategoriesWorkflow,
  createRegionsWorkflow,
  createServiceZonesWorkflow,
  createTaxRegionsWorkflow,
  linkSalesChannelsToStockLocationWorkflow,
  updatePricePreferencesWorkflow,
  updateProductCategoriesWorkflow,
  updateProductsWorkflow,
  updateStoresStep,
} from "@medusajs/medusa/core-flows"
import {
  approveSellerWorkflow,
  createOffersWorkflow,
  createProductsWorkflow,
  createSellerAccountWorkflow,
  createSellerShippingOptionsWorkflow,
  createSellerStockLocationsWorkflow,
} from "@mercurjs/core/workflows"
import type { CreateOfferDTO } from "@mercurjs/types"

const IMG = (name: string) =>
  `${process.env.FILE_BACKEND_URL || "http://localhost:9000/static"}/care/${name}.svg`

const AISLES = [
  { name: "Continence care", handle: "continence-care", description: "Catheters, drainage bags, pads" },
  { name: "Wound care", handle: "wound-care", description: "Dressings, bandages, skin barriers" },
  { name: "Mobility aids", handle: "mobility-aids", description: "Rollators, walking sticks, wheelchairs" },
  { name: "Bathroom safety", handle: "bathroom-safety", description: "Grab rails, shower chairs, raised seats" },
  { name: "Daily living", handle: "daily-living", description: "Easy-grip cutlery, pill organisers, reachers" },
  { name: "Skin & personal care", handle: "skin-personal-care", description: "Barrier creams, wipes, gloves" },
  { name: "Health monitoring", handle: "health-monitoring", description: "Blood pressure monitors, thermometers" },
  { name: "Nutrition", handle: "nutrition", description: "Nutrition drinks, diabetic formulas" },
  { name: "Caregiver training", handle: "caregiver-training", description: "CTG-funded courses for family carers" },
] as const

type SellerKey =
  | "silvercircle"
  | "careplus"
  | "tena"
  | "abbott"
  | "omron"
  | "peacehaven"
  | "hnf"
  | "hca"
  | "econ"

type Axis = { title: string; values: string[] }
type CareProduct = {
  handle: string
  title: string
  subtitle: string
  description: string
  aisle: (typeof AISLES)[number]["handle"]
  image: string
  facts: [string, string][]
  axes?: Axis[]
  /** Price in SGD (GST included) per variant; key is the axis values joined by " / ". */
  price: number | Record<string, number>
  material?: string
  weight?: number
  mostReordered?: boolean
  /** Who sells it at the listed price. Defaults to SilverCircle Care. */
  seller?: SellerKey
  /** CarePlus Pharmacy also sells this, at this multiple of the listed price. */
  careplus?: number
}

const ctg = (provider: string, mode: string, duration: string, topic: string): [string, string][] => [
  ["Training provider", provider],
  ["Mode", mode],
  ["Duration", duration],
  ["Topic", topic],
  ["Funding", "Caregivers Training Grant (CTG) eligible"],
]

const CATALOGUE: CareProduct[] = [
  {
    handle: "intermittent-catheters",
    title: "Intermittent Catheters",
    subtitle: "Hydrophilic, ready to use",
    description:
      "Single-use catheters with a hydrophilic coating, ready to use straight from the pouch — no water needed. Each one is individually wrapped in an easy-open pouch.",
    aisle: "continence-care",
    image: "catheter",
    facts: [["In a box", "30 or 60"], ["Length", "40 cm"], ["Type", "Intermittent, single use"], ["Coating", "Hydrophilic, ready to use from the pouch"], ["Storage", "Room temperature, away from direct sunlight"]],
    axes: [{ title: "Size", values: ["CH10", "CH12", "CH14", "CH16"] }, { title: "Box size", values: ["Box of 30", "Box of 60"] }],
    price: { "Box of 30": 54, "Box of 60": 102 },
    material: "PVC-free and latex-free",
    mostReordered: true,
    careplus: 1.06,
  },
  {
    handle: "leg-drainage-bag-750ml",
    title: "Leg Drainage Bag, 750 ml",
    subtitle: "Box of 10 · soft-backed, with leg straps",
    description: "A discreet leg bag with a soft fabric back, anti-kink tube and an easy-turn tap you can open with one hand.",
    aisle: "continence-care",
    image: "drainbag",
    facts: [["In a box", "10 bags"], ["Capacity", "750 ml"], ["Tap", "Easy-turn, one hand"]],
    axes: [{ title: "Tube length", values: ["Short (10 cm)", "Long (30 cm)"] }],
    price: 36,
    material: "Latex-free",
  },
  {
    handle: "pull-up-incontinence-pants",
    title: "Pull-up Incontinence Pants",
    subtitle: "Pack of 14 · worn like normal underwear",
    description: "Soft, quiet pull-up pants with an odour-control core. Tear-away sides make them easy to remove.",
    aisle: "continence-care",
    image: "pants",
    facts: [["In a pack", "14 pants"], ["Absorbency", "Heavy"], ["Sides", "Tear-away"]],
    axes: [{ title: "Size", values: ["S/M", "L", "XL"] }],
    price: 24.9,
    careplus: 0.96,
  },
  {
    handle: "bed-underpads-60x90",
    title: "Bed Underpads, 60 × 90 cm",
    subtitle: "Pack of 30 · protects mattress and chairs",
    description: "Disposable absorbent pads with a waterproof backing. Lay flat on a bed or chair.",
    aisle: "continence-care",
    image: "underpad",
    facts: [["In a pack", "30 pads"], ["Size", "60 × 90 cm"], ["Backing", "Waterproof"]],
    price: 19.9,
  },
  {
    handle: "silicone-foam-dressing",
    title: "Silicone Foam Dressing",
    subtitle: "Pack of 10 · gentle adhesive border",
    description: "A soft foam dressing with a silicone border that stays put but lifts off gently, without hurting fragile skin.",
    aisle: "wound-care",
    image: "foam",
    facts: [["In a pack", "10 dressings"], ["Border", "Gentle silicone"], ["Wear time", "Up to 7 days"]],
    axes: [{ title: "Size", values: ["7.5 × 7.5 cm", "10 × 10 cm", "15 × 15 cm"] }],
    price: { "7.5 × 7.5 cm": 29, "10 × 10 cm": 38, "15 × 15 cm": 52 },
    mostReordered: true,
    careplus: 1.04,
  },
  {
    handle: "sterile-gauze-swabs",
    title: "Sterile Gauze Swabs, 10 × 10 cm",
    subtitle: "Pack of 100 · individually packed in fives",
    description: "Soft, low-lint cotton gauze for cleaning and covering small wounds.",
    aisle: "wound-care",
    image: "gauze",
    facts: [["In a pack", "100 swabs"], ["Size", "10 × 10 cm"], ["Sterile", "Yes, in packs of 5"]],
    price: 12.5,
  },
  {
    handle: "no-sting-skin-barrier-wipes",
    title: "No-Sting Skin Barrier Wipes",
    subtitle: "Box of 30 · protects skin around wounds",
    description: "Leaves a thin, breathable film that protects delicate skin from adhesives and moisture. Alcohol-free, so it doesn’t sting.",
    aisle: "wound-care",
    image: "wipes",
    facts: [["In a box", "30 wipes"], ["Alcohol", "Alcohol-free"], ["Drying time", "About 30 seconds"]],
    price: 32,
  },
  {
    handle: "conforming-bandage",
    title: "Conforming Bandage",
    subtitle: "Pack of 12 · stretches to fit",
    description: "A light, stretchy bandage that holds dressings in place on knees, elbows and other awkward spots.",
    aisle: "wound-care",
    image: "bandage",
    facts: [["In a pack", "12 rolls"], ["Length", "4 m stretched"], ["Fastening", "Tape or clip"]],
    axes: [{ title: "Width", values: ["5 cm", "7.5 cm", "10 cm"] }],
    price: { "5 cm": 9.9, "7.5 cm": 11.9, "10 cm": 13.9 },
  },
  {
    handle: "folding-rollator-with-seat",
    title: "Folding Rollator with Seat",
    subtitle: "Four wheels, hand brakes, padded seat",
    description: "A sturdy four-wheel walker with loop brakes, a padded seat for resting and a shopping basket. Folds flat to fit in the car.",
    aisle: "mobility-aids",
    image: "rollator",
    facts: [["Seat height", "54 cm"], ["Weight", "7.5 kg"], ["Holds up to", "136 kg"]],
    price: 189,
    weight: 7500,
    mostReordered: true,
    careplus: 1.05,
  },
  {
    handle: "adjustable-walking-stick",
    title: "Adjustable Walking Stick",
    subtitle: "Height adjusts 75–95 cm, soft-grip handle",
    description: "A light aluminium stick with a comfortable soft-grip handle and a non-slip rubber tip. Push-button height adjustment.",
    aisle: "mobility-aids",
    image: "cane",
    facts: [["Height", "75–95 cm"], ["Weight", "380 g"], ["Tip", "Non-slip rubber"]],
    price: 29,
    weight: 380,
    mostReordered: true,
    careplus: 0.97,
  },
  {
    handle: "lightweight-folding-wheelchair",
    title: "Lightweight Folding Wheelchair",
    subtitle: "Self-propelled · folds in one movement",
    description: "A light, foldable wheelchair with flip-up armrests, swing-away footrests and puncture-proof tyres.",
    aisle: "mobility-aids",
    image: "wheelchair",
    facts: [["Seat width", "46 cm"], ["Weight", "13 kg"], ["Holds up to", "115 kg"]],
    price: 420,
    weight: 13000,
  },
  {
    handle: "quad-cane-small-base",
    title: "Quad Cane, Small Base",
    subtitle: "Stands on its own · four rubber feet",
    description: "Extra stability from a four-footed base that stands up by itself, so it’s always within reach.",
    aisle: "mobility-aids",
    image: "quadcane",
    facts: [["Height", "71–94 cm"], ["Base", "Small, four feet"], ["Holds up to", "136 kg"]],
    price: 45,
  },
  {
    handle: "suction-grab-rail-30cm",
    title: "Suction Grab Rail, 30 cm",
    subtitle: "No drilling · green indicators show it’s secure",
    description: "Fits to smooth tiles or glass in seconds. Indicators turn green when the suction is firm, so you know it’s safe to use.",
    aisle: "bathroom-safety",
    image: "grabrail",
    facts: [["Length", "30 cm"], ["Fitting", "Suction, no drilling"], ["Safety check", "Green indicators"]],
    price: 34,
    careplus: 1.08,
  },
  {
    handle: "shower-chair-with-back",
    title: "Shower Chair with Back",
    subtitle: "Height adjustable · non-slip feet",
    description: "A rust-proof shower chair with a back rest, drainage holes and non-slip rubber feet.",
    aisle: "bathroom-safety",
    image: "showerchair",
    facts: [["Seat height", "41–53 cm"], ["Holds up to", "136 kg"], ["Feet", "Non-slip rubber"]],
    price: 79,
  },
  {
    handle: "raised-toilet-seat-10cm",
    title: "Raised Toilet Seat, 10 cm",
    subtitle: "Makes sitting and standing easier",
    description: "Raises the seat by 10 cm and clamps securely to most standard toilets. Easy to remove for cleaning.",
    aisle: "bathroom-safety",
    image: "toiletseat",
    facts: [["Raises by", "10 cm"], ["Fitting", "Adjustable clamps"], ["Holds up to", "190 kg"]],
    price: 59,
  },
  {
    handle: "easy-grip-cutlery-set",
    title: "Easy-Grip Cutlery Set",
    subtitle: "4 pieces · wide, soft handles",
    description: "Knife, fork, spoon and soup spoon with wide, cushioned handles that are easy to hold with arthritis or a weak grip.",
    aisle: "daily-living",
    image: "cutlery",
    facts: [["In the set", "4 pieces"], ["Handle", "Wide, soft-grip"], ["Dishwasher safe", "Yes"]],
    price: 39,
  },
  {
    handle: "weekly-pill-organiser",
    title: "Weekly Pill Organiser, AM/PM",
    subtitle: "14 compartments · large letters",
    description: "Morning and evening compartments for each day, with large, raised letters and easy-open lids.",
    aisle: "daily-living",
    image: "pillbox",
    facts: [["Compartments", "14"], ["Labels", "Large, raised letters"], ["Lids", "Easy-open"]],
    price: 14.9,
    careplus: 0.94,
  },
  {
    handle: "long-handled-reacher",
    title: "Long-Handled Reacher, 80 cm",
    subtitle: "Pick things up without bending",
    description: "A light reacher with a rotating jaw and a magnetic tip for picking up keys and pins.",
    aisle: "daily-living",
    image: "reacher",
    facts: [["Length", "80 cm"], ["Jaw", "Rotating, rubber-lined"], ["Tip", "Magnetic"]],
    price: 22,
  },
  {
    handle: "barrier-cream-100g",
    title: "Barrier Cream, 100 g",
    subtitle: "Protects and soothes sore skin",
    description: "A fragrance-free cream that protects skin from moisture and helps soothe redness.",
    aisle: "skin-personal-care",
    image: "cream",
    facts: [["Tube", "100 g"], ["Fragrance", "Fragrance-free"], ["Suitable for", "Daily use"]],
    price: 16.5,
  },
  {
    handle: "nitrile-gloves-box-100",
    title: "Nitrile Examination Gloves",
    subtitle: "Box of 100 · powder-free",
    description: "Latex-free nitrile gloves for carers. Textured fingertips for a secure grip.",
    aisle: "skin-personal-care",
    image: "gloves",
    facts: [["In a box", "100 gloves"], ["Powder", "Powder-free"], ["Latex", "Latex-free"]],
    axes: [{ title: "Size", values: ["S", "M", "L"] }],
    price: 12.9,
    careplus: 1.03,
  },
  {
    handle: "gentle-cleansing-wipes",
    title: "Gentle Cleansing Wipes",
    subtitle: "Pack of 80 · extra large and soft",
    description: "Large, soft wipes for washing without water. Fragrance-free and pH balanced.",
    aisle: "skin-personal-care",
    image: "wipes",
    facts: [["In a pack", "80 wipes"], ["Size", "30 × 20 cm"], ["Fragrance", "Fragrance-free"]],
    price: 8.9,
  },

  /* Official brand stores ------------------------------------------------ */
  {
    handle: "tena-proskin-pants-normal",
    title: "TENA ProSkin Pants Normal",
    subtitle: "Pack of 10 · pull-up, breathable",
    description: "Pull-up pants that feel like normal underwear, with a breathable outer layer that helps keep skin healthy.",
    aisle: "continence-care",
    image: "pants",
    facts: [["In a pack", "10 pants"], ["Absorbency", "Normal"], ["Brand", "TENA"]],
    axes: [{ title: "Size", values: ["M", "L"] }],
    price: 16.9,
    seller: "tena",
    careplus: 1.05,
  },
  {
    handle: "tena-proskin-slip-maxi",
    title: "TENA ProSkin Slip Maxi",
    subtitle: "Pack of 24 · all-in-one brief with tabs",
    description: "Maximum-absorbency all-in-one briefs with refastenable tabs, for heavy incontinence and overnight use.",
    aisle: "continence-care",
    image: "pants",
    facts: [["In a pack", "24 briefs"], ["Absorbency", "Maxi"], ["Fastening", "Refastenable tabs"], ["Brand", "TENA"]],
    axes: [{ title: "Size", values: ["M", "L"] }],
    price: 42.9,
    seller: "tena",
  },
  {
    handle: "tena-wet-wipes",
    title: "TENA Wet Wipes",
    subtitle: "Pack of 48 · gentle, pH balanced",
    description: "Soft, pre-moistened wipes for quick and gentle cleansing during continence care.",
    aisle: "skin-personal-care",
    image: "wipes",
    facts: [["In a pack", "48 wipes"], ["Skin", "pH balanced"], ["Brand", "TENA"]],
    price: 6.9,
    seller: "tena",
  },
  {
    handle: "ensure-life-nutrition-drink",
    title: "Ensure Life Nutrition Drink, 220 ml",
    subtitle: "Pack of 4 · 2.4 kcal per ml",
    description: "A high-energy, high-protein drink for seniors who find it hard to eat enough. Ready to drink.",
    aisle: "nutrition",
    image: "drink",
    facts: [["In a pack", "4 × 220 ml"], ["Energy", "2.4 kcal per ml"], ["Brand", "Abbott Ensure"]],
    axes: [{ title: "Flavour", values: ["Vanilla", "Chocolate"] }],
    price: 19.9,
    seller: "abbott",
    careplus: 1.04,
  },
  {
    handle: "glucerna-triple-care-850g",
    title: "Glucerna Triple Care Powder, 850 g",
    subtitle: "Diabetes-specific nutrition",
    description: "Complete, balanced nutrition designed to help manage blood sugar response. Mix with water.",
    aisle: "nutrition",
    image: "powder",
    facts: [["Tin", "850 g"], ["Flavour", "Vanilla"], ["Brand", "Abbott Glucerna"]],
    price: 52.9,
    seller: "abbott",
  },
  {
    handle: "omron-hem-7120-bp-monitor",
    title: "Omron HEM-7120 Upper Arm Blood Pressure Monitor",
    subtitle: "One-button reading · large display",
    description: "Measures blood pressure and pulse at the press of one button, with a large, easy-to-read display and an irregular heartbeat indicator.",
    aisle: "health-monitoring",
    image: "bpmonitor",
    facts: [["Cuff", "22–32 cm upper arm"], ["Display", "Large digits"], ["Power", "4 × AA batteries"], ["Brand", "Omron"]],
    price: 79,
    seller: "omron",
    careplus: 1.05,
  },
  {
    handle: "omron-mc-720-thermometer",
    title: "Omron MC-720 Non-Contact Forehead Thermometer",
    subtitle: "Reading in 1 second · no contact",
    description: "Takes a temperature from 1–3 cm away in one second — no need to wake someone who is resting.",
    aisle: "health-monitoring",
    image: "thermometer",
    facts: [["Reading time", "1 second"], ["Method", "Non-contact infrared"], ["Brand", "Omron"]],
    price: 59,
    seller: "omron",
  },
  {
    handle: "urgo-waterproof-island-dressing",
    title: "Urgo Waterproof Island Dressing, 10 × 10 cm",
    subtitle: "Box of 10 · shower-proof",
    description: "A sterile dressing with an absorbent pad and a waterproof film, so you can shower without changing it.",
    aisle: "wound-care",
    image: "foam",
    facts: [["In a box", "10 dressings"], ["Size", "10 × 10 cm"], ["Waterproof", "Yes"]],
    price: 14.9,
    careplus: 1.02,
  },
  {
    handle: "medishield-3-ply-surgical-mask",
    title: "MediShield 3-Ply Surgical Face Mask",
    subtitle: "Box of 50 · BFE 99%",
    description: "Three-layer surgical masks with a soft inner layer and adjustable nose wire, for carers and visitors.",
    aisle: "skin-personal-care",
    image: "mask",
    facts: [["In a box", "50 masks"], ["Filtration", "BFE 99%"], ["Layers", "3"]],
    price: 7.9,
  },
  {
    handle: "hartmann-cohesive-bandage",
    title: "Hartmann Peha-Haft Cohesive Bandage, 4 m",
    subtitle: "Sticks to itself, not to skin",
    description: "An elastic bandage that holds by sticking to itself, so no clips or tape are needed.",
    aisle: "wound-care",
    image: "bandage",
    facts: [["Length", "4 m stretched"], ["Width", "6 cm"], ["Latex", "Latex-free"]],
    price: 6.5,
  },

  /* Caregivers Training Grant (CTG) courses ------------------------------ */
  {
    handle: "basic-wound-management-caregiver",
    title: "A Caregiver's Guide to Basic Wound Management",
    subtitle: "3 hours · classroom",
    description: "AIC-accredited course covering skin and wound assessment, the stages of wound healing and basic sterile dressing.",
    aisle: "caregiver-training",
    image: "course",
    facts: ctg("The Salvation Army Peacehaven", "Classroom (in person)", "3 hours", "Wound & palliative nursing"),
    price: 200,
    seller: "peacehaven",
  },
  {
    handle: "caregivers-guide-to-dementia",
    title: "A Caregiver's Guide to Dementia Care",
    subtitle: "8 hours · classroom",
    description: "Recognising signs of dementia, person-centred communication, and managing challenging behaviours without medication.",
    aisle: "caregiver-training",
    image: "course",
    facts: ctg("The Salvation Army Peacehaven", "Classroom (in person)", "8 hours", "Dementia & cognitive care"),
    price: 250,
    seller: "peacehaven",
  },
  {
    handle: "caregivers-guide-palliative-care",
    title: "A Caregiver's Guide to the Palliative Care Approach",
    subtitle: "8 hours · classroom",
    description: "The essentials of palliative care, comfort management and talking about end-of-life needs.",
    aisle: "caregiver-training",
    image: "course",
    facts: ctg("The Salvation Army Peacehaven", "Classroom (in person)", "8 hours", "Wound & palliative nursing"),
    price: 250,
    seller: "peacehaven",
  },
  {
    handle: "family-caregivers-dementia-literacy",
    title: "Family Caregivers Toolkit: Dementia Literacy & Social Inclusion",
    subtitle: "8 hours · classroom",
    description: "Helps families create a dementia-friendly home and support loved ones while keeping them independent and connected.",
    aisle: "caregiver-training",
    image: "course",
    facts: ctg("The Salvation Army Peacehaven", "Classroom (in person)", "8 hours", "Dementia & cognitive care"),
    price: 300,
    seller: "peacehaven",
  },
  {
    handle: "building-resilient-caregivers-online",
    title: "Building Resilient Caregivers: Psychosocial Skills & Mental Health",
    subtitle: "6 hours · online",
    description: "An interactive online course on avoiding burnout, emotional wellbeing, finding financial support and communication.",
    aisle: "caregiver-training",
    image: "online",
    facts: ctg("Home Nursing Foundation", "Online (Zoom)", "6 hours", "Psychosocial & resilient caregiver"),
    price: 70,
    seller: "hnf",
  },
  {
    handle: "assistance-adls-elderly",
    title: "Assistance in Activities of Daily Living (ADLs) for Seniors",
    subtitle: "4 hours · classroom",
    description: "Hands-on training in showering, personal hygiene, feeding, dressing and helping seniors with limited mobility at home.",
    aisle: "caregiver-training",
    image: "course",
    facts: ctg("Econ Careskill Training Centre", "Classroom (in person)", "4 hours", "Activities of daily living"),
    price: 150,
    seller: "econ",
  },
  {
    handle: "safe-transfer-mobility-techniques",
    title: "Safe Transfer & Mobility Techniques for Wheelchair Caregivers",
    subtitle: "4 hours · classroom",
    description: "Safe lifting, bed-to-wheelchair and commode transfers, and fall prevention — protecting both carer and senior.",
    aisle: "caregiver-training",
    image: "course",
    facts: ctg("Econ Careskill Training Centre", "Classroom (in person)", "4 hours", "Activities of daily living"),
    price: 130,
    seller: "econ",
  },
  {
    handle: "palliative-care-comfort-strategies",
    title: "Palliative Care & Comfort Strategies at Home",
    subtitle: "6 hours · classroom",
    description: "Monitoring pain and symptoms, compassionate communication, mouth care and coping with advanced illness at home.",
    aisle: "caregiver-training",
    image: "course",
    facts: ctg("HCA Hospice", "Classroom (in person)", "6 hours", "Wound & palliative nursing"),
    price: 180,
    seller: "hca",
  },
  {
    handle: "managing-challenging-behaviours-dementia",
    title: "Managing Challenging Behaviours in Moderate to Severe Dementia",
    subtitle: "6 hours · classroom",
    description: "Calming techniques for sundowning, wandering and agitation, and reading non-verbal cues.",
    aisle: "caregiver-training",
    image: "course",
    facts: ctg("The Salvation Army Peacehaven", "Classroom (in person)", "6 hours", "Dementia & cognitive care"),
    price: 220,
    seller: "peacehaven",
  },
  {
    handle: "caregiver-stress-management-self-care",
    title: "Caregiver Stress Management & Self-Care Workshop",
    subtitle: "4 hours · online",
    description: "Peer sharing and mindfulness techniques for long-term carers balancing work, family and eldercare.",
    aisle: "caregiver-training",
    image: "online",
    facts: ctg("Home Nursing Foundation", "Online (Zoom)", "4 hours", "Psychosocial & resilient caregiver"),
    price: 85,
    seller: "hnf",
  },
  {
    handle: "tube-feeding-dysphagia-care",
    title: "Tube Feeding & Swallowing Difficulties (Dysphagia) Care at Home",
    subtitle: "5 hours · classroom",
    description: "Safe nasogastric tube flushing, preparing feeds, positioning during feeding and preventing aspiration pneumonia.",
    aisle: "caregiver-training",
    image: "course",
    facts: ctg("Home Nursing Foundation", "Classroom (in person)", "5 hours", "Wound & palliative nursing"),
    price: 190,
    seller: "hnf",
  },
  {
    handle: "basic-elderly-first-aid-domestic-workers",
    title: "Basic Elderly First Aid & Emergency Response for Domestic Workers",
    subtitle: "4 hours · classroom",
    description: "Responding to choking, falls and burns, and when and how to call 995 — tailored for domestic caregivers.",
    aisle: "caregiver-training",
    image: "course",
    facts: ctg("The Salvation Army Peacehaven", "Classroom (in person)", "4 hours", "Activities of daily living"),
    price: 160,
    seller: "peacehaven",
  },
]

type SellerConfig = {
  key: SellerKey
  name: string
  email: string
  first_name: string
  last_name: string
  address_1: string
  postal_code: string
  description: string
  /** "training" sellers sell courses: no delivery, a free e-mail confirmation instead. */
  kind?: "shop" | "training"
}

const SELLERS: SellerConfig[] = [
  {
    key: "silvercircle",
    name: "SilverCircle Care",
    email: "silvercircle@mercur.dev",
    first_name: "Siew Ling",
    last_name: "Tan",
    address_1: "10 Ubi Crescent",
    postal_code: "408564",
    description: "Care supplies, delivered in a plain box. Real people on the phone 9 am – 6 pm, every day.",
  },
  {
    key: "careplus",
    name: "CarePlus Pharmacy",
    email: "careplus@mercur.dev",
    first_name: "Daniel",
    last_name: "Lim",
    address_1: "190 Lorong 6 Toa Payoh",
    postal_code: "310190",
    description: "Neighbourhood pharmacy with home delivery across Singapore.",
  },
  {
    key: "tena",
    name: "TENA Singapore",
    email: "tena@mercur.dev",
    first_name: "Mei Ling",
    last_name: "Ong",
    address_1: "2 Changi South Lane",
    postal_code: "486123",
    description: "Official store for TENA continence care and hygiene products in Singapore.",
  },
  {
    key: "abbott",
    name: "Abbott Nutrition SG",
    email: "abbott@mercur.dev",
    first_name: "Ravi",
    last_name: "Kumar",
    address_1: "3 Fraser Street",
    postal_code: "189352",
    description: "Official store for Ensure, Glucerna and medical nutrition in Singapore.",
  },
  {
    key: "omron",
    name: "Omron Healthcare SG",
    email: "omron@mercur.dev",
    first_name: "Kenji",
    last_name: "Tan",
    address_1: "438B Alexandra Road",
    postal_code: "119968",
    description: "Official store for Omron blood pressure monitors, thermometers and health devices.",
  },
  {
    key: "peacehaven",
    name: "The Salvation Army Peacehaven",
    email: "peacehaven@mercur.dev",
    first_name: "Grace",
    last_name: "Chua",
    address_1: "9 Upper Changi Road North",
    postal_code: "507706",
    description: "AIC-accredited training provider specialising in dementia and nursing care.",
    kind: "training",
  },
  {
    key: "hnf",
    name: "Home Nursing Foundation",
    email: "hnf@mercur.dev",
    first_name: "Aisha",
    last_name: "Rahman",
    address_1: "Blk 120 Bukit Merah View",
    postal_code: "152120",
    description: "Home healthcare organisation teaching caregiver clinical skills and mental wellbeing.",
    kind: "training",
  },
  {
    key: "hca",
    name: "HCA Hospice",
    email: "hca@mercur.dev",
    first_name: "Wei Jie",
    last_name: "Ng",
    address_1: "12 Jalan Tan Tock Seng",
    postal_code: "308437",
    description: "Home hospice care provider supporting palliative caregivers.",
    kind: "training",
  },
  {
    key: "econ",
    name: "Econ Careskill Training Centre",
    email: "econ@mercur.dev",
    first_name: "Farah",
    last_name: "Ismail",
    address_1: "1 Thomson Lane",
    postal_code: "297724",
    description: "Eldercare training centre for domestic workers and family caregivers.",
    kind: "training",
  },
]
const SELLER_PASSWORD = "supersecret"
const FASHION_CATEGORY_PARENTS = ["Sandals", "Sneakers", "Boots", "Sport", "Accessories"]

const updateStoreCurrencies = createWorkflow(
  "seed-care-update-store-currencies",
  (input: { store_id: string; supported_currencies: { currency_code: string; is_default?: boolean }[] }) => {
    const data = transform({ input }, ({ input }) => ({
      selector: { id: input.store_id },
      update: { supported_currencies: input.supported_currencies },
    }))
    return new WorkflowResponse(updateStoresStep(data))
  }
)

const combos = (axes: Axis[]): Record<string, string>[] =>
  axes.reduce<Record<string, string>[]>(
    (acc, axis) => acc.flatMap((c) => axis.values.map((v) => ({ ...c, [axis.title]: v }))),
    [{}]
  )

const priceFor = (p: CareProduct, options: Record<string, string>) => {
  if (typeof p.price === "number") return p.price
  for (const value of Object.values(options)) {
    if (value in p.price) return p.price[value]
  }
  throw new Error(`No price for ${p.handle} ${JSON.stringify(options)}`)
}

export default async function seedCare({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const link = container.resolve(ContainerRegistrationKeys.LINK)
  const storeService = container.resolve(Modules.STORE)
  const regionService = container.resolve(Modules.REGION)
  const taxService = container.resolve(Modules.TAX)
  const productService = container.resolve(Modules.PRODUCT)
  const authService = container.resolve(Modules.AUTH)

  /* 1. Currency, region, tax ------------------------------------------- */
  const [store] = await storeService.listStores({}, { relations: ["supported_currencies"] })
  const currencies = new Set((store.supported_currencies ?? []).map((c) => c.currency_code))
  if (!currencies.has("sgd")) {
    await updateStoreCurrencies(container).run({
      input: {
        store_id: store.id,
        supported_currencies: [
          { currency_code: "sgd", is_default: true },
          ...[...currencies].map((currency_code) => ({ currency_code, is_default: false })),
        ],
      },
    })
    logger.info("Added SGD to the store (default currency).")
  }

  let [region] = await regionService.listRegions({ name: "Singapore" })
  if (!region) {
    const { result } = await createRegionsWorkflow(container).run({
      input: {
        regions: [
          {
            name: "Singapore",
            currency_code: "sgd",
            countries: ["sg"],
            payment_providers: ["pp_system_default"],
            automatic_taxes: true,
            is_tax_inclusive: true,
          },
        ],
      },
    })
    region = result[0]
    logger.info("Created the Singapore region (SGD, GST-inclusive prices).")
  }

  const taxRegions = await taxService.listTaxRegions({ country_code: "sg" })
  if (!taxRegions.length) {
    await createTaxRegionsWorkflow(container).run({
      input: [
        {
          country_code: "sg",
          provider_id: "tp_system",
          default_tax_rate: { rate: 9, code: "GST", name: "GST" },
        },
      ],
    })
    logger.info("Created the SG tax region (9% GST).")
  }

  // Offer prices are stored per currency, so the SGD currency preference (not
  // just the region's) must say "GST included" or 9% is added on top at checkout.
  const pricingService = container.resolve(Modules.PRICING)
  const [sgdPref] = await pricingService.listPricePreferences({ attribute: "currency_code", value: "sgd" })
  if (!sgdPref) {
    await createPricePreferencesWorkflow(container).run({
      input: [{ attribute: "currency_code", value: "sgd", is_tax_inclusive: true }],
    })
    logger.info("SGD prices now include GST.")
  } else if (!sgdPref.is_tax_inclusive) {
    await updatePricePreferencesWorkflow(container).run({
      input: { selector: { id: [sgdPref.id] }, update: { is_tax_inclusive: true } },
    })
    logger.info("SGD prices now include GST.")
  }

  /* 2. Hide the fashion demo -------------------------------------------- */
  const fashionParents = await productService.listProductCategories({ name: FASHION_CATEGORY_PARENTS })
  const fashionCats = await productService.listProductCategories({
    parent_category_id: fashionParents.map((c) => c.id),
  })
  const fashionCatIds = [...fashionParents, ...fashionCats].filter((c) => c.is_active).map((c) => c.id)
  if (fashionCatIds.length) {
    await updateProductCategoriesWorkflow(container).run({
      input: { selector: { id: fashionCatIds }, update: { is_active: false } },
    })
    logger.info(`Hid ${fashionCatIds.length} fashion categories (set inactive).`)
  }

  const careHandles = new Set(CATALOGUE.map((p) => p.handle))
  const { data: published } = await query.graph({
    entity: "product",
    fields: ["id", "handle"],
    filters: { status: ProductStatus.PUBLISHED },
  })
  const toDraft = published.filter((p) => !careHandles.has(p.handle as string)).map((p) => p.id as string)
  if (toDraft.length) {
    await updateProductsWorkflow(container).run({
      input: { selector: { id: toDraft }, update: { status: ProductStatus.DRAFT } },
    })
    logger.info(`Moved ${toDraft.length} non-care products to draft.`)
  }

  /* 3. Aisles ------------------------------------------------------------ */
  const existingAisles = await productService.listProductCategories({ handle: AISLES.map((a) => a.handle) })
  const aisleByHandle = new Map(existingAisles.map((c) => [c.handle, c.id]))
  const missingAisles = AISLES.filter((a) => !aisleByHandle.has(a.handle))
  if (missingAisles.length) {
    const { result } = await createProductCategoriesWorkflow(container).run({
      input: {
        product_categories: missingAisles.map((a) => ({
          name: a.name,
          handle: a.handle,
          description: a.description,
          is_active: true,
          rank: AISLES.findIndex((x) => x.handle === a.handle),
        })),
      },
    })
    result.forEach((c) => aisleByHandle.set(c.handle, c.id))
    logger.info(`Created ${result.length} aisles.`)
  }

  /* 4. Sellers ----------------------------------------------------------- */
  const { data: profiles } = await query.graph({
    entity: "shipping_profile",
    fields: ["id"],
    filters: { name: "Marketplace Shipping" },
  })
  const shippingProfileId = profiles[0]?.id as string
  if (!shippingProfileId) throw new Error('Shipping profile "Marketplace Shipping" not found — run the base seed first.')

  const { data: channels } = await query.graph({ entity: "sales_channel", fields: ["id"], filters: { name: "Default Sales Channel" } })
  const salesChannelId = channels[0].id as string

  type Seller = { key: SellerKey; id: string; memberId: string; locationId: string; name: string }
  const sellers: Seller[] = []

  for (const cfg of SELLERS) {
    const { data: existing } = await query.graph({ entity: "seller", fields: ["id"], filters: { email: cfg.email } })
    const { data: members } = await query.graph({ entity: "member", fields: ["id"], filters: { email: cfg.email } })

    if (existing[0] && members[0]) {
      const { data: locs } = await query.graph({
        entity: "stock_location",
        fields: ["id"],
        filters: { name: `${cfg.name} Warehouse` },
      })
      sellers.push({ key: cfg.key, id: existing[0].id as string, memberId: members[0].id as string, locationId: locs[0].id as string, name: cfg.name })
      continue
    }

    const reg = await authService.register("emailpass", { body: { email: cfg.email, password: SELLER_PASSWORD } })
    const authIdentityId =
      reg.success && reg.authIdentity
        ? reg.authIdentity.id
        : (await authService.listProviderIdentities({ entity_id: cfg.email, provider: "emailpass" }))[0].auth_identity_id!

    const { result: seller } = await createSellerAccountWorkflow(container).run({
      input: {
        auth_identity_id: authIdentityId,
        member_email: cfg.email,
        first_name: cfg.first_name,
        last_name: cfg.last_name,
        seller: {
          name: cfg.name,
          email: cfg.email,
          currency_code: "sgd",
          description: cfg.description,
          logo: `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(cfg.name)}&backgroundColor=013533`,
        },
      },
    })
    await approveSellerWorkflow(container).run({ input: { seller_id: seller.id } })

    const { data: newMembers } = await query.graph({ entity: "member", fields: ["id"], filters: { email: cfg.email } })

    const { result: locations } = await createSellerStockLocationsWorkflow(container).run({
      input: {
        seller_id: seller.id,
        locations: [
          {
            name: `${cfg.name} Warehouse`,
            address: { address_1: cfg.address_1, city: "Singapore", postal_code: cfg.postal_code, country_code: "SG" },
          },
        ],
      },
    })
    const location = locations[0]

    await link.create({
      [Modules.STOCK_LOCATION]: { stock_location_id: location.id },
      [Modules.FULFILLMENT]: { fulfillment_provider_id: "manual_manual" },
    })
    await linkSalesChannelsToStockLocationWorkflow(container).run({ input: { id: location.id, add: [salesChannelId] } })
    await createLocationFulfillmentSetWorkflow(container).run({
      input: { location_id: location.id, fulfillment_set_data: { name: `${cfg.name} delivery`, type: "shipping" } },
    })
    const { data: [withSet] } = await query.graph({
      entity: "stock_location",
      fields: ["id", "fulfillment_sets.id"],
      filters: { id: location.id },
    })
    const { result: zones } = await createServiceZonesWorkflow(container).run({
      input: {
        data: [
          {
            fulfillment_set_id: withSet.fulfillment_sets![0]!.id,
            name: `${cfg.name} Singapore`,
            geo_zones: [{ country_code: "sg", type: "country" as const }],
          },
        ],
      },
    })

    const rules = [
      { attribute: "enabled_in_store", value: "true", operator: "eq" as const },
      { attribute: "is_return", value: "false", operator: "eq" as const },
    ]
    const courseConfirmation = {
      name: "Course confirmation by e-mail",
      price_type: "flat" as const,
      provider_id: "manual_manual",
      service_zone_id: zones[0].id,
      shipping_profile_id: shippingProfileId,
      type: { label: "E-mail", description: "Nothing is delivered. Venue and joining details are e-mailed after you book.", code: "course-email" },
      prices: [{ currency_code: "sgd", amount: 0 }, { region_id: region.id, amount: 0 }],
      rules,
    }
    await createSellerShippingOptionsWorkflow(container).run({
      input: {
        seller_id: seller.id,
        shipping_options: cfg.kind === "training" ? [courseConfirmation] : [
          {
            name: "Standard delivery (1–2 working days)",
            price_type: "flat",
            provider_id: "manual_manual",
            service_zone_id: zones[0].id,
            shipping_profile_id: shippingProfileId,
            type: { label: "Standard", description: "Plain box. Our driver calls 30 minutes before arriving.", code: "standard" },
            prices: [{ currency_code: "sgd", amount: 0 }, { region_id: region.id, amount: 0 }],
            rules,
          },
          {
            name: "Next-day morning delivery (9 am – 1 pm)",
            price_type: "flat",
            provider_id: "manual_manual",
            service_zone_id: zones[0].id,
            shipping_profile_id: shippingProfileId,
            type: { label: "Next day", description: "Order by 4 pm for delivery tomorrow morning.", code: "next-day" },
            prices: [{ currency_code: "sgd", amount: 6 }, { region_id: region.id, amount: 6 }],
            rules,
          },
        ],
      },
    })

    sellers.push({ key: cfg.key, id: seller.id, memberId: newMembers[0].id as string, locationId: location.id, name: cfg.name })
    logger.info(`Created seller "${cfg.name}" with a Singapore location and ${cfg.kind === "training" ? "course confirmation" : "delivery options"}.`)
  }

  const silver = sellers.find((s) => s.key === "silvercircle")!

  /* 5. Products and offers ---------------------------------------------- */
  const { data: existingProducts } = await query.graph({
    entity: "product",
    fields: ["handle"],
    filters: { handle: CATALOGUE.map((p) => p.handle) },
  })
  const have = new Set(existingProducts.map((p) => p.handle))
  const toCreate = CATALOGUE.filter((p) => !have.has(p.handle))

  if (toCreate.length) {
    await createProductsWorkflow(container).run({
      input: {
        created_by: silver.memberId,
        products: toCreate.map((p) => {
          const axes = p.axes ?? []
          const variantOptions = axes.length ? combos(axes) : [{}]
          return {
            title: p.title,
            subtitle: p.subtitle,
            handle: p.handle,
            description: p.description,
            status: ProductStatus.PUBLISHED,
            category_ids: [aisleByHandle.get(p.aisle)!],
            thumbnail: IMG(p.image),
            images: [{ url: IMG(p.image) }],
            material: p.material,
            weight: p.weight,
            attributes: [
              ...axes.map((a) => ({ title: a.title, values: a.values, is_variant_axis: true })),
              ...p.facts.map(([title, value]) => ({ title, value })),
            ],
            variants: variantOptions.map((options) => {
              const label = Object.values(options).join(" / ")
              const skuTail = Object.values(options)
                .map((v) => v.replace(/[^a-z0-9]+/gi, "").toUpperCase())
                .join("-")
              return {
                title: label || "Standard",
                sku: `SC-${p.handle.toUpperCase().replace(/-/g, "").slice(0, 18)}${skuTail ? `-${skuTail}` : ""}`,
                options,
              }
            }),
          }
        }) as never,
      },
    })
    logger.info(`Created ${toCreate.length} care products.`)

    const { data: created } = await query.graph({
      entity: "product",
      fields: ["id", "handle", "variants.id", "variants.sku", "variants.options.value", "variants.options.option.title"],
      filters: { handle: toCreate.map((p) => p.handle) },
    })

    // factor(def) returns the price multiple, or null when this seller doesn't stock it.
    const offersFor = (seller: Seller, factor: (def: CareProduct) => number | null) => {
      const offers: CreateOfferDTO[] = []
      for (const product of created) {
        const def = CATALOGUE.find((c) => c.handle === product.handle)!
        const multiple = factor(def)
        if (multiple === null) continue
        for (const variant of product.variants as { id: string; sku: string; options: { value: string; option: { title: string } }[] }[]) {
          const options = Object.fromEntries((variant.options ?? []).map((o) => [o.option.title, o.value]))
          const amount = Math.round(priceFor(def, options) * multiple * 10) / 10
          const sku = `${seller.key.toUpperCase()}-${variant.sku}`
          offers.push({
            seller_id: seller.id,
            created_by: seller.memberId,
            sku,
            variant_id: variant.id,
            shipping_profile_id: shippingProfileId,
            inventory_items: [{ sku, stock_levels: [{ location_id: seller.locationId, stocked_quantity: 500 }] }],
            prices: [{ amount, currency_code: "sgd" }],
          } as CreateOfferDTO)
        }
      }
      return offers
    }

    // One run per seller: the workflow links all new inventory to the first entry's seller.
    for (const seller of sellers) {
      const offers = offersFor(seller, (def) => {
        if ((def.seller ?? "silvercircle") === seller.key) return 1
        if (seller.key === "careplus") return def.careplus ?? null
        return null
      })
      if (!offers.length) continue
      await createOffersWorkflow(container).run({ input: { offers } })
      logger.info(`Created ${offers.length} offers for ${seller.name}.`)
    }
  } else {
    logger.info("Care products already exist, skipping products and offers.")
  }

  /* 6. "Most reordered" collection --------------------------------------- */
  const { data: collections } = await query.graph({
    entity: "product_collection",
    fields: ["id"],
    filters: { handle: "most-reordered" },
  })
  let collectionId = collections[0]?.id as string | undefined
  if (!collectionId) {
    const { result } = await createCollectionsWorkflow(container).run({
      input: { collections: [{ title: "Most reordered", handle: "most-reordered" }] },
    })
    collectionId = result[0].id
  }
  const { data: featured } = await query.graph({
    entity: "product",
    fields: ["id"],
    filters: { handle: CATALOGUE.filter((p) => p.mostReordered).map((p) => p.handle) },
  })
  await updateProductsWorkflow(container).run({
    input: { selector: { id: featured.map((p) => p.id as string) }, update: { collection_id: collectionId } },
  })

  logger.info("SilverCircle care catalogue is ready.")
}
