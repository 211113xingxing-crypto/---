import { createClient } from '@supabase/supabase-js';
import { BASE_URL } from '@/lib/env';
import { PROVINCES } from '@/lib/china-divisions';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

function urlElement(loc: string, priority: string, changefreq: string, lastmod?: string): string {
  const lastmodEl = lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : '';
  return `  <url>
    <loc>${loc}</loc>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>${lastmodEl}
  </url>`;
}

export async function GET() {
  const urls: string[] = [];

  // Static pages
  urls.push(urlElement(`${BASE_URL}/`, '1.0', 'daily'));
  urls.push(urlElement(`${BASE_URL}/guide/zhaohugong`, '0.8', 'monthly'));
  urls.push(urlElement(`${BASE_URL}/guide/jiage`, '0.8', 'monthly'));
  urls.push(urlElement(`${BASE_URL}/guide/xuanze`, '0.8', 'monthly'));
  urls.push(urlElement(`${BASE_URL}/guide/changjianjibing-huli`, '0.7', 'monthly', '2026-05-14'));
  urls.push(urlElement(`${BASE_URL}/guide/yanglao-zhengce`, '0.7', 'monthly', '2026-05-14'));
  urls.push(urlElement(`${BASE_URL}/help`, '0.6', 'monthly'));
  urls.push(urlElement(`${BASE_URL}/verify`, '0.6', 'monthly'));
  urls.push(urlElement(`${BASE_URL}/profile`, '0.5', 'monthly'));

  // Province landing pages
  for (const p of PROVINCES) {
    urls.push(urlElement(`${BASE_URL}/${p.slug}`, '0.8', 'weekly'));
  }

  try {
    // Batch-load all cities, districts, and service types in 3 queries instead of N*2+3
    const [citiesRes, districtsRes, serviceTypesRes, providersRes] = await Promise.all([
      supabase.from('city').select('id, slug').eq('is_active', true),
      supabase.from('district').select('city_id, slug'),
      supabase.from('service_type').select('slug'),
      supabase.from('service_provider').select('slug, updated_at').eq('status', 'active').order('updated_at', { ascending: false }),
    ]);

    const cities = citiesRes.data ?? [];
    const districts = districtsRes.data ?? [];
    const serviceTypes = serviceTypesRes.data ?? [];
    const providers = providersRes.data ?? [];

    // Group districts by city_id
    const districtsByCity = new Map<number, Array<{ slug: string }>>();
    for (const d of districts) {
      const list = districtsByCity.get(d.city_id) ?? [];
      list.push(d);
      districtsByCity.set(d.city_id, list);
    }

    // City pages + sub-pages
    for (const city of cities) {
      urls.push(urlElement(`${BASE_URL}/${city.slug}`, '0.9', 'daily'));

      const cityDistricts = districtsByCity.get(city.id) ?? [];
      for (const d of cityDistricts) {
        urls.push(urlElement(`${BASE_URL}/${city.slug}/${d.slug}`, '0.8', 'weekly'));
      }

      for (const st of serviceTypes) {
        urls.push(urlElement(`${BASE_URL}/${city.slug}/${st.slug}`, '0.8', 'weekly'));
      }
    }

    // Provider pages
    for (const p of providers) {
      const lastmod = p.updated_at ? new Date(p.updated_at).toISOString().split('T')[0] : undefined;
      urls.push(urlElement(`${BASE_URL}/provider/${p.slug}`, '0.7', 'weekly', lastmod));
    }
  } catch {
    // If DB queries fail, serve what we have
  }

  // Fire-and-forget: ping IndexNow (Bing/Yandex) about the sitemap update
  const key = process.env.INDEXNOW_KEY || '42144ba7c627b48227f516908777afc1';
  const host = new URL(BASE_URL).hostname;
  const indexNowBody = JSON.stringify({
    host,
    key,
    keyLocation: `${BASE_URL}/api/indexnow`,
    urlList: [`${BASE_URL}/`],
  });
  fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: indexNowBody,
  }).catch(() => {});
  fetch('https://www.bing.com/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: indexNowBody,
  }).catch(() => {});

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
