// Deduplication: check if a provider already exists by name+city or phone
import { config } from '../config';

const SUPABASE_URL = config.supabaseUrl;
const ANON_KEY = config.anonKey;

async function supabaseGet(path: string): Promise<unknown> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    headers: {
      apikey: ANON_KEY,
      Authorization: `Bearer ${ANON_KEY}`,
    },
    signal: AbortSignal.timeout(10000),
  });
  if (!res.ok) return null;
  return res.json();
}

// Check if a provider with the same name already exists in this city
export async function findByCityAndName(
  citySlug: string,
  name: string
): Promise<boolean> {
  const encoded = encodeURIComponent(name);
  const data = await supabaseGet(
    `service_provider?select=id&city.slug=eq.${encodeURIComponent(citySlug)}&name=eq.${encoded}&limit=1`
  );
  return Array.isArray(data) && data.length > 0;
}

// Check if a provider with the same phone already exists in this city
export async function findByCityAndPhone(
  citySlug: string,
  phone: string
): Promise<{ id: number; name: string } | null> {
  if (!phone) return null;
  const data = await supabaseGet(
    `service_provider?select=id,name&city.slug=eq.${encodeURIComponent(citySlug)}&phone=eq.${encodeURIComponent(phone)}&limit=1`
  );
  if (Array.isArray(data) && data.length > 0) {
    return data[0] as { id: number; name: string };
  }
  return null;
}
