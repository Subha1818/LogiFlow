import { useState, useCallback, useRef } from 'react';
import { useTheme } from '../hooks/useTheme';
import { useGraph } from '../hooks/useGraph';
import { useAlgorithm } from '../hooks/useAlgorithm';
import { exportAsJson, buildExportPayload } from '../utils/exportJson';
import { exportAsPdf } from '../utils/exportPdf';

import Navbar from './Navbar';
import Sidebar from './Sidebar';
import GraphCanvas from './GraphCanvas';
import StatsCards from './StatsCards';
import ResultsPanel from './ResultsPanel';
import AlgorithmTrace from './AlgorithmTrace';
import AboutModal from './AboutModal';

export default function Dashboard() {
  const { theme, toggleTheme } = useTheme();

  // Graph state hook
  const {
    graphData,
    parseSummary,
    stats,
    setStats,
    negativeWeightWarning,
    loadPreset,
    handleFileUpload,
  } = useGraph();

  // Algorithm state hook
  const {
    shortestPath,
    mstResult,
    activeTrace,
    traceStep,
    setTraceStep,
    routeHistory,
    resetAlgorithmState,
    findShortestPath,
    generateMST,
    replayHistoryEntry,
  } = useAlgorithm(graphData, setStats);

  // UI state
  const [showAbout, setShowAbout] = useState(false);
  const [rightPanelOpen, setRightPanelOpen] = useState(false);

  // Graph canvas ref for highlight control
  const graphRef = useRef(null);

  // Wrapper callbacks to bridge the hooks
  const handlePresetLoad = useCallback((presetId) => {
    loadPreset(presetId, resetAlgorithmState);
  }, [loadPreset, resetAlgorithmState]);

  const handleFileUploadLoad = useCallback((file) => {
    handleFileUpload(file, resetAlgorithmState);
  }, [handleFileUpload, resetAlgorithmState]);

  // ---- Export ----
  const handleExport = useCallback((format) => {
    const payload = buildExportPayload({ graphData, shortestPath, mstResult, stats });
    if (format === 'json') {
      exportAsJson(payload);
    } else if (format === 'pdf') {
      exportAsPdf({ graphData, shortestPath, mstResult, stats });
    }
  }, [graphData, shortestPath, mstResult, stats]);

  // ---- Trace navigation ----
  const traceStepData = activeTrace?.steps?.[traceStep] || null;

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden animate-fade-in" style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      {/* Top Navbar */}
      <Navbar
        theme={theme}
        toggleTheme={toggleTheme}
        onExport={handleExport}
        hasData={!!graphData}
        onAbout={() => setShowAbout(true)}
        onToggleRightPanel={() => setRightPanelOpen(p => !p)}
        rightPanelOpen={rightPanelOpen}
      />

      {/* Main Layout: Sidebar | Graph | Right Panel */}
      <div className="flex-1 flex overflow-hidden app-layout animate-slide-up" style={{ display: 'grid', gridTemplateColumns: '280px 1fr 340px' }}>
        {/* Left Sidebar */}
        <Sidebar
          graphData={graphData}
          parseSummary={parseSummary}
          onFileUpload={handleFileUploadLoad}
          onLoadPreset={handlePresetLoad}
          onFindRoute={findShortestPath}
          onGenerateMST={generateMST}
          routeHistory={routeHistory}
          onReplayHistory={replayHistoryEntry}
          negativeWeightWarning={negativeWeightWarning}
        />

        {/* Center: Graph Canvas */}
        <div className="flex-1 overflow-hidden relative" style={{ minWidth: 0 }}>
          <GraphCanvas
            ref={graphRef}
            graphData={graphData}
            shortestPath={shortestPath}
            mstResult={mstResult}
            traceStepData={traceStepData}
            activeTraceType={activeTrace?.type}
            theme={theme}
          />
        </div>

        {/* Right Panel */}
        <div
          className={`right-panel overflow-y-auto border-l flex flex-col`}
          style={{
            background: 'var(--bg-secondary)',
            borderColor: 'var(--border-color)',
            width: '340px',
          }}
        >
          <StatsCards stats={stats} />
          <ResultsPanel
            shortestPath={shortestPath}
            mstResult={mstResult}
            onExport={handleExport}
          />
          {activeTrace && (
            <AlgorithmTrace
              type={activeTrace.type}
              steps={activeTrace.steps}
              currentStep={traceStep}
              onStepChange={setTraceStep}
            />
          )}
        </div>
      </div>

      {/* About Modal */}
      {showAbout && <AboutModal onClose={() => setShowAbout(false)} />}
    </div>
  );
}
