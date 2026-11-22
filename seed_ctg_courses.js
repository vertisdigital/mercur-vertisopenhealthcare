const { Client } = require('d:/mercur-marketplace/vertis-marketplace/node_modules/pg');

const client = new Client({
  connectionString: 'postgres://postgres:postgres@localhost:5432/mercur'
});

async function main() {
  await client.connect();
  console.log('Connected to Postgres.');

  // 1. Create Sellers (Training Providers)
  const sellers = [
    {
      id: 'sel_peacehaven_01',
      name: 'The Salvation Army Peacehaven',
      handle: 'peacehaven-nursing-home',
      email: 'peacehaven@salvationarmy.org.sg',
      description: 'Accredited AIC Training Provider specialising in Dementia and Nursing Care.',
    },
    {
      id: 'sel_hnf_02',
      name: 'Home Nursing Foundation SG',
      handle: 'home-nursing-foundation-sg',
      email: 'enquiry@hnf.org.sg',
      description: 'Singapore leading home healthcare organisation providing caregiver mental health and clinical skills.',
    },
    {
      id: 'sel_hca_03',
      name: 'HCA Hospice Care SG',
      handle: 'hca-hospice-care-sg',
      email: 'contact@hca.org.sg',
      description: 'Largest home hospice care provider in Singapore empowering palliative caregivers.',
    },
    {
      id: 'sel_econ_04',
      name: 'Econ Careskill Training Centre',
      handle: 'econ-careskill-training-centre',
      email: 'training@econholdings.com',
      description: 'Premier eldercare training facility for domestic workers and family caregivers.',
    },
  ];

  for (const s of sellers) {
    await client.query(`
      INSERT INTO seller (id, name, handle, email, currency_code, description, status, created_at, updated_at)
      VALUES ($1, $2, $3, $4, 'eur', $5, 'open', NOW(), NOW())
      ON CONFLICT (id) DO UPDATE SET name = $2, handle = $3, email = $4, currency_code = 'eur', description = $5, status = 'open'
    `, [s.id, s.name, s.handle, s.email, s.description]);
    console.log(`Seller ready: ${s.name}`);
  }

  // 2. Create Categories
  const parentCatId = 'pcat_ctg_parent_01';
  await client.query(`
    INSERT INTO product_category (id, name, handle, mpath, is_active, is_internal, rank, parent_category_id, created_at, updated_at)
    VALUES ($1, 'Caregivers Training (CTG)', 'caregivers-training-ctg', $1, true, false, 5, NULL, NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET name = 'Caregivers Training (CTG)', handle = 'caregivers-training-ctg', is_active = true
  `, [parentCatId]);

  const subcategories = [
    { id: 'pcat_ctg_sub_01', name: 'Dementia & Cognitive Care', handle: 'dementia-cognitive-care' },
    { id: 'pcat_ctg_sub_02', name: 'Wound & Palliative Nursing', handle: 'wound-palliative-nursing' },
    { id: 'pcat_ctg_sub_03', name: 'Activities of Daily Living (ADL)', handle: 'activities-of-daily-living' },
    { id: 'pcat_ctg_sub_04', name: 'Psychosocial & Resilient Caregiver', handle: 'psychosocial-resilient-caregiver' },
  ];

  for (const sub of subcategories) {
    await client.query(`
      INSERT INTO product_category (id, name, handle, mpath, is_active, is_internal, rank, parent_category_id, created_at, updated_at)
      VALUES ($1, $2, $3, $4, true, false, 1, $5, NOW(), NOW())
      ON CONFLICT (id) DO UPDATE SET name = $2, handle = $3, parent_category_id = $5, is_active = true
    `, [sub.id, sub.name, sub.handle, `${parentCatId}.${sub.id}`, parentCatId]);
    console.log(`Subcategory ready: ${sub.name}`);
  }

  // 3. Courses to Insert
  const courses = [
    {
      id: 'prod_ctg_01',
      title: "A Caregiver's Guide to Basic Wound Management",
      handle: 'basic-wound-management-caregiver',
      seller_id: 'sel_peacehaven_01',
      category_id: 'pcat_ctg_sub_02',
      price: 200,
      thumbnail: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=600&q=80',
      description: 'Accredited AIC course covering skin and wound assessment, stages of wound healing, and sterile basic wound dressing procedures. Subsidised under CTG and SkillsFuture.',
      mode: 'Classroom (In-person)',
      duration: '3 Hours',
    },
    {
      id: 'prod_ctg_02',
      title: "A Caregiver's Guide to Dementia Care",
      handle: 'caregivers-guide-to-dementia',
      seller_id: 'sel_peacehaven_01',
      category_id: 'pcat_ctg_sub_01',
      price: 250,
      thumbnail: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=600&q=80',
      description: 'Understanding signs of dementia, person-centred communication, and managing challenging behaviours with non-pharmacological techniques.',
      mode: 'Classroom (In-person)',
      duration: '8 Hours',
    },
    {
      id: 'prod_ctg_03',
      title: "A Caregiver's Guide to the Palliative Care Approach",
      handle: 'caregivers-guide-palliative-care',
      seller_id: 'sel_peacehaven_01',
      category_id: 'pcat_ctg_sub_02',
      price: 250,
      thumbnail: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=600&q=80',
      description: 'Essentials of palliative care, comfort management, communicating about end-of-life needs, and building resilient caregiving mindset.',
      mode: 'Classroom (In-person)',
      duration: '8 Hours',
    },
    {
      id: 'prod_ctg_04',
      title: 'Family Caregivers Toolkit: Dementia Literacy & Social Inclusion',
      handle: 'family-caregivers-dementia-literacy',
      seller_id: 'sel_peacehaven_01',
      category_id: 'pcat_ctg_sub_01',
      price: 300,
      thumbnail: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=600&q=80',
      description: 'Equips family members to create a dementia-friendly home environment, assisting loved ones while fostering independence and community integration.',
      mode: 'Classroom (In-person)',
      duration: '8 Hours',
    },
    {
      id: 'prod_ctg_05',
      title: 'Building Resilient Caregivers: Psychosocial Skills & Mental Health (Online)',
      handle: 'building-resilient-caregivers-online',
      seller_id: 'sel_hnf_02',
      category_id: 'pcat_ctg_sub_04',
      price: 70,
      thumbnail: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
      description: 'Virtual interactive course covering caregiver burnout management, emotional wellness, financial subsidy navigation, and communication strategies.',
      mode: 'Virtual (Online Zoom)',
      duration: '6 Hours',
    },
    {
      id: 'prod_ctg_06',
      title: 'Assistance in Activities of Daily Living (ADLs) for Elderly',
      handle: 'assistance-adls-elderly',
      seller_id: 'sel_econ_04',
      category_id: 'pcat_ctg_sub_03',
      price: 150,
      thumbnail: 'https://images.unsplash.com/photo-1581056771107-24ca5f033842?auto=format&fit=crop&w=600&q=80',
      description: 'Hands-on training for showering, personal hygiene, feeding, dressing, and assisting seniors with limited mobility in home settings.',
      mode: 'Classroom (In-person)',
      duration: '4 Hours',
    },
    {
      id: 'prod_ctg_07',
      title: 'Safe Transfer & Mobility Techniques for Wheelchair Caregivers',
      handle: 'safe-transfer-mobility-techniques',
      seller_id: 'sel_econ_04',
      category_id: 'pcat_ctg_sub_03',
      price: 130,
      thumbnail: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=600&q=80',
      description: 'Ergonomic lifting techniques, bed-to-wheelchair transfers, commode transfers, and fall prevention strategies to protect both caregiver and senior.',
      mode: 'Classroom (In-person)',
      duration: '4 Hours',
    },
    {
      id: 'prod_ctg_08',
      title: 'Palliative Care & Comfort Strategies at Home',
      handle: 'palliative-care-comfort-strategies',
      seller_id: 'sel_hca_03',
      category_id: 'pcat_ctg_sub_02',
      price: 180,
      thumbnail: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&w=600&q=80',
      description: 'Specialised guidance on pain symptom monitoring, compassionate communication, mouth care, and emotional coping for advanced illness care.',
      mode: 'Classroom (In-person)',
      duration: '6 Hours',
    },
    {
      id: 'prod_ctg_09',
      title: 'Managing Challenging Behaviours in Moderate to Severe Dementia',
      handle: 'managing-challenging-behaviours-dementia',
      seller_id: 'sel_peacehaven_01',
      category_id: 'pcat_ctg_sub_01',
      price: 220,
      thumbnail: 'https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&w=600&q=80',
      description: 'De-escalation methods, handling sundowning, wandering, agitation, and non-verbal expression cues in senior dementia care.',
      mode: 'Classroom (In-person)',
      duration: '6 Hours',
    },
    {
      id: 'prod_ctg_10',
      title: 'Caregiver Stress Management & Self-Care Workshop (Virtual)',
      handle: 'caregiver-stress-management-self-care',
      seller_id: 'sel_hnf_02',
      category_id: 'pcat_ctg_sub_04',
      price: 85,
      thumbnail: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=600&q=80',
      description: 'Peer sharing and evidence-based mindfulness strategies for long-term caregivers balancing employment, family, and eldercare responsibilities.',
      mode: 'Virtual (Online Zoom)',
      duration: '4 Hours',
    },
    {
      id: 'prod_ctg_11',
      title: 'Tube Feeding & Swallowing Difficulties (Dysphagia) Care at Home',
      handle: 'tube-feeding-dysphagia-care',
      seller_id: 'sel_hnf_02',
      category_id: 'pcat_ctg_sub_02',
      price: 190,
      thumbnail: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=600&q=80',
      description: 'Safe nasogastric (NG) tube flush procedures, formula preparation, head posture techniques during feeding, and preventing aspiration pneumonia.',
      mode: 'Classroom (In-person)',
      duration: '5 Hours',
    },
    {
      id: 'prod_ctg_12',
      title: 'Basic Elderly First Aid & Emergency Response for Domestic Workers',
      handle: 'basic-elderly-first-aid-domestic-workers',
      seller_id: 'sel_peacehaven_01',
      category_id: 'pcat_ctg_sub_03',
      price: 160,
      thumbnail: 'https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?auto=format&fit=crop&w=600&q=80',
      description: 'Choking response (Heimlich manoeuvre), fall assessment, burn treatment, and calling 995 emergency protocols tailored for domestic caregivers.',
      mode: 'Classroom (In-person)',
      duration: '4 Hours',
    },
  ];

  const spRes = await client.query('SELECT id FROM shipping_profile LIMIT 1');
  const spId = spRes.rows[0]?.id || 'sp_default';

  for (const c of courses) {
    // 1. Insert product
    await client.query(`
      INSERT INTO product (id, title, handle, description, status, thumbnail, discountable, created_at, updated_at)
      VALUES ($1, $2, $3, $4, 'published', $5, true, NOW(), NOW())
      ON CONFLICT (id) DO UPDATE SET title = $2, handle = $3, description = $4, status = 'published', thumbnail = $5
    `, [c.id, c.title, c.handle, c.description, c.thumbnail]);

    // 2. Insert variant
    const varId = `var_${c.id}`;
    await client.query(`
      INSERT INTO product_variant (id, product_id, title, sku, manage_inventory, allow_backorder, created_at, updated_at)
      VALUES ($1, $2, $3, $4, false, true, NOW(), NOW())
      ON CONFLICT (id) DO UPDATE SET title = $3, sku = $4
    `, [varId, c.id, `${c.mode} - ${c.duration}`, `SKU-${c.id.toUpperCase()}`]);

    // 3. Insert price_set
    const psId = `pset_${c.id}`;
    await client.query(`
      INSERT INTO price_set (id, created_at, updated_at)
      VALUES ($1, NOW(), NOW())
      ON CONFLICT (id) DO NOTHING
    `, [psId]);

    // 4. Link variant to price_set
    const pvpsId = `pvps_${c.id}`;
    await client.query(`
      INSERT INTO product_variant_price_set (id, variant_id, price_set_id, created_at, updated_at)
      VALUES ($1, $2, $3, NOW(), NOW())
      ON CONFLICT (variant_id, price_set_id) DO NOTHING
    `, [pvpsId, varId, psId]);

    // 5. Insert prices (EUR and USD)
    const priceIdEur = `price_${c.id}_eur`;
    const priceIdUsd = `price_${c.id}_usd`;
    const rawEur = JSON.stringify({ value: String(c.price), precision: 20 });
    const rawUsd = JSON.stringify({ value: String(Math.round(c.price * 1.08)), precision: 20 });

    await client.query(`
      INSERT INTO price (id, price_set_id, currency_code, amount, raw_amount, rules_count, created_at, updated_at)
      VALUES ($1, $2, 'eur', $3, $4::jsonb, 0, NOW(), NOW())
      ON CONFLICT (id) DO UPDATE SET amount = $3, raw_amount = $4::jsonb
    `, [priceIdEur, psId, c.price, rawEur]);

    await client.query(`
      INSERT INTO price (id, price_set_id, currency_code, amount, raw_amount, rules_count, created_at, updated_at)
      VALUES ($1, $2, 'usd', $3, $4::jsonb, 0, NOW(), NOW())
      ON CONFLICT (id) DO UPDATE SET amount = $3, raw_amount = $4::jsonb
    `, [priceIdUsd, psId, Math.round(c.price * 1.08), rawUsd]);

    // 6. Link to Parent category AND Subcategory
    await client.query(`
      INSERT INTO product_category_product (product_id, product_category_id)
      VALUES ($1, $2) ON CONFLICT (product_id, product_category_id) DO NOTHING
    `, [c.id, parentCatId]);

    await client.query(`
      INSERT INTO product_category_product (product_id, product_category_id)
      VALUES ($1, $2) ON CONFLICT (product_id, product_category_id) DO NOTHING
    `, [c.id, c.category_id]);

    // 7. Link to Seller
    const pselId = `psel_${c.id}`;
    await client.query(`
      INSERT INTO product_seller (id, product_id, seller_id, created_at, updated_at)
      VALUES ($1, $2, $3, NOW(), NOW())
      ON CONFLICT (product_id, seller_id) DO NOTHING
    `, [pselId, c.id, c.seller_id]);

    // 8. Create Offer
    const offerId = `offer_${c.id}`;
    await client.query(`
      INSERT INTO offer (id, seller_id, variant_id, product_id, shipping_profile_id, sku, created_by, manage_inventory, allow_backorder, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, 'mem_01M6R0J3X54XTXRRA8D85WSY9T', false, true, NOW(), NOW())
      ON CONFLICT (id) DO UPDATE SET seller_id = $2, product_id = $4
    `, [offerId, c.seller_id, varId, c.id, spId, `OFFER-${c.id.toUpperCase()}`]);

    await client.query(`
      INSERT INTO offer_seller (id, offer_id, seller_id, created_at, updated_at)
      VALUES ($1, $2, $3, NOW(), NOW())
      ON CONFLICT (offer_id, seller_id) DO NOTHING
    `, [`os_${c.id}`, offerId, c.seller_id]);

    console.log(`Course [${c.title}] seeded successfully.`);
  }

  const finalProds = await client.query('SELECT count(*) FROM product');
  console.log(`\nDONE! Total products now in database: ${finalProds.rows[0].count}`);

  await client.end();
}

main().catch(console.error);
