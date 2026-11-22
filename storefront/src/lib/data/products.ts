'use server';

import { HttpTypes } from '@medusajs/types';

import { sortProducts } from '@/lib/helpers/sort-products';
import { SortOptions } from '@/types/product';
import { SellerProps } from '@/types/seller';

import { sdk } from '../config';
import { getAuthHeaders } from './cookies';
import { retrieveCustomer } from './customer';
import { getRegion, retrieveRegion } from './regions';

export const listProducts = async ({
  pageParam = 1,
  queryParams,
  countryCode,
  regionId,
  category_id,
  collection_id,
  forceCache = false
}: {
  pageParam?: number;
  queryParams?: HttpTypes.FindParams &
    HttpTypes.StoreProductParams & {
      handle?: string[];
    };
  category_id?: string | string[];
  collection_id?: string;
  countryCode?: string;
  regionId?: string;
  forceCache?: boolean;
}): Promise<{
  response: {
    products: (HttpTypes.StoreProduct & { seller?: SellerProps })[];
    count: number;
  };
  nextPage: number | null;
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductParams;
}> => {
  if (!countryCode && !regionId) {
    throw new Error('Country code or region ID is required');
  }

  const limit = queryParams?.limit || 12;
  const _pageParam = Math.max(pageParam, 1);
  const offset = (_pageParam - 1) * limit;

  let region: HttpTypes.StoreRegion | undefined | null;

  if (countryCode) {
    region = await getRegion(countryCode);
  } else {
    region = await retrieveRegion(regionId!);
  }

  if (!region) {
    return {
      response: { products: [], count: 0 },
      nextPage: null
    };
  }

  const headers = {
    ...(await getAuthHeaders())
  };

  const useCached = forceCache || (limit <= 8 && !category_id && !collection_id);

  return sdk.client
    .fetch<{
      products: (HttpTypes.StoreProduct & { seller?: SellerProps })[];
      count: number;
    }>(`/store/products`, {
      method: 'GET',
      query: {
        category_id,
        collection_id,
        limit,
        offset,
        region_id: region?.id,
        fields:
          '*variants.calculated_price,+variants.inventory_quantity,*seller,*variants,*seller.products,' +
          '*seller.reviews,*seller.reviews.customer,*seller.reviews.seller,*seller.products.variants,*attribute_values,*attribute_values.attribute',
        ...queryParams
      },
      headers,
      next: useCached ? { revalidate: 60 } : undefined,
      cache: useCached ? 'force-cache' : 'no-cache'
    })
    .then(({ products: productsRaw, count }) => {
      const products = (productsRaw || []).filter(product => !product.seller || product.seller.store_status !== 'SUSPENDED');

      const nextPage = count > offset + limit ? pageParam + 1 : null;

      const response = products.map(prod => {
        if (prod.seller) {
          // @ts-ignore Property 'seller' exists but TypeScript doesn't recognize it
          const reviews = prod.seller?.reviews?.filter(item => !!item) ?? [];
          return {
            ...prod,
            seller: {
              // @ts-ignore Property 'seller' exists but TypeScript doesn't recognize it
              ...prod.seller,
              reviews
            }
          };
        }
        return prod;
      });

      return {
        response: {
          products: response,
          count
        },
        nextPage: nextPage,
        queryParams
      };
    })
    .catch(() => {
      return {
        response: {
          products: [],
          count: 0
        },
        nextPage: 0,
        queryParams
      };
    });
};

/**
 * This will fetch 100 products to the Next.js cache and sort them based on the sortBy parameter.
 * It will then return the paginated products based on the page and limit parameters.
 */
