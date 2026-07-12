import { useState, useCallback, useEffect, useRef } from 'react';
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

  useEffect(() => {
    const previousOverflowX = document.body.style.overflowX;
    const previousOverflowY = document.body.style.overflowY;

    document.body.style.overflowX = 'hidden';
    document.body.style.overflowY = 'auto';

    return () => {
      document.body.style.overflowX = previousOverflowX;
      document.body.style.overflowY = previousOverflowY;
    };
  }, []);

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
    <div className="min-h-screen w-screen overflow-x-hidden animate-fade-in dashboard-page" style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      {/* Top Navbar */}
      <Navbar
        theme={theme}
        toggleTheme={toggleTheme}
        onExport={handleExport}
        hasData={!!graphData}
        onAbout={() => setShowAbout(true)}
      />

      <main className="mx-auto flex w-full max-w-[1440px] flex-col gap-6 px-4 pb-8 pt-8 md:px-6">
        {/* Main Layout: Sidebar | Graph */}
        <section className="dashboard-workspace grid gap-5 animate-slide-up">
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
          <section className="network-visualization overflow-hidden">
            <div className="network-visualization-header">
              <div>
                <p className="dashboard-eyebrow">Network Visualization</p>
                <h2>Route Graph</h2>
              </div>
              <div className="network-view-placeholder" aria-hidden="true">
                Graph View
              </div>
            </div>
            <div className="network-visualization-body">
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
          </section>
        </section>

        <section className="analysis-results-section">
          <div className="analysis-results-header">
            <div>
              <p className="dashboard-eyebrow">Analysis Results</p>
              <h2>Route Performance & Optimized Network</h2>
            </div>
            <p>Statistics, shortest path output, and minimum spanning network details update as you run the tools.</p>
          </div>
          <StatsCards stats={stats} />
          <ResultsPanel
            shortestPath={shortestPath}
            mstResult={mstResult}
            onExport={handleExport}
          />
          {activeTrace && (
            <div className="analysis-trace-card">
              <AlgorithmTrace
                type={activeTrace.type}
                steps={activeTrace.steps}
                currentStep={traceStep}
                onStepChange={setTraceStep}
                graphNodes={graphData?.nodes || []}
              />
            </div>
          )}
        </section>
      </main>

      {/* About Modal */}
      {showAbout && <AboutModal onClose={() => setShowAbout(false)} />}
    </div>
  );
}
