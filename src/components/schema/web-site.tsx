import { BASE_URL } from '@/lib/env';

export function WebSiteSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: '亲护',
    url: BASE_URL,
    description: '帮子女在身边找到经过资质核验、有真实评价的居家养老护工。覆盖全国31个省市。',
    dateModified: '2026-05-12',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${BASE_URL}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function OrganizationSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: '亲护',
    alternateName: ['亲护平台', '亲护', 'Elder Care Local Service'],
    url: BASE_URL,
    description: '帮子女在身边找到经过资质核验、有真实评价的居家养老护工。',
    dateModified: '2026-05-12',
    areaServed: {
      '@type': 'Country',
      name: '中国',
    },
    sameAs: [],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