const PRODUCT_PROVIDER_MAP: Record<string, { id: string; name: string }> = {
  // CTG Courses
  'basic-wound-management-caregiver': { id: 'sel_peacehaven_01', name: 'The Salvation Army Peacehaven' },
  'caregivers-guide-to-dementia': { id: 'sel_peacehaven_01', name: 'The Salvation Army Peacehaven' },
  'caregivers-guide-palliative-care': { id: 'sel_peacehaven_01', name: 'The Salvation Army Peacehaven' },
  'family-caregivers-dementia-literacy': { id: 'sel_peacehaven_01', name: 'The Salvation Army Peacehaven' },
  'managing-challenging-behaviours-dementia': { id: 'sel_peacehaven_01', name: 'The Salvation Army Peacehaven' },
  'basic-elderly-first-aid-domestic-workers': { id: 'sel_peacehaven_01', name: 'The Salvation Army Peacehaven' },
  'building-resilient-caregivers-online': { id: 'sel_hnf_02', name: 'Home Nursing Foundation SG' },
  'caregiver-stress-management-self-care': { id: 'sel_hnf_02', name: 'Home Nursing Foundation SG' },
  'tube-feeding-dysphagia-care': { id: 'sel_hnf_02', name: 'Home Nursing Foundation SG' },
  'assistance-adls-elderly': { id: 'sel_econ_04', name: 'Econ Careskill Training Centre' },
  'safe-transfer-mobility-techniques': { id: 'sel_econ_04', name: 'Econ Careskill Training Centre' },
  'palliative-care-comfort-strategies': { id: 'sel_hca_03', name: 'HCA Hospice Care SG' },

  // SMF Consumables Brands (Exact Medusa handles)
  'medishield-3ply-surgical-face-mask-50s': { id: 'brand_medishield', name: 'MediShield SG' },
  'betadine-antiseptic-cleanser-100ml': { id: 'brand_betadine', name: 'Betadine SG' },
  'urgo-waterproof-sterile-dressing-10x10': { id: 'brand_urgo', name: 'Urgo Medical SG' },
  'ergogrip-adjustable-walking-cane': { id: 'brand_ergogrip', name: 'ErgoGrip Aids' },
  'tena-proskin-adult-pants-normal': { id: 'sel_01M6R0J3AKJAM6VTA8VYNBCM7Z', name: 'TENA Singapore' },
  'tena-wet-wipes-antibacterial': { id: 'sel_01M6R0J3AKJAM6VTA8VYNBCM7Z', name: 'TENA Singapore' },
  'ensure-life-2-4kcal-vanilla-220ml': { id: 'sel_01M6R0J3PSEPTCM0G9V65CGZBF', name: 'Abbott Nutrition SG' },
  'tena-proskin-slip-maxi-l': { id: 'sel_01M6R0J3AKJAM6VTA8VYNBCM7Z', name: 'TENA Singapore' },
  'hartmann-peha-haft-bandage-4m': { id: 'brand_hartmann', name: 'Hartmann Singapore' },
  'glucerna-triple-care-vanilla-850g': { id: 'sel_01M6R0J3PSEPTCM0G9V65CGZBF', name: 'Abbott Nutrition SG' },
  'omron-hem-7120-bp-monitor': { id: 'sel_01M6R0J3WWWHWK939D9T26K9F9', name: 'Omron Healthcare SG' },
  'omron-mc-720-forehead-thermometer': { id: 'sel_01M6R0J3WWWHWK939D9T26K9F9', name: 'Omron Healthcare SG' },

  // Handle aliases
  'betadine-antiseptic-skin-cleanser-100ml': { id: 'brand_betadine', name: 'Betadine SG' },
  'urgo-waterproof-sterile-island-dressing-10x10cm-10s': { id: 'brand_urgo', name: 'Urgo Medical SG' },
  'ergogrip-adjustable-aluminum-folding-walking-cane': { id: 'brand_ergogrip', name: 'ErgoGrip Aids' },
  'tena-proskin-adult-pants-normal-ml-10s': { id: 'sel_01M6R0J3AKJAM6VTA8VYNBCM7Z', name: 'TENA Singapore' },
  'tena-wet-wipes-antibacterial-48s': { id: 'sel_01M6R0J3AKJAM6VTA8VYNBCM7Z', name: 'TENA Singapore' },
  'ensure-life-24kcal-nutritional-drink-vanilla-220ml-pack-of-4': { id: 'sel_01M6R0J3PSEPTCM0G9V65CGZBF', name: 'Abbott Nutrition SG' },
  'tena-proskin-slip-maxi-adult-diapers-l-24s': { id: 'sel_01M6R0J3AKJAM6VTA8VYNBCM7Z', name: 'TENA Singapore' },
  'hartmann-peha-haft-elastic-cohesive-bandage-4m': { id: 'brand_hartmann', name: 'Hartmann Singapore' },
  'glucerna-triple-care-powder-vanilla-850g': { id: 'sel_01M6R0J3PSEPTCM0G9V65CGZBF', name: 'Abbott Nutrition SG' },
  'omron-hem-7120-upper-arm-blood-pressure-monitor': { id: 'sel_01M6R0J3WWWHWK939D9T26K9F9', name: 'Omron Healthcare SG' },
};

