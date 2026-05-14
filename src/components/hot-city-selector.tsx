'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface CityItem {
  name: string;
  slug: string;
}

// Curated hot cities by tier
const HOT_CITY_SLUGS = new Set([
  // 一线城市
  'beijing', 'shanghai', 'guangzhou', 'shenzhen',
  // 新一线城市
  'chengdu', 'hangzhou', 'chongqing', 'wuhan', 'xian', 'suzhou',
  'tianjin', 'nanjing', 'changsha', 'zhengzhou', 'dongguan',
  'qingdao', 'shenyang', 'ningbo', 'kunming',
  // 网红/热门城市
  'xiamen', 'sanya', 'dali', 'lijiang', 'haerbin',
  'lasa', 'haikou', 'zhuhai', 'guilin', 'zhangjiajie',
  // 经济强市补充
  'wuxi', 'foshan', 'fuzhou', 'jinan', 'hefei',
]);

function cityLabel(name: string): string {
  return name.replace('市', '').replace('市', '');
}

interface HotCitySelectorProps {
  allCities: CityItem[];
}

export function HotCitySelector({ allCities }: HotCitySelectorProps) {
  const [expanded, setExpanded] = useState(false);

  const hotCities = allCities.filter(c => HOT_CITY_SLUGS.has(c.slug));
  const otherCities = allCities.filter(c => !HOT_CITY_SLUGS.has(c.slug));

  return (
    <section className="py-12 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-xl font-bold text-zinc-900 mb-6">选择城市</h2>

        {/* Hot cities grid */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 mb-4">
          {hotCities.map((c) => (
            <Link
              key={c.slug}
              href={`/${c.slug}`}
              className="bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2.5 text-center text-sm shadow-sm hover:border-emerald-300 hover:bg-emerald-50 hover:-translate-y-0.5 transition-all duration-200"
            >
              {cityLabel(c.name)}
            </Link>
          ))}
        </div>

        {/* Expand toggle */}
        {otherCities.length > 0 && (
          <>
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-1 mx-auto text-sm text-zinc-500 hover:text-emerald-700 transition-colors"
            >
              {expanded ? (
                <>
                  <ChevronUp className="w-4 h-4" />
                  收起其他城市
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4" />
                  查看全部城市 ({otherCities.length})
                </>
              )}
            </button>

            {expanded && (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 mt-4 pt-4 border-t border-zinc-100">
                {otherCities.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/${c.slug}`}
                    className="bg-zinc-50 border border-zinc-100 rounded-lg px-3 py-2 text-center text-sm text-zinc-500 hover:border-emerald-200 hover:bg-emerald-50 hover:text-zinc-700 transition-all"
                  >
                    {cityLabel(c.name)}
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
