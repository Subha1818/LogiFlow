import { useMemo } from 'react';

const statConfig = [
  { key: 'nodeCount', label: 'Total Locations', icon: 'LOC', color: 'var(--color-brand-500)', format: v => v ?? 0 },
  { key: 'edgeCount', label: 'Total Routes', icon: 'RT', color: 'var(--color-brand-400)', format: v => v ?? 0 },
  { key: 'shortestDistance', label: 'Shortest Distance', icon: 'SP', color: 'var(--color-path-500)', format: v => v ?? '-' },
  { key: 'mstCost', label: 'Network Cost', icon: 'MST', color: 'var(--color-mst-500)', format: v => v ?? '-' },
  { key: 'avgWeight', label: 'Avg. Weight', icon: 'AVG', color: 'var(--color-surface-400)', format: v => v ?? '-' },
  { key: 'density', label: 'Density', icon: 'DEN', color: 'var(--color-surface-400)', format: v => v != null ? `${(v * 100).toFixed(1)}%` : '-' },
  { key: 'longestRoute', label: 'Longest Route', icon: 'MAX', color: 'var(--color-surface-400)', format: v => v?.weight ?? '-' },
];

export default function StatsCards({ stats }) {
  const displayStats = useMemo(() => {
    if (!stats) return statConfig.map(s => ({ ...s, value: s.format(null) }));
    return statConfig.map(s => ({ ...s, value: s.format(stats[s.key]) }));
  }, [stats]);

  return (
    <div className="stats-panel">
      <h3 className="text-[0.68rem] font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--text-tertiary)' }}>
        Statistics
      </h3>
      <div className="stats-grid">
        {displayStats.map(({ key, label, icon, color, value }) => (
          <div
            key={key}
            className="stat-card transition-all hover:-translate-y-0.5"
            style={{ borderTopColor: color }}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="stat-icon" style={{ color }}>{icon}</span>
              <span className="text-[0.62rem] font-semibold uppercase tracking-wide" style={{ color: 'var(--text-tertiary)' }}>
                {label}
              </span>
            </div>
            <p
              className="text-2xl font-extrabold leading-none stat-value-animate"
              style={{ color }}
              key={String(value)}
            >
              {value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