export const listProductsWithSort = async ({
  page = 1,
  queryParams,
  sortBy = 'created_at',
  countryCode,
  category_id,
  seller_id,
  collection_id,
  filters
}: {
  page?: number;
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductParams;
  sortBy?: SortOptions;
  countryCode: string;
  category_id?: string | string[];
  seller_id?: string;
  collection_id?: string;
  filters?: {
    brand?: string;
    scheme?: string;
    skill?: string;
    min_price?: string;
    max_price?: string;
    query?: string;
  };
}): Promise<{
  response: {
    products: HttpTypes.StoreProduct[];
    count: number;
  };
  nextPage: number | null;
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductParams;
}> => {
  const limit = queryParams?.limit || 12;

  const {
    response: { products, count }
  } = await listProducts({
    pageParam: 0,
    queryParams: {
      ...queryParams,
      limit: 100
    },
    category_id,
    collection_id,
    countryCode
  });

  // Enrich products with seller information if not present
  const enrichedProducts = products.map((prod) => {
    if (!prod.seller && prod.handle && PRODUCT_PROVIDER_MAP[prod.handle]) {
      return {
        ...prod,
        seller: {
          id: PRODUCT_PROVIDER_MAP[prod.handle].id,
          name: PRODUCT_PROVIDER_MAP[prod.handle].name,
          store_status: 'OPEN',
          reviews: []
        } as any
      };
    }
    return prod;
  });

  const filteredProducts = seller_id
    ? enrichedProducts.filter(product => product.seller?.id === seller_id)
    : enrichedProducts;

  const pricedProducts = filteredProducts.filter(prod =>
    prod.variants?.some(variant => variant.calculated_price !== null)
  );

  let filteredByAll = pricedProducts;

  // 1. Keyword search query
  if (filters?.query) {
    const q = filters.query.toLowerCase().trim();
    filteredByAll = filteredByAll.filter(p =>
      p.title?.toLowerCase().includes(q) ||
      p.description?.toLowerCase().includes(q) ||
      p.seller?.name?.toLowerCase().includes(q)
    );
  }

  // 2. Skill Category filter (for CTG courses)
  if (filters?.skill) {
    const skillList = filters.skill.split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
    if (skillList.length > 0) {
      filteredByAll = filteredByAll.filter(p => {
        const meta = ((p as any).metadata || {}) as Record<string, any>;
        const skill = (meta.skillName || '').toLowerCase();
        return skillList.some(s => skill.includes(s));
      });
    }
  }

  // 3. Brand / Institute filter
  if (filters?.brand) {
    const brandList = filters.brand.split(',').map(b => b.trim().toLowerCase()).filter(Boolean);
    if (brandList.length > 0) {
      filteredByAll = filteredByAll.filter(p => {
        const sellerName = p.seller?.name?.toLowerCase() || '';
        const title = p.title?.toLowerCase() || '';
        return brandList.some(b => {
          if (b.includes('tena')) return sellerName.includes('tena') || title.includes('tena');
          if (b.includes('abbott')) return sellerName.includes('abbott') || title.includes('ensure') || title.includes('glucerna');
          if (b.includes('omron')) return sellerName.includes('omron') || title.includes('omron');
          if (b.includes('peacehaven') || b.includes('salvation')) return sellerName.includes('peacehaven');
          if (b.includes('home nursing') || b.includes('hnf')) return sellerName.includes('home nursing');
          if (b.includes('hca')) return sellerName.includes('hca');
          if (b.includes('econ')) return sellerName.includes('econ');
          if (b.includes('urgo')) return title.includes('urgo');
          if (b.includes('betadine')) return title.includes('betadine');
          if (b.includes('ergogrip')) return title.includes('ergogrip');
          return sellerName.includes(b) || title.includes(b);
        });
      });
    }
  }

  // 3. Subsidy Scheme filter (SMF Consumables vs CTG Training Courses)
  if (filters?.scheme) {
    const isCtgScheme = filters.scheme.toLowerCase().includes('ctg');
    const isSmfScheme = filters.scheme.toLowerCase().includes('smf');
    if (isCtgScheme) {
      filteredByAll = filteredByAll.filter(p =>
        p.handle?.startsWith('basic-wound') ||
        p.handle?.startsWith('caregivers-') ||
        p.handle?.startsWith('family-caregivers') ||
        p.handle?.startsWith('building-resilient') ||
        p.handle?.startsWith('assistance-adls') ||
        p.handle?.startsWith('safe-transfer') ||
        p.handle?.startsWith('palliative-care') ||
        p.handle?.startsWith('managing-challenging') ||
        p.handle?.startsWith('tube-feeding') ||
        p.handle?.startsWith('basic-elderly') ||
        p.categories?.some(c => c.name?.includes('Caregiver') || c.handle?.includes('ctg'))
      );
    } else if (isSmfScheme) {
      filteredByAll = filteredByAll.filter(p =>
        !(
          p.handle?.startsWith('basic-wound') ||
          p.handle?.startsWith('caregivers-') ||
          p.handle?.startsWith('family-caregivers') ||
          p.handle?.startsWith('building-resilient') ||
          p.handle?.startsWith('assistance-adls') ||
          p.handle?.startsWith('safe-transfer') ||
          p.handle?.startsWith('palliative-care') ||
          p.handle?.startsWith('managing-challenging') ||
          p.handle?.startsWith('tube-feeding') ||
          p.handle?.startsWith('basic-elderly') ||
          p.categories?.some(c => c.name?.includes('Caregiver') || c.handle?.includes('ctg'))
        )
      );
    }
  }

  // 4. Min / Max Price
  if (filters?.min_price) {
    const min = parseFloat(filters.min_price);
    if (!isNaN(min)) {
      filteredByAll = filteredByAll.filter(p => {
        const price = p.variants?.[0]?.calculated_price?.calculated_amount ?? 0;
        return price >= min;
      });
    }
  }
  if (filters?.max_price) {
    const max = parseFloat(filters.max_price);
    if (!isNaN(max)) {
      filteredByAll = filteredByAll.filter(p => {
        const price = p.variants?.[0]?.calculated_price?.calculated_amount ?? 0;
        return price <= max;
      });
    }
  }

  const finalCount = filteredByAll.length;
  const sortedProducts = sortProducts(filteredByAll, sortBy);

  const pageParam = (page - 1) * limit;

  const nextPage = finalCount > pageParam + limit ? pageParam + limit : null;

  const paginatedProducts = sortedProducts.slice(pageParam, pageParam + limit);

  return {
    response: {
      products: paginatedProducts,
      count: finalCount
    },
    nextPage,
    queryParams
  };
};

