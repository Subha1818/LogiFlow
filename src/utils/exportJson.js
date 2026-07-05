/**
 * JSON Export Utility
 * 
 * Exports current computation results as a structured JSON file
 * suitable for re-import or programmatic use.
 */

/**
 * Export data as a JSON file download.
 * @param {Object} data - The data to export
 * @param {string} filename - The filename for the download
 */
export function exportAsJson(data, filename = 'logiflow-results.json') {
  const exportData = {
    exportedAt: new Date().toISOString(),
    application: 'LogiFlow',
    ...data,
  };

  const blob = new Blob([JSON.stringify(exportData, null, 2)], {
    type: 'application/json',
  });

  downloadBlob(blob, filename);
}

/**
 * Build export payload from current app state.
 */
export function buildExportPayload({ graphData, shortestPath, mstResult, stats }) {
  const payload = {};

  if (graphData) {
    payload.graph = {
      nodes: graphData.nodes,
      edges: graphData.edges,
    };
  }

  if (stats) {
    payload.statistics = stats;
  }

  if (shortestPath) {
    payload.shortestPath = {
      from: shortestPath.path?.[0] || null,
      to: shortestPath.path?.[shortestPath.path.length - 1] || null,
      path: shortestPath.path,
      totalDistance: shortestPath.totalDistance,
      nodesVisited: shortestPath.nodesVisited,
      edgesRelaxed: shortestPath.edgesRelaxed,
    };
  }

  if (mstResult) {
    payload.optimizedNetwork = {
      edges: mstResult.mstEdges,
      totalCost: mstResult.totalCost,
      isForest: mstResult.isForest,
      componentCount: mstResult.componentCount,
    };
  }

  return payload;
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
