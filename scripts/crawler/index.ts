// Crawler entry point — orchestrate multi-city crawler pipeline
//
// Usage:
//   npx tsx scripts/crawler/index.ts                    # crawl all 31 cities
//   npx tsx scripts/crawler/index.ts --city=beijing     # crawl single city
//   npx tsx scripts/crawler/index.ts --dry-run           # scrape only, no DB write

import { config, CITY_PINYIN, SOURCES } from './config';
import type { ScrapedProvider } from './config';
import { transform, type TransformedProvider } from './utils/transformer';
import { findByCityAndName } from './utils/dedup';
import { geocode } from './utils/geocoder';
import { writeProvider } from './utils/writer';

interface Stats {
  city: string;
  scraped: number;
  duplicates: number;
  written: number;
  errors: number;
}

function parseArgs(): { cities: string[]; dryRun: boolean; source: string } {
  const args = process.argv.slice(2);
  let cities = Object.keys(CITY_PINYIN);
  let dryRun = false;
  let source = 'yanglao';

  for (const arg of args) {
    if (arg === '--dry-run') {
      dryRun = true;
    } else if (arg.startsWith('--city=')) {
      cities = [arg.slice(7)];
    } else if (arg.startsWith('--source=')) {
      source = arg.slice(9);
    }
  }

  return { cities, dryRun, source };
}

async function processCity(
  city: string,
  dryRun: boolean,
  crawlCity: (citySlug: string) => Promise<ScrapedProvider[]>
): Promise<Stats> {
  const stats: Stats = { city, scraped: 0, duplicates: 0, written: 0, errors: 0 };
  console.log(`\n===== ${city} =====`);

  // 1. Scrape
  let scraped;
  try {
    scraped = await crawlCity(city);
  } catch (e) {
    console.error(`  Crawl failed: ${(e as Error).message}`);
    stats.errors++;
    return stats;
  }
  stats.scraped = scraped.length;
  console.log(`  Scraped ${scraped.length} providers`);

  // 2. Transform, dedup, geocode, write
  for (const raw of scraped) {
    try {
      const transformed = transform(raw);

      // Dedup check
      const exists = await findByCityAndName(city, transformed.name);
      if (exists) {
        console.log(`  Skipping duplicate: ${transformed.name}`);
        stats.duplicates++;
        continue;
      }

      // Geocode
      if (transformed.address_text) {
        const { lat, lng } = await geocode(transformed.address_text, city);
        transformed.latitude = lat;
        transformed.longitude = lng;
      } else {
        const { lat, lng } = await geocode('', city);
        transformed.latitude = lat;
        transformed.longitude = lng;
      }

      // Write
      if (!dryRun) {
        const ok = await writeProvider(transformed);
        if (ok) {
          stats.written++;
        } else {
          stats.errors++;
        }
      } else {
        console.log(`  [DRY] Would insert: ${transformed.name}`);
        stats.written++;
      }
    } catch (e) {
      console.error(`  Error processing ${raw.name}: ${(e as Error).message}`);
      stats.errors++;
    }
  }

  console.log(
    `  Done: ${stats.written} written, ${stats.duplicates} skipped, ${stats.errors} errors`
  );
  return stats;
}

async function main() {
  const { cities, dryRun, source } = parseArgs();

  // Load the crawler source
  const sourcePath = SOURCES[source];
  if (!sourcePath) {
    console.error(`Unknown source: ${source}. Available: ${Object.keys(SOURCES).join(', ')}`);
    process.exit(1);
  }
  const sourceModule = (await import(sourcePath)) as { crawlCity: (citySlug: string) => Promise<ScrapedProvider[]> };
  const crawlCity = sourceModule.crawlCity;

  console.log('== Elder Care Platform Crawler ==');
  console.log(`Source: ${source}`);
  console.log(`Cities: ${cities.length === 1 ? cities[0] : `${cities.length} cities`}`);
  console.log(`Mode: ${dryRun ? 'DRY RUN (no DB writes)' : 'LIVE (writes to DB)'}`);
  console.log(`Max pages per city: ${config.maxPagesPerCity}`);
  console.log(`Rate limit: ${config.requestDelayMs}ms between requests`);
  console.log('');

  const allStats: Stats[] = [];
  const start = Date.now();

  for (const city of cities) {
    const stats = await processCity(city, dryRun, crawlCity);
    allStats.push(stats);
  }

  // Summary
  console.log('\n===== Summary =====');
  let totalScraped = 0;
  let totalWritten = 0;
  let totalDups = 0;
  let totalErrors = 0;

  for (const s of allStats) {
    totalScraped += s.scraped;
    totalWritten += s.written;
    totalDups += s.duplicates;
    totalErrors += s.errors;
    if (s.scraped > 0) {
      console.log(`  ${s.city}: ${s.written} written, ${s.duplicates} skipped, ${s.errors} errors`);
    }
  }

  const elapsed = ((Date.now() - start) / 1000 / 60).toFixed(1);
  console.log(`\nTotal: ${totalWritten} inserted, ${totalDups} duplicates, ${totalErrors} errors in ${elapsed} min`);
}

main().catch(console.error);
