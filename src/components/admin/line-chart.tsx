interface LineChartProps {
  data: Array<{ label: string; value: number }>;
  width?: number;
  height?: number;
}

export function LineChart({ data, width = 600, height = 200 }: LineChartProps) {
  if (data.length < 2) {
    return <div className="text-sm text-zinc-400 text-center py-8">数据不足，无法生成图表</div>;
  }

  const max = Math.max(...data.map(d => d.value), 1);
  const padding = { top: 10, right: 10, bottom: 20, left: 40 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;
  const stepX = chartW / (data.length - 1);

  const points = data
    .map((d, i) => {
      const x = padding.left + i * stepX;
      const y = padding.top + chartH - (d.value / max) * chartH;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto" aria-label="增长趋势图">
      {/* Grid lines */}
      {[0, 0.25, 0.5, 0.75, 1].map(ratio => {
        const y = padding.top + chartH - ratio * chartH;
        return (
          <g key={ratio}>
            <line x1={padding.left} y1={y} x2={width - padding.right} y2={y} stroke="#e4e4e7" strokeWidth="0.5" />
            <text x={padding.left - 5} y={y + 4} textAnchor="end" fill="#a1a1aa" fontSize="10">
              {Math.round(max * ratio)}
            </text>
          </g>
        );
      })}

      {/* Area fill */}
      <polygon
        points={`${padding.left},${padding.top + chartH} ${points} ${width - padding.right},${padding.top + chartH}`}
        fill="rgba(4, 120, 87, 0.08)"
      />

      {/* Line */}
      <polyline
        points={points}
        fill="none"
        stroke="#047857"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Dots */}
      {data.map((d, i) => {
        const x = padding.left + i * stepX;
        const y = padding.top + chartH - (d.value / max) * chartH;
        return (
          <circle key={i} cx={x} cy={y} r="3" fill="#047857" stroke="white" strokeWidth="1.5" />
        );
      })}

      {/* Labels */}
      {data.filter((_, i) => i % Math.max(1, Math.floor(data.length / 6)) === 0).map((d, i) => {
        const actualIndex = i * Math.max(1, Math.floor(data.length / 6));
        const x = padding.left + actualIndex * stepX;
        return (
          <text key={i} x={x} y={height - 3} textAnchor="middle" fill="#a1a1aa" fontSize="10">
            {data[actualIndex]?.label ?? ''}
          </text>
        );
      })}
    </svg>
  );
}
