UPDATE product SET 
  title = 'Omron HEM-7120 Upper Arm Blood Pressure Monitor',
  handle = 'omron-hem-7120-bp-monitor',
  description = 'Clinically validated automatic upper-arm blood pressure monitor with Intellisense technology.',
  thumbnail = 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&auto=format&fit=crop&q=80'
WHERE id = 'prod_01M6R0J41JXPANAJ6MFWVC5DY4';

UPDATE product SET 
  title = 'Omron MC-720 Infrared Forehead Thermometer',
  handle = 'omron-mc-720-forehead-thermometer',
  description = 'Instant 1-second forehead temperature measurement without skin contact with backlight.',
  thumbnail = 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=600&auto=format&fit=crop&q=80'
WHERE id = 'prod_01M6R0J41JZHC1F6E39RYAMC8A';

UPDATE product SET 
  title = 'Urgo Waterproof Sterile Island Dressing 10x10cm (10s)',
  handle = 'urgo-waterproof-sterile-dressing-10x10',
  description = 'Semi-permeable polyurethane film with absorbent non-stick pad for sterile wound care.',
  thumbnail = 'https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=600&auto=format&fit=crop&q=80'
WHERE id = 'prod_01M6R0J41J6NP7GBW1T797QDE8';

UPDATE product SET 
  title = 'MediShield 3-Ply Surgical Face Mask BFE 99% (50s)',
  handle = 'medishield-3ply-surgical-face-mask-50s',
  description = 'Medical-grade earloop face masks with high filtration efficiency (>99% BFE/PFE).',
  thumbnail = 'https://images.unsplash.com/photo-1586942264404-486055475885?w=600&auto=format&fit=crop&q=80'
WHERE id = 'prod_01M6R0J41J1EV7X4MWQWE8KWCM';

UPDATE product SET 
  title = 'ErgoGrip Adjustable Aluminum Folding Walking Cane',
  handle = 'ergogrip-adjustable-walking-cane',
  description = 'Lightweight anodized aluminum cane with ergonomic handle and non-slip rubber tip.',
  thumbnail = 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=600&auto=format&fit=crop&q=80'
WHERE id = 'prod_01M6R0J41JBHDE0Q6JPKSRVQMB';

UPDATE product SET 
  title = 'Hartmann Peha-Haft Elastic Cohesive Bandage 4m',
  handle = 'hartmann-peha-haft-bandage-4m',
  description = 'Self-adhesive cohesive conforming bandage with double-adhesive effect for joint retention.',
  thumbnail = 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80'
WHERE id = 'prod_01M6R0J41JTF1QJ6TK6J82AKVJ';

UPDATE product SET 
  title = 'Betadine Antiseptic Skin Cleanser 100ml',
  handle = 'betadine-antiseptic-cleanser-100ml',
  description = 'Broad-spectrum antiseptic formula containing povidone-iodine for pre-op skin disinfection.',
  thumbnail = 'https://images.unsplash.com/photo-1584744982491-665216d95f8b?w=600&auto=format&fit=crop&q=80'
WHERE id = 'prod_01M6R0J41J25TGMAD0KKJ75RY2';

UPDATE image i
SET url = p.thumbnail
FROM product p
WHERE i.product_id = p.id;