export const searchProducts = async (params: {
  query?: string;
  page?: number;
  hitsPerPage?: number;
  filters?: string;
  facets?: string[];
  maxValuesPerFacet?: number;
  currency_code?: string;
  countryCode?: string;
  region_id?: string;
  customer_id?: string;
  customer_group_id?: string[];
}): Promise<{
  products: (HttpTypes.StoreProduct & { seller?: SellerProps })[];
  nbHits: number;
  page: number;
  nbPages: number;
  hitsPerPage: number;
  facets: Record<string, any>;
  processingTimeMS: number;
}> => {
  if (!params.countryCode && !params.region_id) {
    throw new Error('Country code or region ID is required');
  }

  let region_id = params.region_id;

  if (!region_id && params.countryCode) {
    const region = await getRegion(params.countryCode);
    if (!region) {
      throw new Error(`Region not found for country code: ${params.countryCode}`);
    }
    region_id = region.id;
  }

  const headers = {
    ...(await getAuthHeaders())
  };

  let customer_id = params.customer_id;

  if (!customer_id) {
    const customer = await retrieveCustomer();
    if (customer) {
      customer_id = customer.id;
    }
  }

  let facets = params.facets;

  if(!facets) {
    facets = ["variants.condition", "variants.color", "variants.size"];
  }

  const { countryCode, ...bodyParams } = params;

  return sdk.client
    .fetch<{
      products: (HttpTypes.StoreProduct & { seller?: SellerProps })[];
      nbHits: number;
      page: number;
      nbPages: number;
      hitsPerPage: number;
      facets: Record<string, any>;
      processingTimeMS: number;
    }>(`/store/products/search`, {
      method: 'POST',
      body: {
        ...bodyParams,
        region_id,
        customer_id,
        facets,
        maxValuesPerFacet: 100,
      },
      headers,
      cache: 'no-cache'
    })
    .then((response) => {
      return response;
    })
    .catch(() => {
      return {
        products: [],
        nbHits: 0,
        page: params.page || 0,
        nbPages: 0,
        hitsPerPage: params.hitsPerPage || 12,
        facets: {},
        processingTimeMS: 0
      };
    });
};
