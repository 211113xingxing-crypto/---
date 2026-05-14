import { supabase, fetchAll, type DbProvider, type DbDistrict, type DbServiceType, type DbReview, type DbCity } from './supabase';
import { PROVINCES, type ProvinceInfo } from './china-divisions';

// ---- Simple TTL cache ----

const cache = new Map<string, { data: unknown; expiresAt: number }>();

function cacheGet<T>(key: string, ttlMs: number, fetcher: () => Promise<T>): Promise<T> {
  const entry = cache.get(key);
  if (entry && entry.expiresAt > Date.now()) return Promise.resolve(entry.data as T);
  return fetcher().then((data) => {
    cache.set(key, { data, expiresAt: Date.now() + ttlMs });
    return data;
  });
}

// ---- Mapped types (camelCase, as expected by UI components) ----

export interface MappedProvider {
  id: number;
  name: string;
  slug: string;
  providerType: 'individual' | 'agency';
  avgRating: number;
  reviewCount: number;
  yearsExperience: number | null;
  verified: boolean;
  gender: string | null;
  age: number | null;
  phone: string | null;
  wechatId: string | null;
  addressText: string | null;
  bio: string | null;
  latitude: number;
  longitude: number;
  district: { id: number; name: string; slug: string } | null;
  city: { id: number; name: string; slug: string } | null;
  listings: MappedListing[];
  verifications: { verifyType: string; verifyStatus: string }[];
  serviceTypes: { serviceType: { name: string; slug: string } }[];
}

export interface MappedListing {
  title: string;
  description: string | null;
  price: number | null;
  priceUnit: string | null;
  serviceType: { name: string; slug: string };
}

export interface MappedDistrict {
  id: number;
  name: string;
  slug: string;
  level: string;
  parentId: number | null;
  count?: number;
}

export interface MappedServiceType {
  id: number;
  name: string;
  slug: string;
  description?: string;
  count?: number;
}

export interface MappedCity {
  id: number;
  name: string;
  slug: string;
  lat: number | null;
  lng: number | null;
}

export interface MappedReview {
  id: number;
  rating: number;
  content?: string;
  tags: string[];
  isVerifiedBooking: boolean;
  createdAt: string;
  user: { nickname: string; avatarUrl: string | null };
}

// ---- Helpers ----

function mapProvider(p: DbProvider): MappedProvider {
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    providerType: p.provider_type,
    avgRating: p.avg_rating,
    reviewCount: p.review_count,
    yearsExperience: p.years_experience,
    verified: p.verified,
    gender: p.gender ?? null,
    age: p.age ?? null,
    phone: p.phone ?? null,
    wechatId: p.wechat_id ?? null,
    addressText: p.address_text ?? null,
    bio: p.bio ?? null,
    latitude: p.latitude,
    longitude: p.longitude,
    district: p.district ? { id: p.district.id, name: p.district.name, slug: p.district.slug } : null,
    city: p.city ? { id: p.city.id, name: p.city.name, slug: p.city.slug } : null,
    listings: (p.service_listing ?? []).map(l => ({
      title: l.title,
      description: l.description ?? null,
      price: l.price,
      priceUnit: l.price_unit,
      serviceType: l.serviceType ?? { name: '', slug: '' },
    })),
    verifications: (p.verification ?? []).map(v => ({
      verifyType: v.verify_type,
      verifyStatus: v.verify_status,
    })),
    serviceTypes: (p.provider_service_type ?? []).map(st => ({
      serviceType: {
        name: st.serviceType?.name ?? '',
        slug: st.serviceType?.slug ?? '',
      },
    })),
  };
}

function priceLabel(price: number, unit: string | null): string {
  switch (unit) {
    case 'hour': return `${price}元/小时`;
    case 'day': return `${price}元/天`;
    case 'month': return `${price}元/月`;
    case 'per_visit': return `${price}元/次`;
    default: return `${price}元`;
  }
}

// ---- City helpers ----

const cityIdCache = new Map<string, number>();

export async function getCityBySlug(slug: string): Promise<MappedCity | null> {
  const { data } = await supabase
    .from('city')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single();
  if (!data) return null;
  return { id: data.id, name: data.name, slug: data.slug, lat: data.lat, lng: data.lng };
}

