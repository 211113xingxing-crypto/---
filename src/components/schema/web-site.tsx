export function WebSiteSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: '养老本地服务',
    url: 'https://www.eldercare.local',
    description: '帮子女在上海本地找到经过资质核验、有真实评价的居家养老护工。',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://www.eldercare.local/search?q={search_term_string}&city=shanghai',
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
    name: '养老本地服务',
    url: 'https://www.eldercare.local',
    description: '专注养老本地服务发现，帮子女找到身边靠谱的养老服务。',
    areaServed: {
      '@type': 'City',
      name: '上海市',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
