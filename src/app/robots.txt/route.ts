export async function GET() {
  const content = `# Allow all search engine crawlers
User-agent: *
Allow: /

# Explicitly allow AI crawlers (for AI search visibility)
User-agent: GPTBot
Allow: /

User-agent: CCBot
Allow: /

User-agent: anthropic-ai
Allow: /

User-agent: Google-Extended
Allow: /

# Sitemaps
Sitemap: https://elder.navi-resources.com/sitemap.xml
`;

  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
