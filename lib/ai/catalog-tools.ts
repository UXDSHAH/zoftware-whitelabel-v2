import { tool } from 'ai';
import { z } from 'zod';
import { billingOptions, AED_RATE } from '@/data/billing-options';
import { bundles } from '@/data/bundles';
import { catalogProducts } from '@/data/products-catalog';
import { gatewayProducts } from '@/data/gateway-products';

type Currency = 'USD' | 'AED';
type BillingCycle = 'monthly' | 'annual' | 'half_yearly';

type ProductMatch = {
  slug: string;
  name: string;
  vendor: string;
  category: string;
  categorySlug: string;
  tagline: string;
  overview?: string;
  tags: string[];
  features: string[];
  gcPrice: number;
  originalPrice: number;
  discountPct: number;
  activationDays?: number;
  offerCode?: string;
  rating?: number;
  reviews?: number;
  hasDetailPage: boolean;
};

const normalize = (value: string) =>
  value
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

const tokensFor = (value: string) =>
  normalize(value)
    .split(' ')
    .filter(token => token.length > 1);

const roundMoney = (value: number) => Math.round(value * 100) / 100;

const toCurrencyAmount = (usd: number, currency: Currency) =>
  currency === 'AED' ? Math.round(usd * AED_RATE) : roundMoney(usd);

const formatPrice = (usd: number, currency: Currency) =>
  currency === 'AED' ? `AED ${toCurrencyAmount(usd, currency).toLocaleString()}` : `$${roundMoney(usd).toFixed(2)}`;

const textHaystack = (product: ProductMatch) =>
  normalize(
    [
      product.name,
      product.vendor,
      product.slug,
      product.category,
      product.categorySlug,
      product.tagline,
      product.overview ?? '',
      ...product.tags,
      ...product.features,
    ].join(' '),
  );

const buildProducts = (): ProductMatch[] => {
  const bySlug = new Map<string, ProductMatch>();

  for (const product of catalogProducts) {
    bySlug.set(product.slug, {
      slug: product.slug,
      name: product.name,
      vendor: product.vendor,
      category: product.category,
      categorySlug: product.categorySlug,
      tagline: product.tagline,
      tags: product.tags,
      features: [],
      gcPrice: product.gcPrice,
      originalPrice: product.originalPrice,
      discountPct: product.discountPct,
      rating: product.rating,
      reviews: product.reviews,
      hasDetailPage: product.hasDetailPage,
    });
  }

  for (const product of gatewayProducts) {
    const current = bySlug.get(product.slug);
    bySlug.set(product.slug, {
      slug: product.slug,
      name: product.name,
      vendor: product.vendor,
      category: product.category,
      categorySlug: product.categorySlug,
      tagline: product.tagline,
      overview: product.overview,
      tags: Array.from(new Set([...(current?.tags ?? []), ...product.tags])),
      features: product.features,
      gcPrice: product.gcPrice,
      originalPrice: product.originalPrice,
      discountPct: product.discountPct,
      activationDays: product.activationDays,
      offerCode: product.offerCode,
      rating: product.rating,
      reviews: product.reviews,
      hasDetailPage: true,
    });
  }

  return Array.from(bySlug.values());
};

const products = buildProducts();

const findProduct = (query: string) => {
  const normalizedQuery = normalize(query);
  if (!normalizedQuery) return undefined;

  const direct = products.find(product =>
    [product.slug, product.name, product.vendor].some(value => normalize(value) === normalizedQuery),
  );
  if (direct) return direct;

  const queryTokens = tokensFor(query);
  return products
    .map(product => ({ product, score: scoreProduct(product, queryTokens, normalizedQuery) }))
    .filter(match => match.score > 0)
    .sort((a, b) => b.score - a.score)[0]?.product;
};

const findBillingOptions = (product: ProductMatch) => {
  const productName = normalize(product.name);
  const productSlug = normalize(product.slug);

  return billingOptions.filter(option => {
    const optionProduct = normalize(option.product);
    const optionOfferCode = normalize(option.offerCode);

    if (optionProduct === productName) return true;
    if (optionOfferCode.includes(productSlug)) return true;
    return productName.includes(optionProduct) || optionProduct.includes(productName);
  });
};

