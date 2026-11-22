-- 1. Update Sellers to Singapore Healthcare Brands
UPDATE seller 
SET name = 'TENA Singapore', handle = 'tena-singapore', description = 'Official flagship store for TENA adult care and hygiene products in Singapore.'
WHERE handle = 'sole-society';

UPDATE seller 
SET name = 'Abbott Nutrition SG', handle = 'abbott-nutrition-sg', description = 'Official distributor of Ensure, Glucerna, and clinical medical nutrition in Singapore.'
WHERE handle = 'kickz-corner';

UPDATE seller 
SET name = 'Omron Healthcare SG', handle = 'omron-healthcare-sg', description = 'Official provider of Omron digital blood pressure monitors, nebulizers, and health devices.'
WHERE handle = 'trailhead-outfitters';

-- 2. Update Categories to Healthcare / SMF Categories
UPDATE product_category SET name = 'Incontinence Care', handle = 'incontinence-care' WHERE handle = 'sandals';
UPDATE product_category SET name = 'Medical Nutrition', handle = 'medical-nutrition' WHERE handle = 'sneakers';
UPDATE product_category SET name = 'Medical Devices', handle = 'medical-devices' WHERE handle = 'boots';
UPDATE product_category SET name = 'Wound & Skin Care', handle = 'wound-skin-care' WHERE handle = 'sport';
UPDATE product_category SET name = 'Daily Living Aids', handle = 'daily-living-aids' WHERE handle = 'accessories';

UPDATE product_category SET name = 'Adult Diapers & Pants', handle = 'adult-diapers-pants' WHERE handle = 'slides';
UPDATE product_category SET name = 'Underpads & Liners', handle = 'underpads-liners' WHERE handle = 'flip-flops';
UPDATE product_category SET name = 'Wipes & Hygiene Care', handle = 'wipes-hygiene' WHERE handle = 'clogs';
UPDATE product_category SET name = 'Oral Nutrition Supplements', handle = 'oral-nutrition' WHERE handle = 'high-top';
UPDATE product_category SET name = 'Diabetic & Renal Formulas', handle = 'diabetic-renal' WHERE handle = 'retro';
UPDATE product_category SET name = 'Blood Pressure Monitors', handle = 'bp-monitors' WHERE handle = 'chelsea-boots';
UPDATE product_category SET name = 'Digital Thermometers', handle = 'thermometers' WHERE handle = 'winter-boots';
UPDATE product_category SET name = 'Nebulizers & Respiratory', handle = 'respiratory' WHERE handle = 'work-boots';
UPDATE product_category SET name = 'Sterile Dressings', handle = 'sterile-dressings' WHERE handle = 'football';
UPDATE product_category SET name = 'Bandages & Gauze', handle = 'bandages-gauze' WHERE handle = 'running';
UPDATE product_category SET name = 'Antiseptics & Cleansers', handle = 'antiseptics' WHERE handle = 'basketball';
UPDATE product_category SET name = 'Mobility & Walking Canes', handle = 'walking-canes' WHERE handle = 'bags';
UPDATE product_category SET name = 'Personal Care Accessories', handle = 'personal-care' WHERE handle = 'headwear';
UPDATE product_category SET name = 'Pill Organizers & Dispensers', handle = 'pill-organizers' WHERE handle = 'wallets';
UPDATE product_category SET name = 'Tube Feeding Feeds', handle = 'tube-feeding' WHERE handle = 'low-top';

-- 3. Update Specific Key Products to Realistic Singapore Healthcare Products with Real Images
-- Product 1: TENA Pants
UPDATE product SET 
  title = 'TENA ProSkin Adult Pants Normal (M/L) 10s',
  handle = 'tena-proskin-adult-pants-normal',
  description = 'TENA ProSkin Pants are soft and comfortable incontinence pants designed for women and men. Features FeelDry Advanced technology for fast absorption and dermatologically tested skin health.',
  thumbnail = 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80'
WHERE id = 'prod_01M6R0J41JCHPVW9M5JEQRADZC';

-- Product 2: TENA Diapers Maxi
UPDATE product SET 
  title = 'TENA ProSkin Slip Maxi Adult Diapers (L) 24s',
  handle = 'tena-proskin-slip-maxi-l',
  description = 'Open incontinence diaper with adjustable tabs for perfect fit, comfort and leakage protection. High absorption capacity for overnight care.',
  thumbnail = 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=600&auto=format&fit=crop&q=80'
WHERE id = 'prod_01M6R0J41JJKTCY3QV5WFDVYVH';

-- Product 3: TENA Wipes
UPDATE product SET 
  title = 'TENA Wet Wipes Antibacterial 48s',
  handle = 'tena-wet-wipes-antibacterial',
  description = 'Pre-moistened, extra soft and thick cleansing wipes. Gentle formula enriched with chamomile and vitamin E, ideal for daily personal and caregiver hygiene.',
  thumbnail = 'https://images.unsplash.com/photo-1584744982491-665216d95f8b?w=600&auto=format&fit=crop&q=80'
WHERE id = 'prod_01M6R0J41JF5P31Y3GX6VK8FK3';

