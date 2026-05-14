// Map raw scraped provider data to DB-ready format
import type { ScrapedProvider } from '../config';
import { SERVICE_KEYWORD_MAP } from '../config';

export interface TransformedProvider {
  name: string;
  slug: string;
  provider_type: 'individual' | 'agency';
  phone: string | null;
  bio: string | null;
  address_text: string | null;
  district_name: string | null;
  city_slug: string;
  latitude: number;
  longitude: number;
  status: string;
  verified: boolean;
  avg_rating: number;
  review_count: number;
  listing_titles: string[];
  listing_descriptions: string[];
  listing_prices: number[];
  listing_price_units: string[];
  listing_service_type_slugs: string[];
}

let slugCounter = 0;

function generateSlug(name: string): string {
  slugCounter++;
  const pinyin = name
    .replace(/[（）()【】\[\]《》]/g, '')
    .replace(/[^一-龥a-zA-Z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase()
    .slice(0, 60);
  const id = slugCounter.toString(36).padStart(4, '0');
  return `${pinyin}-${id}`;
}

function extractPhone(text: string): string | null {
  const match = text.match(/(\d{3,4}-?\d{7,11})|(1[3-9]\d{9})/);
  return match ? match[0].replace(/-/g, '') : null;
}

function classifyServiceType(extraText: string, features: string[], intro: string): string[] {
  const slugs = new Set<string>();
  const combined = `${extraText} ${features.join(' ')} ${intro}`;

  for (const [keyword, slug] of Object.entries(SERVICE_KEYWORD_MAP)) {
    if (combined.includes(keyword)) {
      slugs.add(slug);
    }
  }

  // All crawled providers are agencies — always include yanglaoyuan as base
  slugs.add('yanglaoyuan');
  return [...slugs];
}

function parsePrice(priceStr: string): { price: number; unit: string } | null {
  if (!priceStr) return null;
  const cleaned = priceStr.replace(/[，,]/g, '').replace(/[^0-9.\-/月天次年时次]/g, '');
  const numMatch = cleaned.match(/([\d.]+)/);
  if (!numMatch) return null;
  const price = parseFloat(numMatch[1]);
  if (isNaN(price) || price <= 0) return null;

  let unit = 'month';
  if (/天|日/.test(cleaned)) unit = 'day';
  else if (/时|小时/.test(cleaned)) unit = 'hour';
  else if (/次/.test(cleaned)) unit = 'per_visit';
  else if (/年/.test(cleaned)) unit = 'year';

  return { price, unit };
}

export function transform(raw: ScrapedProvider): TransformedProvider {
  const slug = generateSlug(raw.name);
  const phone = extractPhone(raw.phone);
  const bio = raw.intro.slice(0, 1000) || null;
  const serviceTypeSlugs = classifyServiceType(raw.name, raw.features, raw.intro);

  const listings = serviceTypeSlugs.map((stSlug) => {
    const priceInfo = parsePrice(raw.priceRange);
    return {
      title: `${raw.name} - ${stSlug}`,
      description: raw.features.slice(0, 3).join('、') || null,
      price: priceInfo?.price ?? null,
      priceUnit: priceInfo?.unit ?? 'month',
      serviceTypeSlug: stSlug,
    };
  });

  return {
    name: raw.name.slice(0, 100),
    slug,
    provider_type: 'agency',
    phone,
    bio,
    address_text: raw.addressText || null,
    district_name: raw.districtName || null,
    city_slug: raw.citySlug,
    latitude: 0,
    longitude: 0,
    status: 'active',
    verified: false,
    avg_rating: 0,
    review_count: 0,
    listing_titles: listings.map((l) => l.title),
    listing_descriptions: listings.map((l) => l.description),
    listing_prices: listings.map((l) => l.price),
    listing_price_units: listings.map((l) => l.priceUnit),
    listing_service_type_slugs: listings.map((l) => l.serviceTypeSlug),
  };
}
