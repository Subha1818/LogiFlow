import { useMemo } from 'react';

const statConfig = [
  { key: 'nodeCount', label: 'Total Locations', icon: '📍', color: 'var(--color-brand-500)', format: v => v ?? 0 },
  { key: 'edgeCount', label: 'Total Routes', icon: '🔗', color: 'var(--color-brand-400)', format: v => v ?? 0 },
  { key: 'shortestDistance', label: 'Shortest Distance', icon: '🎯', color: 'var(--color-path-500)', format: v => v ?? '—' },
  { key: 'mstCost', label: 'Network Cost', icon: '⚡', color: 'var(--color-mst-500)', format: v => v ?? '—' },
  { key: 'avgWeight', label: 'Avg. Weight', icon: '📊', color: 'var(--color-surface-400)', format: v => v ?? '—' },
  { key: 'density', label: 'Density', icon: '🔬', color: 'var(--color-surface-400)', format: v => v != null ? `${(v * 100).toFixed(1)}%` : '—' },
  { key: 'longestRoute', label: 'Longest Route', icon: '📏', color: 'var(--color-surface-400)', format: v => v?.weight ?? '—' },
];

export default function StatsCards({ stats }) {
  const displayStats = useMemo(() => {
    if (!stats) return statConfig.map(s => ({ ...s, value: s.format(null) }));
    return statConfig.map(s => ({ ...s, value: s.format(stats[s.key]) }));
  }, [stats]);

  return (
    <div className="p-3 border-b" style={{ borderColor: 'var(--border-color)' }}>
      <h3 className="text-[0.65rem] font-semibold uppercase tracking-wider mb-2.5" style={{ color: 'var(--text-tertiary)' }}>
        Statistics
      </h3>
      <div className="grid grid-cols-2 gap-2">
        {displayStats.map(({ key, label, icon, color, value }) => (
          <div
            key={key}
            className="rounded-lg p-2.5 transition-all hover:scale-[1.02]"
            style={{
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border-color)',
            }}
          >
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-xs">{icon}</span>
              <span className="text-[0.6rem] font-medium" style={{ color: 'var(--text-tertiary)' }}>
                {label}
              </span>
            </div>
            <p
              className="text-lg font-bold leading-none stat-value-animate"
              style={{ color }}
              key={String(value)} // Re-trigger animation on value change
            >
              {value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
