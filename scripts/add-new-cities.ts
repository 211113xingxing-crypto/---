// Add missing cities to the database
// Usage: npx tsx scripts/add-new-cities.ts
import { createClient } from '@supabase/supabase-js';
const s = createClient(
  'https://xcfwdwmqrdtchnckutoc.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhjZndkd21xcmR0Y2huY2t1dG9jIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODUxMDAyMiwiZXhwIjoyMDk0MDg2MDIyfQ.52DA_O-25DPGALNtxE5eQUka_-KqlTRxHNXIMQnICCQ'
);

const NEW_CITIES: Record<string, { name: string; lat: number; lng: number }> = {
  shenzhen: { name: '深圳市', lat: 22.543, lng: 114.058 },
  wuxi: { name: '无锡市', lat: 31.491, lng: 120.312 },
  suzhou: { name: '苏州市', lat: 31.299, lng: 120.585 },
  qingdao: { name: '青岛市', lat: 36.067, lng: 120.383 },
  dalian: { name: '大连市', lat: 38.914, lng: 121.615 },
  xiamen: { name: '厦门市', lat: 24.480, lng: 118.089 },
  ningbo: { name: '宁波市', lat: 29.868, lng: 121.544 },
};

async function main() {
  // Check existing cities
  const { data: existing } = await s.from('city').select('slug').eq('is_active', true);
  const existingSlugs = new Set((existing ?? []).map(c => c.slug));

  console.log(`Existing cities: ${existingSlugs.size}`);

  for (const [slug, info] of Object.entries(NEW_CITIES)) {
    if (existingSlugs.has(slug)) {
      console.log(`  ${info.name} (${slug}) — already exists`);
    } else {
      const { error } = await s.from('city').insert({
        name: info.name,
        slug: slug,
        lat: info.lat,
        lng: info.lng,
        is_active: true,
      });
      if (error) {
        console.error(`  ${info.name} (${slug}) — ERROR: ${error.message}`);
      } else {
        console.log(`  ${info.name} (${slug}) — ADDED`);
      }
    }
  }
}

main();
