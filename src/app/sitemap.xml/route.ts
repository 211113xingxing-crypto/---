export async function GET() {
  const baseUrl = 'https://www.eldercare.local';
  const today = new Date().toISOString().split('T')[0];

  const staticPages = [
    { path: '', priority: '1.0', changefreq: 'daily' },
    { path: '/shanghai', priority: '0.9', changefreq: 'weekly' },
    { path: '/shanghai/changning-qu', priority: '0.8', changefreq: 'weekly' },
    { path: '/shanghai/jingan-qu', priority: '0.8', changefreq: 'weekly' },
    { path: '/shanghai/xuhui-qu', priority: '0.8', changefreq: 'weekly' },
    { path: '/shanghai/pudong-xinqu', priority: '0.8', changefreq: 'weekly' },
    { path: '/shanghai/hongkou-qu', priority: '0.8', changefreq: 'weekly' },
    { path: '/shanghai/yangpu-qu', priority: '0.8', changefreq: 'weekly' },
    { path: '/shanghai/huangpu-qu', priority: '0.8', changefreq: 'weekly' },
    { path: '/shanghai/putuo-qu', priority: '0.8', changefreq: 'weekly' },
    { path: '/shanghai/hugong', priority: '0.8', changefreq: 'weekly' },
    { path: '/shanghai/peizhen', priority: '0.8', changefreq: 'weekly' },
    { path: '/shanghai/rijian-zhaoliao', priority: '0.8', changefreq: 'weekly' },
    { path: '/shanghai/shuhou-kangfu', priority: '0.8', changefreq: 'weekly' },
  ];

  const providerPages = [
    '/provider/wang-ayi-changning',
    '/provider/li-shushu-jingan',
    '/provider/zhang-ayi-pudong',
    '/provider/ankang-huli-pudong',
    '/provider/zhao-ayi-xuhui',
    '/provider/yiyang-tiannian-hongkou',
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticPages
  .map(
    (p) => `  <url>
    <loc>${baseUrl}${p.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`
  )
  .join('\n')}
${providerPages
  .map(
    (p) => `  <url>
    <loc>${baseUrl}${p}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.7</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
