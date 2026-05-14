// 养老网 (yanglao.com.cn) scraper
import * as cheerio from 'cheerio';
import { fetchPage } from '../utils/fetcher';
import { config, CITY_PINYIN, type ScrapedProvider } from '../config';

const BASE = 'https://www.yanglao.com.cn';

interface ListItem {
  name: string;
  detailUrl: string;
  rating: number;
  priceText: string;
  features: string[];
  cityArea: string;
  institutionType: string;
}

function parseListPage(html: string): ListItem[] {
  const $ = cheerio.load(html);
  const items: ListItem[] = [];

  $('.home_organ_card').each((_, card) => {
    const $card = $(card);
    const titleEl = $card.find('.home_organ_card_txt_title');
    const name = titleEl.text().trim();
    if (!name) return;

    const linkEl = $card.closest('a');
    const detailUrl = linkEl.attr('href') || '';

    const scoreEl = $card.find('.home_organ_card_score');
    const rating = parseFloat(scoreEl.text().trim()) || 0;

    const priceEl = $card.find('.home_organ_card_txt_price_zt');
    const priceUnitEl = $card.find('.home_organ_card_txt_price_ft');
    const priceText = `${priceEl.text().trim()} ${priceUnitEl.text().trim()}`.trim();

    const tags: string[] = [];
    $card.find('.home_organ_card_txt_bq span').each((_, s) => {
      tags.push($(s).text().trim());
    });

    const features: string[] = [];
    $card.find('.home_organ_card_txt_ts div').each((_, div) => {
      features.push($(div).text().trim());
    });

    const cityArea = tags[0] || '';
    const institutionType = tags[1] || '';

    items.push({ name, detailUrl, rating, priceText, features, cityArea, institutionType });
  });

  return items;
}

function parseDetailPage(html: string, item: ListItem): { address: string; phone: string; intro: string; careLevels: string[]; districtName: string; priceRange: string } {
  const $ = cheerio.load(html);

  let address = '';
  let phone = '';
  let intro = '';
  let districtName = '';
  let priceRange = item.priceText;

  // Extract fields from labeled list items
  $('li').each((_, li) => {
    const label = $(li).find('.resthomeDetai_content_theme_leftT');
    if (!label.length) return;

    const labelText = label.text().trim();
    const fullText = $(li).text().trim();
    const value = fullText.replace(labelText, '').trim();

    switch (labelText) {
      case '所在地区：': {
        address = value;
        // Format: "北京 - 北京市 - 朝阳区"
        const parts = value.split('-').map((s) => s.trim());
        districtName = parts[parts.length - 1] || '';
        break;
      }
      case '收费区间：':
        priceRange = value || item.priceText;
        break;
      default:
        break;
    }
  });

  // Phone from any element containing phone pattern
  const bodyText = $('body').text();
  const phoneMatch = bodyText.match(/(\d{3,4}-?\d{7,11})|(1[3-9]\d{9})/);
  if (phoneMatch) phone = phoneMatch[0];

  // Intro from meta description
  intro = $('meta[name="description"]').attr('content') || '';

  // Care levels
  const careLevels: string[] = [];
  $('li:contains("自理"), li:contains("半自理"), li:contains("不能自理"), li:contains("特护"), li:contains("认知障碍"), li:contains("病后康复")').each((_, li) => {
    const text = $(li).text().trim();
    if (['自理', '半自理', '不能自理', '特护', '认知障碍', '病后康复'].includes(text)) {
      careLevels.push(text);
    }
  });

  return { address, phone, intro, careLevels, districtName, priceRange };
}

export async function crawlCity(citySlug: string): Promise<ScrapedProvider[]> {
  const pinyin = CITY_PINYIN[citySlug];
  if (!pinyin) {
    console.warn(`No pinyin mapping for city: ${citySlug}`);
    return [];
  }

  const results: ScrapedProvider[] = [];
  const seen = new Set<string>();

  for (let page = 1; page <= config.maxPagesPerCity; page++) {
    const listUrl = page === 1
      ? `${BASE}/${pinyin}/`
      : `${BASE}/${pinyin}_${page}`;

    console.log(`  Fetching list: ${listUrl}`);
    const listHtml = await fetchPage(listUrl);
    if (!listHtml) break;

    const items = parseListPage(listHtml);
    if (!items.length) break;

    console.log(`  Found ${items.length} institutions on page ${page}`);

    for (const item of items) {
      if (seen.has(item.name)) continue;
      seen.add(item.name);

      const detailUrl = item.detailUrl.startsWith('http')
        ? item.detailUrl
        : `${BASE}${item.detailUrl}`;

      console.log(`    Fetching detail: ${item.name}`);
      const detailHtml = await fetchPage(detailUrl);
      if (!detailHtml) continue;

      const detail = parseDetailPage(detailHtml, item);

      results.push({
        sourceName: 'yanglao.com.cn',
        sourceUrl: detailUrl,
        name: item.name,
        citySlug,
        addressText: detail.address,
        phone: detail.phone,
        intro: detail.intro || item.features.join('，'),
        institutionType: item.institutionType,
        priceRange: detail.priceRange,
        bedCount: null,
        rating: item.rating,
        features: item.features,
        careLevels: detail.careLevels,
        districtName: detail.districtName || item.cityArea,
      });
    }

    // Check for next page
    const $ = cheerio.load(listHtml);
    const nextPage = $(`a[href="../${pinyin}_${page + 1}"]`).length > 0;
    if (!nextPage) break;
  }

  return results;
}