const scoreProduct = (product: ProductMatch, queryTokens: string[], normalizedQuery: string) => {
  const haystack = textHaystack(product);
  let score = 0;

  if (normalize(product.slug) === normalizedQuery) score += 100;
  if (normalize(product.name) === normalizedQuery) score += 90;
  if (normalize(product.name).includes(normalizedQuery)) score += 30;
  if (normalize(product.category).includes(normalizedQuery)) score += 20;

  for (const token of queryTokens) {
    if (haystack.includes(token)) score += 5;
    if (normalize(product.name).includes(token)) score += 8;
    if (normalize(product.tags.join(' ')).includes(token)) score += 6;
  }

  if (product.rating && product.rating >= 4.5) score += 2;
  return score;
};

const compactProduct = (product: ProductMatch, currency: Currency = 'USD') => {
  const billing = findBillingOptions(product)[0];
  const priceUsd = billing?.price ?? product.gcPrice;
  const checkoutLink = buildCheckoutLinkValue({
    itemType: 'product',
    slug: product.slug,
    name: product.name,
    plan: billing?.plan ?? 'Standard',
    currency,
    billing: billing?.billingCycle ?? 'monthly',
  });

  return {
    name: product.name,
    slug: product.slug,
    vendor: product.vendor,
    category: product.category,
    tagline: product.tagline,
    tags: product.tags.slice(0, 8),
    price: {
      usd: roundMoney(priceUsd),
      aed: toCurrencyAmount(priceUsd, 'AED'),
      requested: formatPrice(priceUsd, currency),
      unit: billing ? `${billing.priceUnit}/${billing.billingCycle}` : 'user/month',
      originalUsd: roundMoney(billing?.originalPrice ?? product.originalPrice),
      discountPct: billing?.discountPct ?? product.discountPct,
    },
    activationDays: billing?.activationDays ?? product.activationDays,
    offerCode: billing?.offerCode ?? product.offerCode ?? `${product.slug}-gcc`,
    rating: product.rating,
    reviews: product.reviews,
    productUrl: product.hasDetailPage ? `/software/product/${product.slug}` : undefined,
    checkoutUrl: checkoutLink.found ? checkoutLink.url : undefined,
  };
};

const compactBundle = (bundle: (typeof bundles)[number], currency: Currency = 'USD', billing: BillingCycle = 'monthly') => {
  const priceUsd = billing === 'annual' ? bundle.annualMonthlyPrice : bundle.monthlyPrice;
  const checkoutLink = buildCheckoutLinkValue({
    itemType: 'bundle',
    slug: bundle.slug,
    name: bundle.name,
    currency,
    billing,
  });

  return {
    name: bundle.name,
    slug: bundle.slug,
    tagline: bundle.tagline,
    description: bundle.description,
    targetSize: bundle.targetSize,
    price: {
      usd: priceUsd,
      aed: toCurrencyAmount(priceUsd, 'AED'),
      requested: formatPrice(priceUsd, currency),
      billing,
      originalMonthlyUsd: bundle.originalMonthlyPrice,
      savePct: bundle.savePct,
    },
    activationDays: bundle.activationDays,
    items: bundle.items.map(item => ({
      product: item.product,
      vendor: item.vendor,
      category: item.category,
      offerCode: item.offerCode,
      bundlePriceUsd: item.bundlePrice,
    })),
    highlights: bundle.highlights,
    bundleUrl: `/bundles/${bundle.slug}`,
    checkoutUrl: checkoutLink.found ? checkoutLink.url : undefined,
  };
};

export function searchProductsValue(query: string, category?: string, currency: Currency = 'USD') {
  const queryTokens = tokensFor(query);
  const normalizedQuery = normalize(query);
  const normalizedCategory = category ? normalize(category) : undefined;

  const matches = products
    .filter(product => {
      if (!normalizedCategory) return true;
      return [product.category, product.categorySlug].some(value => normalize(value).includes(normalizedCategory));
    })
    .map(product => ({
      product,
      score: scoreProduct(product, queryTokens, normalizedQuery),
    }))
    .filter(match => (normalizedQuery ? match.score > 0 : true))
    .sort((a, b) => b.score - a.score || (b.product.rating ?? 0) - (a.product.rating ?? 0))
    .slice(0, 8)
    .map(match => compactProduct(match.product, currency));

  return {
    query,
    category,
    currency,
    count: matches.length,
    products: matches,
  };
}

