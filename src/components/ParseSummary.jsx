import React, { useState } from 'react';

export default function ParseSummary({ summary }) {
  const [showSkipped, setShowSkipped] = useState(false);
  const [showWarnings, setShowWarnings] = useState(false);

  if (!summary) return null;

  if (!summary.success) {
    return (
      <div className="parse-summary parse-summary-error mt-3 text-xs fade-in">
        {summary.message}
      </div>
    );
  }

  const hasWarnings = summary.warnings.length > 0;

  return (
    <div className="parse-summary parse-summary-success mt-3 text-xs fade-in">
      <div className="flex items-center gap-1.5 mb-1">
        <span className="parse-status-dot" />
        <span className="font-semibold" style={{ color: 'var(--color-path-500)' }}>
          {summary.sourceName}
        </span>
      </div>

      <div className="flex items-center justify-between gap-2">
        <p style={{ color: 'var(--sidebar-text-muted)' }}>
          {summary.nodeCount} locations, {summary.edgeCount} routes
        </p>

        {hasWarnings && (
          <button
            type="button"
            onClick={() => setShowWarnings(current => !current)}
            className="warning-chip"
            aria-expanded={showWarnings}
            title={`${summary.warnings.length} dataset warning(s)`}
          >
            ! {summary.warnings.length}
          </button>
        )}
      </div>

      {hasWarnings && showWarnings && (
        <div className="warning-list mt-2">
          {summary.warnings.map((warning, index) => (
            <p key={index}>{normalizeWarning(warning)}</p>
          ))}
        </div>
      )}

      {summary.skippedRows.length > 0 && (
        <div className="mt-2">
          <button
            onClick={() => setShowSkipped(!showSkipped)}
            className="text-[0.6rem] underline cursor-pointer"
            style={{ color: 'var(--sidebar-text-muted)' }}
          >
            {showSkipped ? 'Hide' : 'Show'} {summary.skippedRows.length} skipped row(s)
          </button>
          {showSkipped && (
            <div className="mt-1 max-h-24 overflow-y-auto">
              {summary.skippedRows.map((row, index) => (
                <div key={index} className="skipped-row">
                  <span className="font-semibold">Line {row.line}:</span>{' '}
                  <span>{row.reason}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function normalizeWarning(warning) {
  return warning
    .replace(/Duplicate edge "([^"]+)"[\s\S]*?"([^"]+)" found/, 'Duplicate edge "$1" <-> "$2" found')
    .replace(/[^\n]+/g, (match) => [...match].map(char => char.charCodeAt(0) > 127 ? ' ' : char).join(''));
}