-- Product 4: Ensure Life
UPDATE product SET 
  title = 'Ensure Life 2.4kcal Nutritional Drink Vanilla 220ml (Pack of 4)',
  handle = 'ensure-life-2-4kcal-vanilla-220ml',
  description = 'High-calorie oral nutritional supplement with HMB, prebiotic FOS, and 28 essential vitamins and minerals to support muscle tissue building and recovery.',
  thumbnail = 'https://images.unsplash.com/photo-1550572017-edd951aa8f72?w=600&auto=format&fit=crop&q=80'
WHERE id = 'prod_01M6R0J41JGSRC68S55XSMBKTT';

-- Product 5: Glucerna
UPDATE product SET 
  title = 'Glucerna Triple Care Powder Vanilla 850g',
  handle = 'glucerna-triple-care-vanilla-850g',
  description = 'Scientifically formulated for people with diabetes. Advanced slow-release carbohydrate system to help manage glucose response and maintain cardiovascular health.',
  thumbnail = 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80'
WHERE id = 'prod_01M6R0J41JV5J5PAYJ9PME9ZTH';

-- Product 6: Omron Blood Pressure Monitor
UPDATE product SET 
  title = 'Omron HEM-7120 Arm Blood Pressure Monitor',
  handle = 'omron-hem-7120-bp-monitor',
  description = 'Clinically validated automatic upper-arm blood pressure monitor. Features Intellisense technology for comfortable and accurate inflation, hypertension indicator, and body movement detection.',
  thumbnail = 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&auto=format&fit=crop&q=80'
WHERE id = 'prod_01M6R0J41JA0XW3C46G51Y0667';

-- Product 7: Omron Thermometer
UPDATE product SET 
  title = 'Omron MC-720 Non-Contact Infrared Forehead Thermometer',
  handle = 'omron-mc-720-forehead-thermometer',
  description = 'Instant 1-second forehead temperature measurement without skin contact. 3-in-1 measurement modes for forehead, surface, and room temperature with silent backlight.',
  thumbnail = 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=600&auto=format&fit=crop&q=80'
WHERE id = 'prod_01M6R0J41JDV6R91739WCG130N';

-- Product 8: Wound Dressing
UPDATE product SET 
  title = 'Urgo Waterproof Sterile Island Dressing 10x10cm (Box of 10)',
  handle = 'urgo-waterproof-sterile-dressing-10x10',
  description = 'Semi-permeable polyurethane film with absorbent non-stick pad. Provides microbial barrier while allowing skin breathing and showering during post-op recovery.',
  thumbnail = 'https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=600&auto=format&fit=crop&q=80'
WHERE id = 'prod_01M6R0J41J0P82P44J8509Z56X';

-- Product 9: Surgical Face Mask
UPDATE product SET 
  title = 'MediShield 3-Ply Surgical Face Mask BFE 99% (Box of 50s)',
  handle = 'medishield-3ply-surgical-face-mask-50s',
  description = 'Medical-grade earloop face masks with high filtration efficiency (>99% BFE/PFE). Hypoallergenic inner layer for sensitive skin.',
  thumbnail = 'https://images.unsplash.com/photo-1586942264404-486055475885?w=600&auto=format&fit=crop&q=80'
WHERE id = 'prod_01M6R0J41JFTK011F9E3P95111';

-- Product 10: Walking Cane
UPDATE product SET 
  title = 'ErgoGrip Adjustable Aluminum Folding Walking Cane',
  handle = 'ergogrip-adjustable-walking-cane',
  description = 'Lightweight anodized aluminum cane with ergonomic shock-absorbing handle. Folds easily into 4 sections with non-slip rubber tip for elder stability.',
  thumbnail = 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=600&auto=format&fit=crop&q=80'
WHERE id = 'prod_01M6R0J41JQ2094D2P4J1R5Y69';

-- Update all remaining footwear titles to Healthcare/Medical Consumables
UPDATE product SET title = REPLACE(title, 'Meridian', 'CarePro') WHERE title LIKE '%Meridian%';
UPDATE product SET title = REPLACE(title, 'Cloudpeak', 'MediPlus') WHERE title LIKE '%Cloudpeak%';
UPDATE product SET title = REPLACE(title, 'Veloce', 'HealthGuard') WHERE title LIKE '%Veloce%';
UPDATE product SET title = REPLACE(title, 'Stride', 'VitalCare') WHERE title LIKE '%Stride%';
UPDATE product SET title = REPLACE(title, 'Sandal', 'Care Kit') WHERE title LIKE '%Sandal%';
UPDATE product SET title = REPLACE(title, 'Slide', 'Support Pack') WHERE title LIKE '%Slide%';
UPDATE product SET title = REPLACE(title, 'Sneaker', 'Nutrition Pack') WHERE title LIKE '%Sneaker%';
UPDATE product SET title = REPLACE(title, 'Boot', 'Medical Device') WHERE title LIKE '%Boot%';
UPDATE product SET title = REPLACE(title, 'Clog', 'Sanitizer Pack') WHERE title LIKE '%Clog%';

-- Also update image table URLs to match product thumbnails
UPDATE image i
SET url = p.thumbnail
FROM product p
WHERE i.product_id = p.id;