export function getProductDetailsValue(slug: string, currency: Currency = 'USD') {
  const product = findProduct(slug);
  if (!product) {
    return {
      found: false,
      slug,
      message: 'No matching product exists in the local Zoftware catalog.',
    };
  }

  const billing = findBillingOptions(product);
  return {
    found: true,
    product: {
      ...compactProduct(product, currency),
      overview: product.overview,
      features: product.features.slice(0, 12),
      billingOffers: billing.map(option => ({
        plan: option.plan,
        offerCode: option.offerCode,
        billingCycle: option.billingCycle,
        price: {
          usd: option.price,
          aed: toCurrencyAmount(option.price, 'AED'),
          requested: formatPrice(option.price, currency),
          originalUsd: option.originalPrice,
          discountPct: option.discountPct,
        },
        activationDays: option.activationDays,
        description: option.description,
      })),
    },
  };
}

export function getPlansForProductValue(productNameOrSlug: string, currency: Currency = 'USD') {
  const product = findProduct(productNameOrSlug);
  if (!product) {
    return {
      found: false,
      productNameOrSlug,
      message: 'No matching product exists in the local Zoftware catalog.',
    };
  }

  const gateway = gatewayProducts.find(item => item.slug === product.slug);
  const billing = findBillingOptions(product);

  return {
    found: true,
    product: {
      name: product.name,
      slug: product.slug,
      productUrl: product.hasDetailPage ? `/software/product/${product.slug}` : undefined,
    },
    currency,
    conversion: {
      usdToAed: AED_RATE,
    },
    zoftwareBillingOffers: billing.map(option => ({
      plan: option.plan,
      offerCode: option.offerCode,
      billingCycle: option.billingCycle,
      price: {
        usd: option.price,
        aed: toCurrencyAmount(option.price, 'AED'),
        requested: formatPrice(option.price, currency),
        originalUsd: option.originalPrice,
        discountPct: option.discountPct,
      },
      activationDays: option.activationDays,
      checkoutUrl: buildCheckoutLinkValue({
        itemType: 'product',
        slug: product.slug,
        name: product.name,
        plan: option.plan,
        currency,
        billing: option.billingCycle,
      }).url,
    })),
    vendorPlans: (gateway?.plans ?? []).map(plan => ({
      name: plan.name,
      priceUsd: plan.price,
      requested: formatPrice(plan.price, currency),
      billing: plan.billing,
      features: plan.features.slice(0, 5),
    })),
  };
}

export function getBundlesValue(query?: string, currency: Currency = 'USD') {
  const normalizedQuery = query ? normalize(query) : '';
  const queryTokens = query ? tokensFor(query) : [];

  const results = bundles
    .map(bundle => {
      const haystack = normalize(
        [
          bundle.name,
          bundle.slug,
          bundle.tagline,
          bundle.description,
          bundle.targetSize,
          bundle.highlights.join(' '),
          bundle.items.map(item => `${item.product} ${item.vendor} ${item.category}`).join(' '),
        ].join(' '),
      );
      const score = !normalizedQuery
        ? 1
        : queryTokens.reduce((total, token) => total + (haystack.includes(token) ? 1 : 0), 0);

      return { bundle, score };
    })
    .filter(match => match.score > 0)
    .sort((a, b) => b.score - a.score || a.bundle.monthlyPrice - b.bundle.monthlyPrice)
    .map(match => compactBundle(match.bundle, currency));

  return {
    query,
    currency,
    count: results.length,
    bundles: results,
  };
}

