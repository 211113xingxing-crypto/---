import Link from 'next/link';
import { SERVICE_TYPES } from '@/lib/constants';

export function Footer({ citySlug, cityName }: { citySlug?: string; cityName?: string }) {
  const basePath = `/${citySlug}`;

  return (
    <footer className="bg-zinc-900 text-zinc-400 mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <h3 className="text-white font-semibold mb-3">亲护</h3>
            <p className="text-sm leading-relaxed mb-4">
              帮子女在身边找到经资质核验、有真实评价的居家养老护工和护理机构。覆盖全国31个省市。
            </p>
            <p className="text-xs text-zinc-500">
              所有护工均通过身份证+资格证+健康证三重核验
            </p>
          </div>
          <div>
            <h4 className="text-white font-medium mb-3 text-sm">指南文章</h4>
            <ul className="space-y-1.5 text-sm">
              <li><Link href="/guide/zhaohugong" className="hover:text-white transition-colors">找护工完整指南</Link></li>
              <li><Link href="/guide/jiage" className="hover:text-white transition-colors">价格参考指南</Link></li>
              <li><Link href="/guide/xuanze" className="hover:text-white transition-colors">选择靠谱护工</Link></li>
              <li><Link href="/guide/changjianjibing-huli" className="hover:text-white transition-colors">常见疾病护理</Link></li>
              <li><Link href="/guide/yanglao-zhengce" className="hover:text-white transition-colors">养老政策解读</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-medium mb-3 text-sm">平台信息</h4>
            <ul className="space-y-1.5 text-sm">
              <li><Link href="/verify" className="hover:text-white transition-colors">资质审核体系</Link></li>
              <li><Link href="/help" className="hover:text-white transition-colors">帮助中心</Link></li>
              <li><Link href="/" className="hover:text-white transition-colors">全国城市列表</Link></li>
              {citySlug ? (
                <li><Link href={basePath} className="hover:text-white transition-colors">{cityName}养老首页</Link></li>
              ) : null}
            </ul>
          </div>
          <div>
            <h4 className="text-white font-medium mb-3 text-sm">服务类型</h4>
            <ul className="space-y-1.5 text-sm">
              {SERVICE_TYPES.slice(0, 6).map((s) => (
                <li key={s.slug}>
                  <Link
                    href={citySlug ? `${basePath}/${s.slug}` : `/search?type=${s.slug}`}
                    className="hover:text-white transition-colors"
                  >
                    {s.name}
                  </Link>
                </li>
              ))}
              <li><Link href="/help" className="text-emerald-400 hover:text-emerald-300 transition-colors">查看全部 →</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-zinc-800 mt-8 pt-6 text-xs text-center text-zinc-500">
          &copy; {new Date().getFullYear()} 亲护 · 让靠谱的养老服务触手可及
        </div>
      </div>
    </footer>
  );
}
