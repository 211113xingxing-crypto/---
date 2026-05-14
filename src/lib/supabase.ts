import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Fetch all rows with pagination (bypasses the 1000-row default limit)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function fetchAll<T>(
  query: any,
  batchSize = 1000,
): Promise<T[]> {
  const results: T[] = [];
  let from = 0;
  while (true) {
    const { data, error } = await query.range(from, from + batchSize - 1);
    if (error) break;
    if (!data || data.length === 0) break;
    results.push(...(data as T[]));
    if (data.length < batchSize) break;
    from += batchSize;
  }
  return results;
}

// ---- Types matching the DB schema ----

export interface DbProvider {
  id: number;
  provider_type: 'individual' | 'agency';
  name: string;
  slug: string;
  phone: string | null;
  wechat_id: string | null;
  avatar_url: string | null;
  bio: string | null;
  years_experience: number | null;
  avg_rating: number;
  review_count: number;
  verified: boolean;
  latitude: number;
  longitude: number;
  address_text: string | null;
  district_id: number | null;
  city_id: number;
  status: string;
  gender: string | null;
  age: number | null;
  district?: DbDistrict | null;
  city?: { id: number; name: string; slug: string } | null;
  service_listing?: DbListing[];
  verification?: DbVerification[];
  provider_service_type?: { serviceType: DbServiceType; provider_id: number; service_type_id: number }[];
}

export interface DbListing {
  id: number;
  provider_id: number;
  service_type_id: number;
  title: string;
  description: string | null;
  price: number | null;
  price_unit: string | null;
  is_active: boolean;
  serviceType?: DbServiceType;
}

export interface DbDistrict {
  id: number;
  city_id: number;
  name: string;
  level: string;
  parent_id: number | null;
  slug: string;
  lat: number | null;
  lng: number | null;
}

export interface DbServiceType {
  id: number;
  name: string;
  slug: string;
  description: string | null;
}

export interface DbVerification {
  id: number;
  provider_id: number;
  verify_type: string;
  verify_status: string;
}

export interface DbReview {
  id: number;
  provider_id: number;
  user_id: number;
  rating: number;
  content: string | null;
  tags: string[];
  is_verified_booking: boolean;
  created_at: string;
  user?: { nickname: string | null; avatar_url: string | null } | null;
}

export interface DbCity {
  id: number;
  name: string;
  slug: string;
  lat: number | null;
  lng: number | null;
  is_active: boolean;
}