export async function getCityIdBySlug(slug: string): Promise<number | null> {
  if (cityIdCache.has(slug)) return cityIdCache.get(slug)!;
  const city = await getCityBySlug(slug);
  if (city) {
    cityIdCache.set(slug, city.id);
    return city.id;
  }
  return null;
}

export async function getAllCities(): Promise<MappedCity[]> {
  return cacheGet('allCities', 5 * 60 * 1000, async () => {
    const { data } = await supabase
      .from('city')
      .select('*')
      .eq('is_active', true)
      .order('name');
    return (data ?? []).map(c => ({
      id: c.id, name: c.name, slug: c.slug, lat: c.lat, lng: c.lng,
    }));
  });
}

// ---- District queries ----

export async function getDistricts(cityId: number): Promise<MappedDistrict[]> {
  const { data } = await supabase
    .from('district')
    .select('*')
    .eq('city_id', cityId)
    .eq('level', 'district')
    .order('name');
  return (data ?? []).map(d => ({
    id: d.id, name: d.name, slug: d.slug, level: d.level, parentId: d.parent_id,
  }));
}

export async function getDistrictBySlug(slug: string, cityId: number): Promise<MappedDistrict | null> {
  const { data } = await supabase
    .from('district')
    .select('*')
    .eq('slug', slug)
    .eq('city_id', cityId)
    .single();
  if (!data) return null;
  return {
    id: data.id, name: data.name, slug: data.slug,
    level: data.level, parentId: data.parent_id,
  };
}

export async function getSubDistricts(parentId: number, cityId: number): Promise<MappedDistrict[]> {
  const { data } = await supabase
    .from('district')
    .select('*')
    .eq('parent_id', parentId)
    .eq('city_id', cityId)
    .order('name');
  return (data ?? []).map(d => ({
    id: d.id, name: d.name, slug: d.slug, level: d.level, parentId: d.parent_id,
  }));
}

// ---- Service type queries (global, not city-specific) ----

export async function getServiceTypes(): Promise<MappedServiceType[]> {
  return cacheGet('serviceTypes', 5 * 60 * 1000, async () => {
    const { data } = await supabase
      .from('service_type')
      .select('*')
      .order('name');
    return (data ?? []).map(s => ({
      id: s.id, name: s.name, slug: s.slug, description: s.description ?? undefined,
    }));
  });
}

export async function getServiceTypeBySlug(slug: string): Promise<MappedServiceType | null> {
  const { data } = await supabase
    .from('service_type')
    .select('*')
    .eq('slug', slug)
    .single();
  if (!data) return null;
  return { id: data.id, name: data.name, slug: data.slug, description: data.description ?? undefined };
}

// ---- Provider queries (city-scoped) ----

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function applySort(
  query: any,
  sort: string,
): any {
  switch (sort) {
    case 'reviews':
      return query.order('review_count', { ascending: false }).order('avg_rating', { ascending: false });
    case 'experience':
      return query.order('years_experience', { ascending: false, nullsFirst: false }).order('avg_rating', { ascending: false });
    case 'price_asc':
      // Price sort handled post-query (price is in joined listings)
      return query.order('avg_rating', { ascending: false });
    default:
      return query.order('avg_rating', { ascending: false });
  }
}

function sortByPrice(providers: MappedProvider[]): MappedProvider[] {
  return [...providers].sort((a, b) => {
    const aMin = Math.min(...a.listings.filter(l => l.price).map(l => l.price!), Infinity);
    const bMin = Math.min(...b.listings.filter(l => l.price).map(l => l.price!), Infinity);
    if (aMin === Infinity && bMin === Infinity) return 0;
    if (aMin === Infinity) return 1;
    if (bMin === Infinity) return -1;
    return aMin - bMin;
  });
}

export async function getAllProviders(cityId: number, sort = 'rating'): Promise<MappedProvider[]> {
  const query = supabase
    .from('service_provider')
    .select('*, district(*), city(*), service_listing(*, serviceType:service_type(*))')
    .eq('status', 'active')
    .eq('city_id', cityId);
  const sorted = applySort(query, sort);
  const { data } = await sorted;
  const mapped = ((data ?? []) as unknown[]).map(p => mapProvider(p as DbProvider));
  return sort === 'price_asc' ? sortByPrice(mapped) : mapped;
}

