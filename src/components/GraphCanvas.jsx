import { useEffect, useRef, useState, forwardRef, useImperativeHandle, useCallback } from 'react';
import { Network } from 'vis-network';
import { DataSet } from 'vis-data';

const GraphCanvas = forwardRef(function GraphCanvas({
  graphData,
  shortestPath,
  mstResult,
  traceStepData,
  theme,
}, ref) {
  const containerRef = useRef(null);
  const networkRef = useRef(null);
  const nodesDatasetRef = useRef(null);
  const edgesDatasetRef = useRef(null);
  const [physicsEnabled, setPhysicsEnabled] = useState(true);

  const isDark = theme === 'dark';
  const colors = {
    nodeBg: isDark ? '#334155' : '#ffffff',
    nodeBorder: isDark ? '#64748b' : '#cbd5e1',
    nodeText: isDark ? '#f1f5f9' : '#0f172a',
    edgeColor: isDark ? '#475569' : '#94a3b8',
    edgeText: isDark ? '#94a3b8' : '#64748b',
    pathNode: '#10b981',
    pathEdge: '#10b981',
    pathNodeBg: isDark ? '#064e3b' : '#d1fae5',
    mstEdge: '#f59e0b',
    mstNode: '#f59e0b',
    mstNodeBg: isDark ? '#78350f' : '#fef3c7',
    traceNode: '#06b6d4',
    traceEdge: '#06b6d4',
    background: isDark ? '#1e293b' : '#ffffff',
  };

  const fitToScreen = useCallback(() => {
    networkRef.current?.fit({
      animation: { duration: 500, easingFunction: 'easeInOutQuad' },
      minZoomLevel: 0.35,
      maxZoomLevel: 1.35,
    });
  }, []);

  useEffect(() => {
    if (!graphData || !containerRef.current) return;

    const denseGraph = graphData.nodes.length > 12;
    const nodesDataset = new DataSet(
      graphData.nodes.map(name => ({
        id: name,
        label: name,
        font: {
          size: denseGraph ? 11 : 13,
          face: 'Inter',
          color: colors.nodeText,
          strokeWidth: isDark ? 4 : 5,
          strokeColor: colors.background,
          vadjust: 20,
        },
        color: {
          background: colors.nodeBg,
          border: colors.nodeBorder,
          highlight: { background: colors.nodeBg, border: '#06b6d4' },
          hover: { background: colors.nodeBg, border: '#06b6d4' },
        },
        shape: 'dot',
        size: denseGraph ? 15 : 18,
        borderWidth: 2,
        shadow: { enabled: true, size: 6, x: 0, y: 2, color: 'rgba(0,0,0,0.15)' },
      }))
    );

    const edgesDataset = new DataSet(
      graphData.edges.map(edge => ({
        id: `${edge.from}-${edge.to}`,
        from: edge.from,
        to: edge.to,
        label: String(edge.weight),
        font: { size: 10, face: 'JetBrains Mono', color: colors.edgeText, strokeWidth: 3, strokeColor: colors.background },
        color: { color: colors.edgeColor, highlight: '#06b6d4', hover: '#06b6d4' },
        width: 1.5,
        smooth: { type: 'continuous' },
        arrows: { to: false },
      }))
    );

    nodesDatasetRef.current = nodesDataset;
    edgesDatasetRef.current = edgesDataset;

    const options = {
      autoResize: true,
      physics: {
        enabled: true,
        solver: 'forceAtlas2Based',
        forceAtlas2Based: {
          gravitationalConstant: denseGraph ? -75 : -55,
          centralGravity: 0.018,
          springLength: denseGraph ? 175 : 165,
          springConstant: 0.04,
          damping: 0.42,
        },
        stabilization: {
          enabled: true,
          iterations: denseGraph ? 350 : 250,
          fit: true,
        },
      },
      interaction: {
        hover: true,
        tooltipDelay: 200,
        zoomView: true,
        dragView: true,
        dragNodes: true,
        keyboard: {
          enabled: true,
          bindToWindow: false,
        },
      },
      nodes: {
        labelHighlightBold: false,
      },
      edges: {
        font: { size: 10, face: 'JetBrains Mono', align: 'top' },
        smooth: { type: 'continuous' },
      },
      layout: {
        improvedLayout: true,
      },
    };

    const network = new Network(containerRef.current, { nodes: nodesDataset, edges: edgesDataset }, options);
    networkRef.current = network;
    setPhysicsEnabled(true);

    const fitGraph = (animation = true) => {
      if (!networkRef.current) return;
      network.fit({
        animation: animation ? { duration: 500, easingFunction: 'easeInOutQuad' } : false,
        minZoomLevel: 0.35,
        maxZoomLevel: 1.35,
      });
    };

    network.once('stabilizationIterationsDone', () => {
      network.setOptions({ physics: { enabled: false } });
      setPhysicsEnabled(false);
      requestAnimationFrame(() => fitGraph(true));
    });

    const fitTimer = window.setTimeout(() => fitGraph(false), 400);
    const resizeObserver = new ResizeObserver(() => {
      requestAnimationFrame(() => fitGraph(true));
    });
    resizeObserver.observe(containerRef.current);

    network.on('hoverNode', (params) => {
      const nodeId = params.node;
      const neighbors = graphData.adjacencyList.get(nodeId) || [];
      const title = `${nodeId}\nConnections: ${neighbors.length}\n${neighbors.map(n => `-> ${n.node} (${n.weight})`).join('\n')}`;
      nodesDataset.update({ id: nodeId, title });
    });

    network.on('hoverEdge', (params) => {
      const edgeData = edgesDataset.get(params.edge);
      if (edgeData) {
        edgesDataset.update({ id: params.edge, title: `${edgeData.from} <-> ${edgeData.to}\nDistance: ${edgeData.label}` });
      }
    });

    return () => {
      window.clearTimeout(fitTimer);
      resizeObserver.disconnect();
      network.destroy();
      networkRef.current = null;
    };
  }, [graphData, theme]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!nodesDatasetRef.current || !edgesDatasetRef.current || !graphData) return;

    const nodesDs = nodesDatasetRef.current;
    const edgesDs = edgesDatasetRef.current;

    const resetNodes = graphData.nodes.map(name => ({
      id: name,
      color: {
        background: colors.nodeBg,
        border: colors.nodeBorder,
        highlight: { background: colors.nodeBg, border: '#06b6d4' },
        hover: { background: colors.nodeBg, border: '#06b6d4' },
      },
      size: graphData.nodes.length > 12 ? 15 : 18,
      borderWidth: 2,
    }));

    const resetEdges = graphData.edges.map(edge => ({
      id: `${edge.from}-${edge.to}`,
      color: { color: colors.edgeColor, highlight: '#06b6d4', hover: '#06b6d4' },
      width: 1.5,
    }));

    nodesDs.update(resetNodes);
    edgesDs.update(resetEdges);

    if (mstResult?.mstEdges) {
      const mstNodeSet = new Set();
      for (const edge of mstResult.mstEdges) {
        mstNodeSet.add(edge.from);
        mstNodeSet.add(edge.to);

        const edgeId1 = `${edge.from}-${edge.to}`;
        const edgeId2 = `${edge.to}-${edge.from}`;
        const existingId = edgesDs.get(edgeId1) ? edgeId1 : edgeId2;
        if (edgesDs.get(existingId)) {
          edgesDs.update({
            id: existingId,
            color: { color: colors.mstEdge, highlight: colors.mstEdge, hover: colors.mstEdge },
            width: 3,
          });
        }
      }
      for (const nodeId of mstNodeSet) {
        nodesDs.update({
          id: nodeId,
          color: {
            background: colors.mstNodeBg,
            border: colors.mstNode,
            highlight: { background: colors.mstNodeBg, border: colors.mstNode },
            hover: { background: colors.mstNodeBg, border: colors.mstNode },
          },
          borderWidth: 2.5,
        });
      }
    }

    if (shortestPath?.path) {
      for (let i = 0; i < shortestPath.path.length; i++) {
        const nodeId = shortestPath.path[i];
        nodesDs.update({
          id: nodeId,
          color: {
            background: colors.pathNodeBg,
            border: colors.pathNode,
            highlight: { background: colors.pathNodeBg, border: colors.pathNode },
            hover: { background: colors.pathNodeBg, border: colors.pathNode },
          },
          size: 22,
          borderWidth: 3,
        });

        if (i < shortestPath.path.length - 1) {
          const from = shortestPath.path[i];
          const to = shortestPath.path[i + 1];
          const edgeId1 = `${from}-${to}`;
          const edgeId2 = `${to}-${from}`;
          const existingId = edgesDs.get(edgeId1) ? edgeId1 : edgeId2;
          if (edgesDs.get(existingId)) {
            edgesDs.update({
              id: existingId,
              color: { color: colors.pathEdge, highlight: colors.pathEdge, hover: colors.pathEdge },
              width: 4,
            });
          }
        }
      }
    }

    if (traceStepData) {
      for (const nodeId of (traceStepData.highlightNodes || [])) {
        if (nodesDs.get(nodeId)) {
          nodesDs.update({
            id: nodeId,
            color: {
              background: isDark ? '#164e63' : '#cffafe',
              border: colors.traceNode,
              highlight: { background: isDark ? '#164e63' : '#cffafe', border: colors.traceNode },
              hover: { background: isDark ? '#164e63' : '#cffafe', border: colors.traceNode },
            },
            size: 24,
            borderWidth: 3,
          });
        }
      }

      for (const edge of (traceStepData.highlightEdges || [])) {
        const edgeId1 = `${edge.from}-${edge.to}`;
        const edgeId2 = `${edge.to}-${edge.from}`;
        const existingId = edgesDs.get(edgeId1) ? edgeId1 : edgeId2;
        if (existingId && edgesDs.get(existingId)) {
          edgesDs.update({
            id: existingId,
            color: { color: colors.traceEdge, highlight: colors.traceEdge, hover: colors.traceEdge },
            width: 4,
          });
        }
      }
    }
  }, [shortestPath, mstResult, traceStepData, graphData, theme]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (networkRef.current) {
      networkRef.current.setOptions({
        nodes: {
          font: { color: colors.nodeText, strokeColor: colors.background },
        },
      });
      requestAnimationFrame(() => fitToScreen());
    }
  }, [theme, fitToScreen]); // eslint-disable-line react-hooks/exhaustive-deps

  const resetLayout = useCallback(() => {
    if (networkRef.current) {
      networkRef.current.setOptions({ physics: { enabled: true } });
      setPhysicsEnabled(true);
      window.setTimeout(() => {
        networkRef.current?.stabilize(250);
        window.setTimeout(() => fitToScreen(), 500);
      }, 100);
    }
  }, [fitToScreen]);

  const togglePhysics = useCallback(() => {
    const newState = !physicsEnabled;
    setPhysicsEnabled(newState);
    networkRef.current?.setOptions({ physics: { enabled: newState } });
  }, [physicsEnabled]);

  useImperativeHandle(ref, () => ({
    fitToScreen,
    resetLayout,
    togglePhysics,
    getNetwork: () => networkRef.current,
  }), [fitToScreen, resetLayout, togglePhysics]);

  return (
    <div className="h-full w-full relative graph-container dashboard-graph-canvas" style={{ background: colors.background }}>
      <div ref={containerRef} className="w-full h-full" />

      <div className="absolute top-3 right-3 flex flex-wrap justify-end gap-1.5 z-10 max-w-[220px]">
        <ToolbarButton
          onClick={fitToScreen}
          title="Fit to screen"
          icon={
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
            </svg>
          }
        />
        <ToolbarButton
          onClick={resetLayout}
          title="Reset layout"
          icon={
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 4v6h6M23 20v-6h-6" />
              <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" />
            </svg>
          }
        />
        <ToolbarButton
          onClick={togglePhysics}
          title={physicsEnabled ? 'Freeze layout' : 'Enable physics'}
          active={physicsEnabled}
          icon={
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
          }
        />
      </div>

      {!graphData && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text-tertiary)', opacity: 0.4 }}>
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
          <p className="mt-4 text-sm font-medium" style={{ color: 'var(--text-tertiary)' }}>No graph loaded</p>
          <p className="text-xs mt-1" style={{ color: 'var(--text-tertiary)', opacity: 0.7 }}>Upload a dataset or select a demo to get started</p>
        </div>
      )}

      {graphData && (shortestPath?.path || mstResult?.mstEdges) && (
        <div
          className="absolute bottom-3 left-3 rounded-lg px-3 py-2 text-[0.6rem] flex flex-col gap-1 z-10 fade-in"
          style={{ background: isDark ? 'rgba(15,23,42,0.85)' : 'rgba(255,255,255,0.9)', border: '1px solid var(--border-color)', backdropFilter: 'blur(8px)' }}
        >
          {shortestPath?.path && (
            <div className="flex items-center gap-2">
              <div className="w-4 h-0.5 rounded" style={{ background: colors.pathEdge }} />
              <span style={{ color: 'var(--text-secondary)' }}>Shortest Path</span>
            </div>
          )}
          {mstResult?.mstEdges && (
            <div className="flex items-center gap-2">
              <div className="w-4 h-0.5 rounded" style={{ background: colors.mstEdge }} />
              <span style={{ color: 'var(--text-secondary)' }}>Optimized Network (MST)</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
});

function ToolbarButton({ onClick, title, icon, active }) {
  return (
    <button
      onClick={onClick}
      title={title}
      className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:scale-110"
      style={{
        background: active ? 'var(--color-brand-500)' : 'var(--bg-secondary)',
        color: active ? 'white' : 'var(--text-secondary)',
        border: '1px solid var(--border-color)',
        boxShadow: 'var(--card-shadow)',
      }}
    >
      {icon}
    </button>
  );
}

export default GraphCanvas;
