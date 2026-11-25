const { Client } = require('d:/mercur-marketplace/vertis-marketplace/node_modules/pg');

const client = new Client({
  connectionString: 'postgres://postgres:postgres@localhost:5432/mercur',
});

async function main() {
  await client.connect();
  console.log('Connected to Postgres.');

  const prodId = 'prod_catheters_01';
  const handle = 'intermittent-catheters';
  const title = 'Intermittent Catheters';
  const description =
    'Single-use sterile intermittent catheters with a smooth hydrophilic coating — ready to use straight from the pouch with no extra water needed. Delivered in a plain, unmarked box.';
  const thumbnail =
    'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=600&auto=format&fit=crop&q=80';

  // 1. Product
  await client.query(
    `INSERT INTO product (id, title, handle, description, status, thumbnail, discountable, created_at, updated_at)
     VALUES ($1, $2, $3, $4, 'published', $5, true, NOW(), NOW())
     ON CONFLICT (id) DO UPDATE SET title = $2, handle = $3, description = $4, status = 'published', thumbnail = $5`,
    [prodId, title, handle, description, thumbnail]
  );

  // 2. Product image
  await client.query(
    `INSERT INTO image (id, url, rank, product_id, created_at, updated_at)
     VALUES ('img_catheters_01', $1, 0, $2, NOW(), NOW())
     ON CONFLICT (id) DO UPDATE SET url = $1`,
    [thumbnail, prodId]
  );

  // 3. Link to Incontinence Care category + Sales Channel + Shipping Profile
  await client.query(
    `INSERT INTO product_category_product (product_id, product_category_id)
     VALUES ($1, 'pcat_01M6R0J35G136PZGDM26E0WHZ4') ON CONFLICT DO NOTHING`,
    [prodId]
  );
  await client.query(
    `INSERT INTO product_sales_channel (id, product_id, sales_channel_id, created_at, updated_at)
     VALUES ('psc_catheters_01', $1, 'sc_01M6R0J2SYV7GYPYNC4VMDQSEF', NOW(), NOW())
     ON CONFLICT (product_id, sales_channel_id) DO NOTHING`,
    [prodId]
  );
  await client.query(
    `INSERT INTO product_shipping_profile (id, product_id, shipping_profile_id, created_at, updated_at)
     VALUES ('psp_catheters_01', $1, 'sp_01M6R0J38GW4803933JY7TM440', NOW(), NOW())
     ON CONFLICT (product_id, shipping_profile_id) DO NOTHING`,
    [prodId]
  );

  // 4. Options: Box size & Size
  const optBoxId = 'opt_catheters_box';
  const optSizeId = 'opt_catheters_size';

  await client.query(
    `INSERT INTO product_option (id, title, created_at, updated_at)
     VALUES ($1, 'Box size', NOW(), NOW())
     ON CONFLICT (id) DO UPDATE SET title = 'Box size'`,
    [optBoxId]
  );
  await client.query(
    `INSERT INTO product_option (id, title, created_at, updated_at)
     VALUES ($1, 'Size', NOW(), NOW())
     ON CONFLICT (id) DO UPDATE SET title = 'Size'`,
    [optSizeId]
  );
  await client.query(
    `INSERT INTO product_product_option (id, product_id, product_option_id, created_at, updated_at)
     VALUES ('ppo_catheters_box', $1, $2, NOW(), NOW()), ('ppo_catheters_size', $1, $3, NOW(), NOW())
     ON CONFLICT (id) DO NOTHING`,
    [prodId, optBoxId, optSizeId]
  );

  const boxValues = [
    { id: 'pov_cat_box30', value: 'Box of 30', price: 54 },
    { id: 'pov_cat_box60', value: 'Box of 60', price: 98 },
  ];
  const sizeValues = [
    { id: 'pov_cat_ch10', value: 'CH10' },
    { id: 'pov_cat_ch12', value: 'CH12' },
    { id: 'pov_cat_ch14', value: 'CH14' },
    { id: 'pov_cat_ch16', value: 'CH16' },
  ];

  for (const bv of boxValues) {
    await client.query(
      `INSERT INTO product_option_value (id, value, option_id, created_at, updated_at)
       VALUES ($1, $2, $3, NOW(), NOW())
       ON CONFLICT (id) DO UPDATE SET value = $2`,
      [bv.id, bv.value, optBoxId]
    );
  }
  for (const sv of sizeValues) {
    await client.query(
      `INSERT INTO product_option_value (id, value, option_id, created_at, updated_at)
       VALUES ($1, $2, $3, NOW(), NOW())
       ON CONFLICT (id) DO UPDATE SET value = $2`,
      [sv.id, sv.value, optSizeId]
    );
  }

  // 5. Sellers
  const seller1 = 'sel_01M6R0J3AKJAM6VTA8VYNBCM7Z'; // TENA Singapore
  const seller2 = 'sel_01M6R0J3WWWHWK939D9T26K9F9'; // Omron Healthcare SG
  await client.query(
    `INSERT INTO product_seller (id, product_id, seller_id, created_at, updated_at)
     VALUES ('psel_catheters_1', $1, $2, NOW(), NOW())
     ON CONFLICT (product_id, seller_id) DO NOTHING`,
    [prodId, seller1]
  );

  // 6. Create 8 variants + price sets + option links + 2 seller offers each
  const spId = 'sp_01M6R0J38GW4803933JY7TM440';
  for (const sv of sizeValues) {
    for (const bv of boxValues) {
      const slug = `${sv.value.toLowerCase()}_${bv.value.toLowerCase().replace(/\s+/g, '')}`;
      const varId = `var_cat_${slug}`;
      const psId = `pset_cat_${slug}`;
      const sku = `SILVERCIRCLE-CATH-${sv.value}-${bv.value === 'Box of 30' ? '30' : '60'}`;

      await client.query(
        `INSERT INTO product_variant (id, product_id, title, sku, manage_inventory, allow_backorder, created_at, updated_at)
         VALUES ($1, $2, $3, $4, false, true, NOW(), NOW())
         ON CONFLICT (id) DO UPDATE SET title = $3, sku = $4`,
        [varId, prodId, `${sv.value} / ${bv.value}`, sku]
      );

      // Link variant to Box size and Size option values
      await client.query(
        `INSERT INTO product_variant_option (variant_id, option_value_id)
         VALUES ($1, $2) ON CONFLICT DO NOTHING`,
        [varId, bv.id]
      );
      await client.query(
        `INSERT INTO product_variant_option (variant_id, option_value_id)
         VALUES ($1, $2) ON CONFLICT DO NOTHING`,
        [varId, sv.id]
      );

      // Price set & EUR/USD prices
      await client.query(
        `INSERT INTO price_set (id, created_at, updated_at)
         VALUES ($1, NOW(), NOW()) ON CONFLICT (id) DO NOTHING`,
        [psId]
      );
      await client.query(
        `INSERT INTO product_variant_price_set (id, variant_id, price_set_id, created_at, updated_at)
         VALUES ($1, $2, $3, NOW(), NOW())
         ON CONFLICT (variant_id, price_set_id) DO NOTHING`,
        [`pvps_cat_${slug}`, varId, psId]
      );

      const rawEur = JSON.stringify({ value: String(bv.price), precision: 20 });
      const rawUsd = JSON.stringify({ value: String(Math.round(bv.price * 1.08)), precision: 20 });

      await client.query(
        `INSERT INTO price (id, price_set_id, currency_code, amount, raw_amount, rules_count, created_at, updated_at)
         VALUES ($1, $2, 'eur', $3, $4::jsonb, 0, NOW(), NOW())
         ON CONFLICT (id) DO UPDATE SET amount = $3, raw_amount = $4::jsonb`,
        [`price_cat_${slug}_eur`, psId, bv.price, rawEur]
      );
      await client.query(
        `INSERT INTO price (id, price_set_id, currency_code, amount, raw_amount, rules_count, created_at, updated_at)
         VALUES ($1, $2, 'usd', $3, $4::jsonb, 0, NOW(), NOW())
         ON CONFLICT (id) DO UPDATE SET amount = $3, raw_amount = $4::jsonb`,
        [`price_cat_${slug}_usd`, psId, Math.round(bv.price * 1.08), rawUsd]
      );

      // Offers from 2 sellers
      for (const [idx, sId] of [seller1, seller2].entries()) {
        const offerId = `offer_cat_${slug}_s${idx + 1}`;
        await client.query(
          `INSERT INTO offer (id, seller_id, variant_id, product_id, shipping_profile_id, sku, created_by, manage_inventory, allow_backorder, created_at, updated_at)
           VALUES ($1, $2, $3, $4, $5, $6, 'mem_01M6R0J3X54XTXRRA8D85WSY9T', false, true, NOW(), NOW())
           ON CONFLICT (id) DO UPDATE SET seller_id = $2, product_id = $4`,
          [offerId, sId, varId, prodId, spId, `${sku}-S${idx + 1}`]
        );
        await client.query(
          `INSERT INTO offer_seller (id, offer_id, seller_id, created_at, updated_at)
           VALUES ($1, $2, $3, NOW(), NOW())
           ON CONFLICT (offer_id, seller_id) DO NOTHING`,
          [`os_cat_${slug}_s${idx + 1}`, offerId, sId]
        );
      }
    }
  }

  console.log('Seeded Intermittent Catheters with 2 options (Box size, Size), 8 variants, and 2 sellers!');
  await client.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
