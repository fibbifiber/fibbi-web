import { CATALOG } from './catalog.js';

export const SITE = 'https://fibbi.in';

export const productUrl = (sku) => `${SITE}/shop/${sku}`;

export function productLd(sku, p) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `fibbi ${p.title}`,
    sku,
    description: p.long,
    image: SITE + p.img,
    brand: { '@type': 'Brand', name: 'fibbi' },
    offers: {
      '@type': 'Offer',
      url: productUrl(sku),
      price: p.price,
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock',
    },
  };
}

export const SHOP_LD = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  itemListElement: Object.entries(CATALOG).map(([sku, p], i) => ({
    '@type': 'ListItem',
    position: i + 1,
    url: productUrl(sku),
    item: productLd(sku, p),
  })),
};

// One route per SKU — feeds useSEO, the build-time prerender and the sitemap.
const PRODUCT_ROUTES = Object.fromEntries(
  Object.entries(CATALOG).map(([sku, p]) => [
    `/shop/${sku}`,
    {
      title: `fibbi ${p.title} — ₹${p.price} | buy online in India`,
      desc: p.long,
      type: 'product',
      ld: productLd(sku, p),
    },
  ]),
);

export const ROUTES = {
  '/': {
    title: 'fibbi — fiber that snacks back | 5g fiber per serve',
    desc: 'fibbi is a crunchy fiber snack for Indians who skip the 6am isabgol slime. 5g of psyllium + prebiotic acacia fiber per serve, in granola, jars, sticks and dahi cups.',
  },
  '/shop': {
    title: 'Shop fiber snacks — granola, jars, sticks & dahi cups | fibbi',
    desc: 'Launch pricing for India. Crunch granola in berry, coffee, cocoa and vanilla, og psyllium jars and 6g sticks, plus ready-to-eat dahi cups. 5g psyllium per serve, zero added sugar, free shipping on every order.',
    ld: SHOP_LD,
  },
  '/science': {
    title: 'The science of psyllium husk & prebiotic fiber | fibbi',
    desc: 'Psyllium husk is a soluble, gel-forming fiber studied for decades — for cholesterol, post-meal blood sugar and regularity. We did not invent the ingredient, we engineered the delivery.',
  },
  '/story': {
    title: 'Our story — the most effective fiber on earth had a branding problem | fibbi',
    desc: 'Isabgol always worked; it just got filed under uncle behaviour. fibbi bakes the same clinically proven psyllium into crunchy 5g clusters with zero added sugar. Made in Pune, priced for India.',
  },
  '/journal': {
    title: 'The fibbi journal — fiber, gut health and ingredients explained',
    desc: 'Notes on gut health, ingredients and the science we build on — written for people who want the reasoning, not the marketing.',
  },
  '/policies': {
    title: 'Shipping, returns & policies | fibbi',
    desc: 'Shipping timelines, returns, refunds and contact details for fibbi orders across India. Free shipping on every order, COD available, a human replies on WhatsApp 10am–7pm IST.',
  },
  ...PRODUCT_ROUTES,
};
