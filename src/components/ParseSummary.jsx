import React, { useState } from 'react';

export default function ParseSummary({ summary }) {
  const [showSkipped, setShowSkipped] = useState(false);

  if (!summary) return null;

  if (!summary.success) {
    return (
      <div className="mt-3 p-2.5 rounded-lg text-xs fade-in" style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#fca5a5' }}>
        ❌ {summary.message}
      </div>
    );
  }

  return (
    <div className="mt-3 p-2.5 rounded-lg text-xs fade-in" style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
      <div className="flex items-center gap-1.5 mb-1">
        <span style={{ color: 'var(--color-path-400)' }}>✓</span>
        <span className="font-medium" style={{ color: 'var(--color-path-400)' }}>
          {summary.sourceName}
        </span>
      </div>
      <p style={{ color: 'var(--sidebar-text-muted)' }}>
        {summary.nodeCount} locations, {summary.edgeCount} routes
      </p>

      {summary.warnings.length > 0 && (
        <div className="mt-1.5 text-[0.6rem]" style={{ color: 'var(--color-mst-400)' }}>
          {summary.warnings.map((w, i) => (
            <p key={i}>⚠ {w}</p>
          ))}
        </div>
      )}

      {summary.skippedRows.length > 0 && (
        <div className="mt-1.5">
          <button
            onClick={() => setShowSkipped(!showSkipped)}
            className="text-[0.6rem] underline cursor-pointer"
            style={{ color: 'var(--sidebar-text-muted)' }}
          >
            {showSkipped ? 'Hide' : 'Show'} {summary.skippedRows.length} skipped row(s)
          </button>
          {showSkipped && (
            <div className="mt-1 max-h-24 overflow-y-auto">
              {summary.skippedRows.map((row, i) => (
                <div key={i} className="text-[0.6rem] mb-1 p-1.5 rounded" style={{ background: 'rgba(239, 68, 68, 0.08)' }}>
                  <span style={{ color: '#fca5a5' }}>Line {row.line}:</span>{' '}
                  <span style={{ color: 'var(--sidebar-text-muted)' }}>{row.reason}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
