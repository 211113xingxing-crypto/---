import Link from 'next/link';

const districts = [
  { name: '长宁区', slug: 'changning-qu' },
  { name: '静安区', slug: 'jingan-qu' },
  { name: '徐汇区', slug: 'xuhui-qu' },
  { name: '浦东新区', slug: 'pudong-xinqu' },
  { name: '虹口区', slug: 'hongkou-qu' },
  { name: '杨浦区', slug: 'yangpu-qu' },
  { name: '黄浦区', slug: 'huangpu-qu' },
  { name: '普陀区', slug: 'putuo-qu' },
];

const serviceTypes = [
  { name: '居家护理', slug: 'hugong' },
  { name: '陪诊服务', slug: 'peizhen' },
  { name: '日间照料', slug: 'rijian-zhaoliao' },
  { name: '术后康复', slug: 'shuhou-kangfu' },
];

export function Footer() {
  return (
    <footer className="bg-zinc-900 text-zinc-400 mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-white font-semibold mb-3">养老本地服务</h3>
            <p className="text-sm leading-relaxed">
              帮子女在上海本地找到经过资质核验、有真实评价的居家养老护工和护理机构。
            </p>
          </div>
          <div>
            <h4 className="text-white font-medium mb-3 text-sm">按区域查找</h4>
            <ul className="grid grid-cols-2 gap-1 text-sm">
              {districts.map((d) => (
                <li key={d.slug}>
                  <Link
                    href={`/shanghai/${d.slug}`}
                    className="hover:text-white transition-colors"
                  >
                    {d.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-white font-medium mb-3 text-sm">按服务类型</h4>
            <ul className="space-y-1 text-sm">
              {serviceTypes.map((s) => (
                <li key={s.slug}>
                  <Link
                    href={`/shanghai/${s.slug}`}
                    className="hover:text-white transition-colors"
                  >
                    {s.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-zinc-800 mt-8 pt-6 text-xs text-center">
          &copy; {new Date().getFullYear()} 养老本地服务 - 让靠谱的养老服务触手可及
        </div>
      </div>
    </footer>
  );
}
