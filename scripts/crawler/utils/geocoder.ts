// Geocoding via 高德地图 API with file-based cache
import * as fs from 'fs';
import { config } from '../config';

interface CacheEntry {
  lat: number;
  lng: number;
}

let cache: Record<string, CacheEntry> = {};
let cacheLoaded = false;

function loadCache(): void {
  if (cacheLoaded) return;
  try {
    if (fs.existsSync(config.geocodeCacheFile)) {
      cache = JSON.parse(fs.readFileSync(config.geocodeCacheFile, 'utf-8'));
    }
  } catch {
    cache = {};
  }
  cacheLoaded = true;
}

function saveCache(): void {
  try {
    fs.writeFileSync(config.geocodeCacheFile, JSON.stringify(cache, null, 2));
  } catch {
    // ignore
  }
}

// Default city center coordinates used when geocoding is unavailable
const CITY_CENTERS: Record<string, { lat: number; lng: number }> = {
  beijing: { lat: 39.9042, lng: 116.4074 },
  tianjin: { lat: 39.1252, lng: 117.1906 },
  shanghai: { lat: 31.2304, lng: 121.4737 },
  chongqing: { lat: 29.4316, lng: 106.9123 },
  guangzhou: { lat: 23.1291, lng: 113.2644 },
  chengdu: { lat: 30.5728, lng: 104.0668 },
  wuhan: { lat: 30.5928, lng: 114.3055 },
  nanjing: { lat: 32.0603, lng: 118.7969 },
  hangzhou: { lat: 30.2741, lng: 120.1551 },
  xian: { lat: 34.3416, lng: 108.9398 },
  zhengzhou: { lat: 34.7466, lng: 113.6254 },
  jinan: { lat: 36.6512, lng: 116.9974 },
  shenyang: { lat: 41.8057, lng: 123.4315 },
  changsha: { lat: 28.2282, lng: 112.9388 },
  haerbin: { lat: 45.8038, lng: 126.5350 },
  changchun: { lat: 43.8171, lng: 125.3235 },
  shijiazhuang: { lat: 38.0428, lng: 114.5149 },
  taiyuan: { lat: 37.8706, lng: 112.5489 },
  hefei: { lat: 31.8206, lng: 117.2272 },
  fuzhou: { lat: 26.0745, lng: 119.2965 },
  nanchang: { lat: 28.6820, lng: 115.8582 },
  kunming: { lat: 25.0389, lng: 102.7183 },
  guiyang: { lat: 26.6470, lng: 106.6302 },
  nanning: { lat: 22.8170, lng: 108.3665 },
  haikou: { lat: 20.0440, lng: 110.1999 },
  lanzhou: { lat: 36.0611, lng: 103.8343 },
  xining: { lat: 36.6171, lng: 101.7782 },
  yinchuan: { lat: 38.4872, lng: 106.2309 },
  wulumuqi: { lat: 43.8256, lng: 87.6168 },
  huhehaote: { lat: 40.8424, lng: 111.7490 },
  lasa: { lat: 29.6500, lng: 91.1000 },
};

export async function geocode(
  address: string,
  citySlug: string
): Promise<{ lat: number; lng: number }> {
  loadCache();

  const cacheKey = `${citySlug}:${address}`;
  if (cache[cacheKey]) return cache[cacheKey];

  // If no AMap key configured, use city center + small random jitter
  if (!config.amapKey) {
    const center = CITY_CENTERS[citySlug] ?? { lat: 31.23, lng: 121.47 };
    const jitter = () => (Math.random() - 0.5) * 0.04;
    const result = { lat: center.lat + jitter(), lng: center.lng + jitter() };
    cache[cacheKey] = result;
    saveCache();
    return result;
  }

  // Call 高德 geocoding API
  try {
    const url = `https://restapi.amap.com/v3/geocode/geo?key=${config.amapKey}&address=${encodeURIComponent(address)}&city=${encodeURIComponent(citySlug)}`;
    const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
    const data = (await res.json()) as {
      status: string;
      geocodes?: { location: string }[];
    };
    if (data.status === '1' && data.geocodes?.length) {
      const [lng, lat] = data.geocodes[0].location.split(',').map(Number);
      if (!isNaN(lat) && !isNaN(lng)) {
        const result = { lat, lng };
        cache[cacheKey] = result;
        saveCache();
        return result;
      }
    }
  } catch {
    // fall through to fallback
  }

  // Fallback to city center
  const center = CITY_CENTERS[citySlug] ?? { lat: 31.23, lng: 121.47 };
  const jitter = () => (Math.random() - 0.5) * 0.04;
  const result = { lat: center.lat + jitter(), lng: center.lng + jitter() };
  cache[cacheKey] = result;
  saveCache();
  return result;
}
