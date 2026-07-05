import React, { useState } from 'react';

export default function ExportMenu({ onExport, hasData, label = 'Export', className = '' }) {
  const [exportOpen, setExportOpen] = useState(false);

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setExportOpen(!exportOpen)}
        disabled={!hasData}
        className="h-9 px-3 rounded-lg flex items-center gap-2 text-xs font-medium transition-all hover:scale-105 disabled:opacity-40 disabled:cursor-not-allowed"
        style={{ background: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}
        aria-label="Export results"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
        {label}
      </button>

      {exportOpen && hasData && (
        <>
          {/* Overlay to catch clicks outside the menu */}
          <div className="fixed inset-0 z-40" onClick={() => setExportOpen(false)} />
          <div
            className="absolute right-0 top-full mt-1 rounded-lg shadow-lg py-1 z-50 min-w-[140px] fade-in"
            style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}
          >
            <button
              onClick={() => { onExport('json'); setExportOpen(false); }}
              className="w-full px-4 py-2 text-left text-xs font-medium flex items-center gap-2 hover:opacity-80 transition-opacity"
              style={{ color: 'var(--text-primary)' }}
            >
              <span style={{ color: 'var(--color-brand-500)' }}>{'{ }'}</span> Export as JSON
            </button>
            <button
              onClick={() => { onExport('pdf'); setExportOpen(false); }}
              className="w-full px-4 py-2 text-left text-xs font-medium flex items-center gap-2 hover:opacity-80 transition-opacity"
              style={{ color: 'var(--text-primary)' }}
            >
              <span style={{ color: 'var(--color-path-500)' }}>📄</span> Export as PDF
            </button>
          </div>
        </>
      )}
    </div>
  );
}
