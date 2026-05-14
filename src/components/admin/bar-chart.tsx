interface BarChartProps {
  data: Array<{ label: string; value: number }>;
}

export function BarChart({ data }: BarChartProps) {
  const max = Math.max(...data.map(d => d.value), 1);

  return (
    <div className="space-y-2">
      {data.map((d, i) => (
        <div key={i} className="flex items-center gap-3 text-sm">
          <span className="w-20 text-right text-zinc-500 truncate" title={d.label}>
            {d.label}
          </span>
          <div className="flex-1 h-6 bg-zinc-100 rounded-sm overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-sm transition-all"
              style={{ width: `${(d.value / max) * 100}%` }}
            />
          </div>
          <span className="w-10 text-zinc-700 font-medium">{d.value}</span>
        </div>
      ))}
    </div>
  );
}