export async function getHotProviders(limit = 6, cityId: number): Promise<MappedProvider[]> {
  const { data } = await supabase
    .from('service_provider')
    .select('*, district(*), city(*), service_listing(*, serviceType:service_type(*))')
    .eq('status', 'active')
    .eq('city_id', cityId)
    .eq('verified', true)
    .order('avg_rating', { ascending: false })
    .limit(limit);
  return (data ?? []).map(p => mapProvider(p as unknown as DbProvider));
}

export async function getProvidersByDistrict(slug: string, cityId: number, sort = 'rating'): Promise<{
  district: MappedDistrict;
  providers: MappedProvider[];
  subDistricts: MappedDistrict[];
} | null> {
  const district = await getDistrictBySlug(slug, cityId);
  if (!district) return null;

  const subIds = await getSubDistricts(district.id, cityId);
  const allIds = [district.id, ...subIds.map(s => s.id)];

  let query = supabase
    .from('service_provider')
    .select('*, district(*), city(*), service_listing(*, serviceType:service_type(*))')
    .eq('status', 'active')
    .eq('city_id', cityId)
    .in('district_id', allIds);
  query = applySort(query, sort);
  const { data } = await query;

  const mapped = (data ?? []).map(p => mapProvider(p as unknown as DbProvider));
  return {
    district,
    providers: sort === 'price_asc' ? sortByPrice(mapped) : mapped,
    subDistricts: subIds,
  };
}

export async function getProvidersByServiceType(slug: string, cityId: number, sort = 'rating'): Promise<{
  serviceType: MappedServiceType;
  providers: MappedProvider[];
} | null> {
  const st = await getServiceTypeBySlug(slug);
  if (!st) return null;

  const ptRows = await fetchAll<{ provider_id: number }>(
    supabase.from('provider_service_type').select('provider_id').eq('service_type_id', st.id),
  );

  if (ptRows.length === 0) return { serviceType: st, providers: [] };

  const providerIds = ptRows.map(r => r.provider_id);
  let query = supabase
    .from('service_provider')
    .select('*, district(*), city(*), service_listing(*, serviceType:service_type(*))')
    .eq('status', 'active')
    .eq('city_id', cityId)
    .in('id', providerIds);
  query = applySort(query, sort);
  const { data } = await query;

  const mapped = (data ?? []).map(p => mapProvider(p as unknown as DbProvider));
  return {
    serviceType: st,
    providers: sort === 'price_asc' ? sortByPrice(mapped) : mapped,
  };
}

export async function getProviderBySlug(slug: string): Promise<MappedProvider | null> {
  const { data } = await supabase
    .from('service_provider')
    .select('*, district(*), city(*), service_listing(*, serviceType:service_type(*)), verification(*), provider_service_type(*, serviceType:service_type(*))')
    .eq('slug', slug)
    .eq('status', 'active')
    .maybeSingle();
  if (!data) return null;
  return mapProvider(data as unknown as DbProvider);
}

export async function getSimilarProviders(
  providerId: number,
  cityId: number,
  districtId: number | null,
  limit = 4,
): Promise<MappedProvider[]> {
  let query = supabase
    .from('service_provider')
    .select('*, district(*), city(*), service_listing(*, serviceType:service_type(*))')
    .eq('status', 'active')
    .eq('city_id', cityId)
    .neq('id', providerId)
    .order('avg_rating', { ascending: false })
    .limit(limit);

  if (districtId) {
    query = query.eq('district_id', districtId);
  }

  const { data } = await query;

  if (!data || data.length === 0) {
    const { data: fallback } = await supabase
      .from('service_provider')
      .select('*, district(*), city(*), service_listing(*, serviceType:service_type(*))')
      .eq('status', 'active')
      .eq('city_id', cityId)
      .neq('id', providerId)
      .order('avg_rating', { ascending: false })
      .limit(limit);
    return (fallback ?? []).map(p => mapProvider(p as unknown as DbProvider));
  }

  return data.map(p => mapProvider(p as unknown as DbProvider));
}