export function buildCheckoutLinkValue({
  itemType,
  slug,
  name,
  plan,
  currency = 'USD',
  billing = 'monthly',
}: {
  itemType: 'product' | 'bundle';
  slug?: string;
  name?: string;
  plan?: string;
  currency?: Currency;
  billing?: BillingCycle;
}) {
  if (itemType === 'bundle') {
    const bundle = slug
      ? bundles.find(item => item.slug === slug)
      : bundles.find(item => normalize(item.name) === normalize(name ?? ''));

    if (!bundle) {
      return {
        found: false,
        message: 'No matching bundle exists in the local Zoftware catalog.',
      };
    }

    const priceUsd = roundMoney(billing === 'annual' ? bundle.annualMonthlyPrice : bundle.monthlyPrice);
    const params = new URLSearchParams({
      bundle: bundle.slug,
      bundleName: bundle.name,
      price: String(priceUsd),
      billing,
      currency,
    });

    return {
      found: true,
      itemType,
      name: bundle.name,
      slug: bundle.slug,
      price: priceUsd,
      requestedPrice: formatPrice(priceUsd, currency),
      currency,
      url: `/checkout?${params.toString()}`,
    };
  }

  const product = slug ? findProduct(slug) : findProduct(name ?? '');
  if (!product) {
    return {
      found: false,
      message: 'No matching product exists in the local Zoftware catalog.',
    };
  }

  const productBillingOptions = findBillingOptions(product);
  const billingOffer = productBillingOptions.find(option => !plan || normalize(option.plan) === normalize(plan)) ?? productBillingOptions[0];
  const selectedPlan = billingOffer?.plan ?? 'Standard';
  const priceUsd = roundMoney(billingOffer?.price ?? product.gcPrice);
  const params = new URLSearchParams({
    product: product.name,
    plan: selectedPlan,
    price: String(priceUsd),
    billing: billingOffer?.billingCycle ?? billing,
    currency,
    offerCode: billingOffer?.offerCode ?? product.offerCode ?? `${product.slug}-gcc`,
  });

  return {
    found: true,
    itemType,
    name: product.name,
    slug: product.slug,
    plan: selectedPlan,
    price: priceUsd,
    requestedPrice: formatPrice(priceUsd, currency),
    currency,
    url: `/checkout?${params.toString()}`,
  };
}

const currencySchema = z.enum(['USD', 'AED']).default('USD');
const billingSchema = z.enum(['monthly', 'annual', 'half_yearly']).default('monthly');

export const catalogTools = {
  searchProducts: tool({
    description: 'Search Zoftware products by buyer query, category, vendor, feature, or use case. Use for product recommendations and comparisons.',
    inputSchema: z.object({
      query: z.string().describe('The product, category, vendor, feature, or use case to search for.'),
      category: z.string().optional().describe('Optional category name or slug, such as CRM & Sales or customer-service.'),
      currency: currencySchema.describe('Currency to include in returned pricing.'),
    }),
    execute: async ({ query, category, currency }) => searchProductsValue(query, category, currency),
  }),
  getProductDetails: tool({
    description: 'Get authoritative details for one Zoftware product by slug or name, including pricing offers, activation days, and product links.',
    inputSchema: z.object({
      slug: z.string().describe('Product slug or exact product name, such as freshdesk, freshsales, or Zoho CRM.'),
      currency: currencySchema.describe('Currency to include in returned pricing.'),
    }),
    execute: async ({ slug, currency }) => getProductDetailsValue(slug, currency),
  }),
  getPlansForProduct: tool({
    description: 'Get Zoftware billing offers and product page vendor plans for a specific product. Use before answering pricing or plan questions.',
    inputSchema: z.object({
      productNameOrSlug: z.string().describe('Product name or slug, such as Freshdesk or freshdesk.'),
      currency: currencySchema.describe('Currency to include in returned pricing.'),
    }),
    execute: async ({ productNameOrSlug, currency }) => getPlansForProductValue(productNameOrSlug, currency),
  }),
  getBundles: tool({
    description: 'Get authoritative Zoftware software bundles, bundle prices, contents, target sizes, activation days, and checkout links.',
    inputSchema: z.object({
      query: z.string().optional().describe('Optional bundle query, team size, product, or use case. Leave empty to list all bundles.'),
      currency: currencySchema.describe('Currency to include in returned pricing.'),
    }),
    execute: async ({ query, currency }) => getBundlesValue(query, currency),
  }),
  buildCheckoutLink: tool({
    description: 'Build an authoritative Zoftware checkout link for a product or bundle using current route query conventions.',
    inputSchema: z.object({
      itemType: z.enum(['product', 'bundle']).describe('Whether the checkout link is for a product or bundle.'),
      slug: z.string().optional().describe('Product or bundle slug, preferred when known.'),
      name: z.string().optional().describe('Product or bundle display name when slug is not known.'),
      plan: z.string().optional().describe('Optional product plan name, such as Standard, Growth, Pro, or Enterprise.'),
      currency: currencySchema.describe('Checkout currency.'),
      billing: billingSchema.describe('Checkout billing cycle.'),
    }),
    execute: async input => buildCheckoutLinkValue(input),
  }),
};
