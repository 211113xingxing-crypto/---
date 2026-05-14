// Write transformed providers to Supabase via REST API
import { config } from '../config';
import type { TransformedProvider } from './transformer';

const SUPABASE_URL = config.supabaseUrl;
const ANON_KEY = config.anonKey;

async function post(path: string, body: unknown): Promise<unknown> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    method: 'POST',
    headers: {
      apikey: ANON_KEY,
      Authorization: `Bearer ${ANON_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(15000),
  });
  if (!res.ok) {
    const err = await res.text();
    console.error(`  POST ${path} failed: ${res.status}`, err.slice(0, 150));
    return null;
  }
  return res.json();
}

// Get city ID from slug
async function getCityId(slug: string): Promise<number | null> {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/city?select=id&slug=eq.${encodeURIComponent(slug)}&limit=1`,
    {
      headers: { apikey: ANON_KEY, Authorization: `Bearer ${ANON_KEY}` },
      signal: AbortSignal.timeout(10000),
    }
  );
  if (!res.ok) return null;
  const data = (await res.json()) as { id: number }[];
  return data?.[0]?.id ?? null;
}

// Get district ID by name match (fuzzy) within a city
async function getDistrictId(name: string, cityId: number): Promise<number | null> {
  if (!name) return null;
  const encoded = encodeURIComponent(name);
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/district?select=id&city_id=eq.${cityId}&name=ilike.${encoded}*&limit=1`,
    {
      headers: { apikey: ANON_KEY, Authorization: `Bearer ${ANON_KEY}` },
      signal: AbortSignal.timeout(10000),
    }
  );
  if (!res.ok) return null;
  const data = (await res.json()) as { id: number }[];
  return data?.[0]?.id ?? null;
}

// Get service type ID by slug
async function getServiceTypeId(slug: string): Promise<number | null> {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/service_type?select=id&slug=eq.${encodeURIComponent(slug)}&limit=1`,
    {
      headers: { apikey: ANON_KEY, Authorization: `Bearer ${ANON_KEY}` },
      signal: AbortSignal.timeout(10000),
    }
  );
  if (!res.ok) return null;
  const data = (await res.json()) as { id: number }[];
  return data?.[0]?.id ?? null;
}

export async function writeProvider(p: TransformedProvider): Promise<boolean> {
  // Get city ID
  const cityId = await getCityId(p.city_slug);
  if (!cityId) {
    console.warn(`  Skipping ${p.name}: city "${p.city_slug}" not found`);
    return false;
  }

  // Get district ID
  const districtId = await getDistrictId(p.district_name || '', cityId);

  // Insert provider
  const providerBody = {
    name: p.name,
    slug: p.slug,
    provider_type: p.provider_type,
    phone: p.phone,
    bio: p.bio,
    address_text: p.address_text,
    district_id: districtId,
    city_id: cityId,
    latitude: p.latitude,
    longitude: p.longitude,
    status: p.status,
    verified: p.verified,
    avg_rating: p.avg_rating,
    review_count: p.review_count,
  };

  const created = (await post('service_provider', providerBody)) as
    | { id: number }[]
    | null;
  if (!created || !created.length) {
    console.error(`  Failed to insert provider: ${p.name}`);
    return false;
  }

  const providerId = created[0].id;
  console.log(`  Inserted: ${p.name} (id=${providerId})`);

  // Insert service listings
  for (let i = 0; i < p.listing_titles.length; i++) {
    const stId = await getServiceTypeId(p.listing_service_type_slugs[i]);
    if (stId) {
      await post('service_listing', {
        provider_id: providerId,
        service_type_id: stId,
        title: p.listing_titles[i],
        description: p.listing_descriptions[i] || null,
        price: p.listing_prices[i],
        price_unit: p.listing_price_units[i],
        is_active: true,
      });
    }
  }

  // Insert provider_service_type junction records
  for (const stSlug of p.listing_service_type_slugs) {
    const stId = await getServiceTypeId(stSlug);
    if (stId) {
      await post('provider_service_type', {
        provider_id: providerId,
        service_type_id: stId,
      });
    }
  }

  return true;
}
