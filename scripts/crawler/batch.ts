// Batch crawler — crawl multiple cities with resumption support
//
// Usage:
//   npx tsx scripts/crawler/batch.ts                         # crawl ALL 31 cities
//   npx tsx scripts/crawler/batch.ts --skip-existing          # skip cities with data
//   npx tsx scripts/crawler/batch.ts --exclude=shanghai       # skip specific cities
//   npx tsx scripts/crawler/batch.ts --cities=beijing,tianjin # only these cities
//   npx tsx scripts/crawler/batch.ts --dry-run                # scrape only, no DB

import { config, CITY_PINYIN, SOURCES } from './config';
import type { ScrapedProvider } from './config';
import { transform } from './utils/transformer';
import { findByCityAndName } from './utils/dedup';
import { geocode } from './utils/geocoder';
import { writeProvider } from './utils/writer';

const SUPABASE_URL = config.supabaseUrl;
const ANON_KEY = config.anonKey;

interface BatchStats {
  city: string;
  scraped: number;
  duplicates: number;
  written: number;
  errors: number;
  elapsedSec: number;
}

function parseArgs(): { cities: string[]; dryRun: boolean; skipExisting: boolean; source: string } {
  const args = process.argv.slice(2);
  let cities = Object.keys(CITY_PINYIN);
  let dryRun = false;
  let skipExisting = false;
  let source = 'yanglao';

  for (const arg of args) {
    if (arg === '--dry-run') dryRun = true;
    else if (arg === '--skip-existing') skipExisting = true;
    else if (arg.startsWith('--cities=')) cities = arg.slice(9).split(',').map(s => s.trim());
    else if (arg.startsWith('--source=')) source = arg.slice(9);
    else if (arg.startsWith('--exclude=')) {
      const exclude = new Set(arg.slice(10).split(',').map(s => s.trim()));
      cities = cities.filter(c => !exclude.has(c));
    }
  }

  return { cities, dryRun, skipExisting, source };
}

// Get city ID by slug
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

