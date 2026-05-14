import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import { getAllProvidersForExport } from '@/lib/admin-queries';

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;
  const userId = token ? verifyToken(token) : null;
  if (!userId) {
    return new Response('Unauthorized', { status: 401 });
  }

  const providers = await getAllProvidersForExport();

  const header = ['ID', '名称', '类型', '状态', '评分', '评价数', '城市', '区域', '服务类型', '创建时间'].join(',');
  const rows = providers.map(p => [
    p.id,
    `"${(p.name ?? '').replace(/"/g, '""')}"`,
    p.providerType === 'individual' ? '个人' : '机构',
    p.status === 'active' ? '已上线' : p.status === 'suspended' ? '已暂停' : '待审核',
    p.avgRating.toFixed(1),
    p.reviewCount,
    `"${(p.city?.name ?? '').replace(/"/g, '""')}"`,
    `"${(p.district?.name ?? '').replace(/"/g, '""')}"`,
    `"${p.listings?.map((l: any) => l.serviceType.name).join('、') ?? ''}"`,
    p.createdAt.toISOString().slice(0, 10),
  ].join(','));

  const csv = '﻿' + [header, ...rows].join('\n');

  return new Response(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="providers-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
