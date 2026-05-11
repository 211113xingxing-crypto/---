import { supabase, type DbProvider, type DbDistrict, type DbServiceType, type DbReview } from './supabase';

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
  district: { name: string; slug: string } | null;
  city: { name: string; slug: string } | null;
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
    district: p.district ? { name: p.district.name, slug: p.district.slug } : null,
    city: p.city ? { name: p.city.name, slug: p.city.slug } : null,
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

// ---- Data fetch functions ----

export async function getDistricts(): Promise<MappedDistrict[]> {
  const { data } = await supabase
    .from('district')
    .select('*')
    .eq('level', 'district')
    .order('name');
  return (data ?? []).map(d => ({
    id: d.id,
    name: d.name,
    slug: d.slug,
    level: d.level,
    parentId: d.parent_id,
  }));
}

export async function getDistrictBySlug(slug: string): Promise<MappedDistrict | null> {
  const { data } = await supabase
    .from('district')
    .select('*')
    .eq('slug', slug)
    .single();
  if (!data) return null;
  return {
    id: data.id, name: data.name, slug: data.slug,
    level: data.level, parentId: data.parent_id,
  };
}

export async function getSubDistricts(parentId: number): Promise<MappedDistrict[]> {
  const { data } = await supabase
    .from('district')
    .select('*')
    .eq('parent_id', parentId)
    .order('name');
  return (data ?? []).map(d => ({
    id: d.id, name: d.name, slug: d.slug,
    level: d.level, parentId: d.parent_id,
  }));
}

export async function getServiceTypes(): Promise<MappedServiceType[]> {
  const { data } = await supabase
    .from('service_type')
    .select('*')
    .order('name');
  return (data ?? []).map(s => ({
    id: s.id, name: s.name, slug: s.slug, description: s.description ?? undefined,
  }));
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

export async function getAllProviders(): Promise<MappedProvider[]> {
  const { data } = await supabase
    .from('service_provider')
    .select('*, district(*), service_listing(*, serviceType:service_type(*))')
    .eq('status', 'active')
    .order('avg_rating', { ascending: false });
  return (data ?? []).map(p => mapProvider(p as unknown as DbProvider));
}

export async function getHotProviders(limit = 6): Promise<MappedProvider[]> {
  const { data } = await supabase
    .from('service_provider')
    .select('*, district(*), service_listing(*, serviceType:service_type(*))')
    .eq('status', 'active')
    .eq('verified', true)
    .order('avg_rating', { ascending: false })
    .limit(limit);
  return (data ?? []).map(p => mapProvider(p as unknown as DbProvider));
}

export async function getProvidersByDistrict(slug: string): Promise<{
  district: MappedDistrict;
  providers: MappedProvider[];
  subDistricts: MappedDistrict[];
} | null> {
  const district = await getDistrictBySlug(slug);
  if (!district) return null;

  const subIds = await getSubDistricts(district.id);
  const allIds = [district.id, ...subIds.map(s => s.id)];

  const { data } = await supabase
    .from('service_provider')
    .select('*, district(*), service_listing(*, serviceType:service_type(*))')
    .eq('status', 'active')
    .in('district_id', allIds)
    .order('avg_rating', { ascending: false });

  return {
    district,
    providers: (data ?? []).map(p => mapProvider(p as unknown as DbProvider)),
    subDistricts: subIds,
  };
}

export async function getProvidersByServiceType(slug: string): Promise<{
  serviceType: MappedServiceType;
  providers: MappedProvider[];
} | null> {
  const st = await getServiceTypeBySlug(slug);
  if (!st) return null;

  const { data: ptRows } = await supabase
    .from('provider_service_type')
    .select('provider_id')
    .eq('service_type_id', st.id);

  if (!ptRows || ptRows.length === 0) return { serviceType: st, providers: [] };

  const providerIds = ptRows.map(r => r.provider_id);
  const { data } = await supabase
    .from('service_provider')
    .select('*, district(*), service_listing(*, serviceType:service_type(*))')
    .eq('status', 'active')
    .in('id', providerIds)
    .order('avg_rating', { ascending: false });

  return {
    serviceType: st,
    providers: (data ?? []).map(p => mapProvider(p as unknown as DbProvider)),
  };
}

export async function getProviderBySlug(slug: string): Promise<MappedProvider | null> {
  const { data } = await supabase
    .from('service_provider')
    .select('*, district(*), city(*), service_listing(*, serviceType:service_type(*)), verification(*), provider_service_type(*, serviceType:service_type(*))')
    .eq('slug', slug)
    .eq('status', 'active')
    .single();
  if (!data) return null;
  return mapProvider(data as unknown as DbProvider);
}

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

export async function searchProviders(params: {
  q?: string;
  districtSlug?: string;
  serviceTypeSlug?: string;
}): Promise<{ providers: MappedProvider[]; total: number }> {
  let query = supabase
    .from('service_provider')
    .select('*, district(*), service_listing(*, serviceType:service_type(*))', { count: 'exact' })
    .eq('status', 'active');

  if (params.districtSlug) {
    const district = await getDistrictBySlug(params.districtSlug);
    if (district) {
      const subIds = await getSubDistricts(district.id);
      const allIds = [district.id, ...subIds.map(s => s.id)];
      query = query.in('district_id', allIds);
    }
  }

  if (params.serviceTypeSlug) {
    const st = await getServiceTypeBySlug(params.serviceTypeSlug);
    if (st) {
      const { data: ptRows } = await supabase
        .from('provider_service_type')
        .select('provider_id')
        .eq('service_type_id', st.id);
      if (ptRows && ptRows.length > 0) {
        query = query.in('id', ptRows.map(r => r.provider_id));
      } else {
        return { providers: [], total: 0 };
      }
    }
  }

  if (params.q) {
    query = query.or(`name.ilike.%${params.q}%,bio.ilike.%${params.q}%`);
  }

  query = query.order('avg_rating', { ascending: false });

  const { data, count } = await query;
  return {
    providers: (data ?? []).map(p => mapProvider(p as unknown as DbProvider)),
    total: count ?? 0,
  };
}

export { priceLabel };
