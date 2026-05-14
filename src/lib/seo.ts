import type { Metadata } from 'next';
import { BASE_URL } from './env';

export function buildCanonical(path: string): string {
  return `${BASE_URL}${path}`;
}

export function buildMetaTitle(title: string, suffix = '亲护'): string {
  return `${title} | ${suffix}`;
}

export function buildBreadcrumbItems(
  items: Array<{ label: string; href?: string }>
): Array<{ label: string; href?: string }> {
  return [
    { label: '首页', href: BASE_URL },
    ...items,
  ];
}

export function truncateDesc(text: string, maxLen = 155): string {
  if (text.length <= maxLen) return text;
  return text.slice(0, maxLen - 3) + '...';
}
