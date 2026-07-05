export default function AboutModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center modal-overlay" onClick={onClose}>
      <div
        className="rounded-2xl p-6 max-w-md w-full mx-4 fade-in"
        style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--color-brand-500), var(--color-brand-700))' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="6" cy="6" r="2" />
                <circle cx="18" cy="6" r="2" />
                <circle cx="6" cy="18" r="2" />
                <circle cx="18" cy="18" r="2" />
                <circle cx="12" cy="12" r="2" />
                <line x1="7.5" y1="7.5" x2="10.5" y2="10.5" />
                <line x1="13.5" y1="10.5" x2="16.5" y2="7.5" />
                <line x1="7.5" y1="16.5" x2="10.5" y2="13.5" />
                <line x1="13.5" y1="13.5" x2="16.5" y2="16.5" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>LogiFlow</h2>
              <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Logistics Route Planner</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:scale-110"
            style={{ background: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="text-sm leading-relaxed space-y-3" style={{ color: 'var(--text-secondary)' }}>
          <p>
            LogiFlow helps logistics companies plan delivery operations across multiple locations.
            Upload a dataset of locations and distances, visualize the network as an interactive graph,
            and compute optimal routes using industry-standard algorithms.
          </p>

          <div className="rounded-lg p-3" style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}>
            <h3 className="text-xs font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Features</h3>
            <ul className="text-xs space-y-1" style={{ color: 'var(--text-secondary)' }}>
              <li>📁 Upload .txt/.csv datasets or use built-in demos</li>
              <li>🗺️ Interactive graph visualization with zoom, pan, and drag</li>
              <li>🎯 Shortest path finding using Dijkstra's algorithm</li>
              <li>⚡ Optimized network generation using Kruskal's MST</li>
              <li>📊 Step-by-step algorithm tracing</li>
              <li>📥 Export results as JSON or PDF</li>
            </ul>
          </div>

          <div className="rounded-lg p-3" style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}>
            <h3 className="text-xs font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Dataset Format</h3>
            <div className="font-mono text-[0.7rem] space-y-0.5" style={{ color: 'var(--color-brand-400)' }}>
              <p>Source Destination Distance</p>
              <p style={{ color: 'var(--text-tertiary)' }}>— or —</p>
              <p>Source,Destination,Distance</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 text-center" style={{ borderTop: '1px solid var(--border-color)' }}>
          <p className="text-[0.6rem]" style={{ color: 'var(--text-tertiary)' }}>
            Built with React • vis-network • Tailwind CSS
          </p>
        </div>
      </div>
    </div>
  );
}