// Count existing providers for a city
async function countExistingProviders(citySlug: string): Promise<number> {
  const cityId = await getCityId(citySlug);
  if (!cityId) return 0;

  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/service_provider?select=id&city_id=eq.${cityId}&limit=1`,
    {
      headers: {
        apikey: ANON_KEY,
        Authorization: `Bearer ${ANON_KEY}`,
        Prefer: 'count=exact',
      },
      signal: AbortSignal.timeout(10000),
    }
  );
  if (!res.ok) return 0;
  const range = res.headers.get('content-range');
  if (range) {
    const parts = range.split('/');
    if (parts.length === 2) return parseInt(parts[1], 10) || 0;
  }
  return 0;
}

async function processCity(
  city: string,
  dryRun: boolean,
  crawlCity: (citySlug: string) => Promise<ScrapedProvider[]>
): Promise<BatchStats> {
  const start = Date.now();
  const stats: BatchStats = { city, scraped: 0, duplicates: 0, written: 0, errors: 0, elapsedSec: 0 };

  // 1. Scrape
  let scraped;
  try {
    scraped = await crawlCity(city);
  } catch (e) {
    console.error(`  Crawl failed: ${(e as Error).message}`);
    stats.errors++;
    stats.elapsedSec = (Date.now() - start) / 1000;
    return stats;
  }
  stats.scraped = scraped.length;
  if (!scraped.length) {
    stats.elapsedSec = (Date.now() - start) / 1000;
    return stats;
  }

  // 2. Transform, dedup, geocode, write
  for (const raw of scraped) {
    try {
      const transformed = transform(raw);

      const exists = await findByCityAndName(city, transformed.name);
      if (exists) {
        stats.duplicates++;
        continue;
      }

      if (transformed.address_text) {
        const { lat, lng } = await geocode(transformed.address_text, city);
        transformed.latitude = lat;
        transformed.longitude = lng;
      } else {
        const { lat, lng } = await geocode('', city);
        transformed.latitude = lat;
        transformed.longitude = lng;
      }

      if (!dryRun) {
        const ok = await writeProvider(transformed);
        ok ? stats.written++ : stats.errors++;
      } else {
        stats.written++;
      }
    } catch (e) {
      console.error(`  Error on ${raw.name}: ${(e as Error).message}`);
      stats.errors++;
    }
  }

  stats.elapsedSec = (Date.now() - start) / 1000;
  console.log(
    `  [${city}] ${stats.written} written, ${stats.duplicates} skipped, ${stats.errors} errors, ${stats.elapsedSec.toFixed(0)}s`
  );
  return stats;
}

const PROGRESS_FILE = './scripts/crawler/batch-progress.json';

function loadProgress(): Set<string> {
  try {
    const fs = require('fs');
    if (fs.existsSync(PROGRESS_FILE)) {
      const data = JSON.parse(fs.readFileSync(PROGRESS_FILE, 'utf-8'));
      return new Set(data.completed || []);
    }
  } catch { /* ignore */ }
  return new Set();
}

function saveProgress(completed: Set<string>): void {
  try {
    const fs = require('fs');
    fs.writeFileSync(PROGRESS_FILE, JSON.stringify({ completed: [...completed], updated: new Date().toISOString() }, null, 2));
  } catch { /* ignore */ }
}

async function main() {
  const { cities, dryRun, skipExisting, source } = parseArgs();

  // Load the crawler source
  const sourcePath = SOURCES[source];
  if (!sourcePath) {
    console.error(`Unknown source: ${source}. Available: ${Object.keys(SOURCES).join(', ')}`);
    process.exit(1);
  }
  const sourceModule = (await import(sourcePath)) as { crawlCity: (citySlug: string) => Promise<ScrapedProvider[]> };
  const crawlCity = sourceModule.crawlCity;

  console.log('== Batch Crawler ==');
  console.log(`Source: ${source}`);
  console.log(`Total cities: ${cities.length}`);
  console.log(`Mode: ${dryRun ? 'DRY RUN' : 'LIVE'}`);
  console.log(`Skip existing: ${skipExisting}`);
  console.log(`Pages/city: ${config.maxPagesPerCity}`);
  console.log('');

  // Load previous progress
  const completed = loadProgress();
  if (completed.size > 0) {
    console.log(`Resuming: ${completed.size} cities already completed in previous run\n`);
  }

  // Filter out cities that already have data
  const toCrawl: string[] = [];
  for (const city of cities) {
    if (completed.has(city)) {
      console.log(`  Skipping ${city} (completed in previous run)`);
      continue;
    }
    if (skipExisting) {
      const count = await countExistingProviders(city);
      if (count > 0) {
        console.log(`  Skipping ${city} (${count} existing providers)`);
        completed.add(city);
        continue;
      }
    }
    toCrawl.push(city);
  }
  saveProgress(completed);

  console.log(`\nWill crawl: ${toCrawl.length} cities\n`);

  const allStats: BatchStats[] = [];
  const batchStart = Date.now();

  for (let i = 0; i < toCrawl.length; i++) {
    const city = toCrawl[i];
    console.log(`[${i + 1}/${toCrawl.length}] ${city}`);
    const stats = await processCity(city, dryRun, crawlCity);
    allStats.push(stats);
    completed.add(city);
    saveProgress(completed);
  }

  // Summary
  console.log('\n===== Batch Summary =====');
  let totalS = 0, totalW = 0, totalD = 0, totalE = 0, totalSec = 0;
  for (const s of allStats) {
    totalS += s.scraped;
    totalW += s.written;
    totalD += s.duplicates;
    totalE += s.errors;
    totalSec += s.elapsedSec;
  }

  const totalMin = (totalSec / 60).toFixed(1);
  const batchMin = ((Date.now() - batchStart) / 60000).toFixed(1);
  console.log(`Cities processed: ${allStats.length}`);
  console.log(`Scraped: ${totalS} | Written: ${totalW} | Duplicates: ${totalD} | Errors: ${totalE}`);
  console.log(`Total work time: ${totalMin} min (wall clock: ${batchMin} min)`);
  console.log(`Average: ${(totalSec / allStats.length / 60).toFixed(1)} min/city`);
}

main().catch(console.error);
