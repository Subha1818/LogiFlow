import React from 'react';

export default function RouteHistory({ routeHistory, onReplayHistory }) {
  if (routeHistory.length === 0) {
    return (
      <div className="sidebar-section flex-1">
        <h3>Route History</h3>
        <p className="text-[0.65rem]" style={{ color: 'var(--color-surface-500)' }}>
          Computed routes will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="sidebar-section flex-1 overflow-y-auto">
      <h3>Route History ({routeHistory.length})</h3>
      <div className="space-y-1 max-h-48 overflow-y-auto">
        {routeHistory.map(entry => (
          <button
            key={entry.id}
            onClick={() => onReplayHistory(entry)}
            className="history-item w-full text-left cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <span className="text-[0.7rem] font-medium" style={{ color: 'var(--color-path-400)' }}>
                {entry.source} → {entry.destination}
              </span>
              <span className="text-[0.55rem]" style={{ color: 'var(--color-surface-500)' }}>
                {entry.timestamp}
              </span>
            </div>
            <p className="text-[0.6rem] mt-0.5" style={{ color: 'var(--sidebar-text-muted)' }}>
              {entry.totalDistance !== null
                ? `Distance: ${entry.totalDistance}`
                : 'No path found'}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