// ---- Reviews ----

export async function getReviews(providerId: number): Promise<MappedReview[]> {
  const { data } = await supabase
    .from('review')
    .select('*, user:user(*)')
    .eq('provider_id', providerId)
    .order('created_at', { ascending: false })
    .limit(50);
  return (data ?? []).map(r => ({
    id: r.id,
    rating: r.rating,
    content: r.content ?? undefined,
    tags: r.tags ?? [],
    isVerifiedBooking: r.is_verified_booking,
    createdAt: r.created_at,
    user: {
      nickname: r.user?.nickname ?? `用户#${r.user_id}`,
      avatarUrl: r.user?.avatar_url ?? null,
    },
  }));
}

// ---- Search ----

export async function searchProviders(params: {
  q?: string;
  districtSlug?: string;
  serviceTypeSlug?: string;
  cityId: number;
  sort?: string;
}): Promise<{ providers: MappedProvider[]; total: number }> {
  let query = supabase
    .from('service_provider')
    .select('*, district(*), city(*), service_listing(*, serviceType:service_type(*))', { count: 'exact' })
    .eq('status', 'active')
    .eq('city_id', params.cityId);

  if (params.districtSlug) {
    const district = await getDistrictBySlug(params.districtSlug, params.cityId);
    if (district) {
      const subIds = await getSubDistricts(district.id, params.cityId);
      const allIds = [district.id, ...subIds.map(s => s.id)];
      query = query.in('district_id', allIds);
    }
  }

  if (params.serviceTypeSlug) {
    const st = await getServiceTypeBySlug(params.serviceTypeSlug);
    if (st) {
      const ptRows = await fetchAll<{ provider_id: number }>(
        supabase.from('provider_service_type').select('provider_id').eq('service_type_id', st.id),
      );
      if (ptRows.length > 0) {
        query = query.in('id', ptRows.map(r => r.provider_id));
      } else {
        return { providers: [], total: 0 };
      }
    }
  }

  if (params.q) {
    query = query.or(`name.ilike.%${params.q}%,bio.ilike.%${params.q}%`);
  }

  const sort = params.sort ?? 'rating';
  query = applySort(query, sort);

  const { data, count } = await query;
  const mapped = (data ?? []).map(p => mapProvider(p as unknown as DbProvider));
  return {
    providers: sort === 'price_asc' ? sortByPrice(mapped) : mapped,
    total: count ?? 0,
  };
}

// ---- Stats ----

export async function getStats(): Promise<{ providerCount: number; cityCount: number; reviewCount: number }> {
  return cacheGet('stats', 5 * 60 * 1000, async () => {
    const [pRes, cRes, rRes] = await Promise.all([
      supabase.from('service_provider').select('id', { count: 'exact', head: true }).eq('status', 'active'),
      supabase.from('city').select('id', { count: 'exact', head: true }).eq('is_active', true),
      supabase.from('review').select('id', { count: 'exact', head: true }),
    ]);
    return {
      providerCount: pRes.count ?? 0,
      cityCount: cRes.count ?? 0,
      reviewCount: rRes.count ?? 0,
    };
  });
}

// ---- Province helpers ----

export function getProvinceBySlug(slug: string): ProvinceInfo | null {
  return PROVINCES.find(p => p.slug === slug) ?? null;
}

export interface MappedProvinceCity {
  name: string;
  slug: string;
  providerCount: number;
}

export async function getProvinceCityStats(province: ProvinceInfo): Promise<MappedProvinceCity[]> {
  const { data: cities } = await supabase
    .from('city')
    .select('id,name,slug')
    .in('slug', province.cities)
    .eq('is_active', true);

  const result: MappedProvinceCity[] = [];
  for (const c of cities ?? []) {
    const { count } = await supabase
      .from('service_provider')
      .select('id', { count: 'exact', head: true })
      .eq('city_id', c.id)
      .eq('status', 'active');
    result.push({ name: c.name, slug: c.slug, providerCount: count ?? 0 });
  }

  result.sort((a, b) => b.providerCount - a.providerCount);
  return result;
}

export { priceLabel };
