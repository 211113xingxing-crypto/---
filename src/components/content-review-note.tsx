interface ContentReviewNoteProps {
  sources: string[];
  updatedAt: string;
}

export function ContentReviewNote({ sources, updatedAt }: ContentReviewNoteProps) {
  return (
    <section className="bg-zinc-50 border border-zinc-200 rounded-lg p-5 mt-10 text-sm">
      <h2 className="font-semibold text-zinc-900 mb-2">内容审核说明</h2>
      <p className="text-zinc-600 mb-2">
        本文内容由亲护编辑团队基于以下权威来源编写，并于{updatedAt}完成更新审核。
        我们定期对照最新临床指南和行业标准进行内容复审。
      </p>
      <ul className="list-disc list-inside space-y-1 text-zinc-500">
        {sources.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ul>
      <p className="text-zinc-400 mt-3">
        免责声明：本文仅供科普参考，不构成医疗建议。具体照护方案请咨询执业医师或护理专家。
      </p>
    </section>
  );
}

/** Returns citation list and reviewedBy for Article JSON-LD schema */
export function buildArticleEEAT(sources: string[]) {
  return {
    citation: sources.map((name) => ({
      '@type': 'CreativeWork' as const,
      name,
    })),
    reviewedBy: {
      '@type': 'Organization' as const,
      name: '亲护内容审核团队',
      description: '养老护理内容审核团队，定期对照最新临床指南进行内容复审',
    },
    isBasedOn: sources.map((name) => ({
      '@type': 'CreativeWork' as const,
      name,
    })),
  };
}
