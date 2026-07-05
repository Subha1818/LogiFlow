import React from 'react';
import FileUpload from './FileUpload';
import RouteSearch from './RouteSearch';
import OptimizeButton from './OptimizeButton';
import RouteHistory from './RouteHistory';

export default function Sidebar({
  graphData,
  parseSummary,
  onFileUpload,
  onLoadPreset,
  onFindRoute,
  onGenerateMST,
  routeHistory,
  onReplayHistory,
  negativeWeightWarning,
}) {
  return (
    <aside
      className="h-full overflow-y-auto flex flex-col"
      style={{
        background: 'var(--bg-sidebar)',
        color: 'var(--sidebar-text)',
        width: '280px',
        flexShrink: 0,
      }}
    >
      {/* Upload Section */}
      <FileUpload
        onFileUpload={onFileUpload}
        onLoadPreset={onLoadPreset}
        parseSummary={parseSummary}
      />

      {/* Route Search Section */}
      <RouteSearch
        graphData={graphData}
        onFindRoute={onFindRoute}
        negativeWeightWarning={negativeWeightWarning}
      />

      {/* Optimization Section */}
      <OptimizeButton
        graphData={graphData}
        onGenerateMST={onGenerateMST}
      />

      {/* Route History Section */}
      <RouteHistory
        routeHistory={routeHistory}
        onReplayHistory={onReplayHistory}
      />
    </aside>
  );
}

