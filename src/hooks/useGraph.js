import { useState, useCallback } from 'react';
import { parseDataset } from '../utils/parser';
import { buildAdjacencyList, computeStats, getNodeNames } from '../algorithms/graphUtils';
import { validateNonNegativeWeights } from '../algorithms/dijkstra';
import { presets } from '../data/presets';

export function useGraph() {
  const [graphData, setGraphData] = useState(null); // { edges, nodes, adjacencyList }
  const [parseSummary, setParseSummary] = useState(null);
  const [stats, setStats] = useState(null);
  const [negativeWeightWarning, setNegativeWeightWarning] = useState(null);

  const loadGraphData = useCallback((rawText, sourceName, onReset) => {
    const result = parseDataset(rawText);
    const { edges, skippedRows, warnings, nodeCount, edgeCount } = result;

    if (edges.length === 0) {
      setParseSummary({
        success: false,
        message: 'No valid edges found in the dataset.',
        skippedRows,
        warnings,
        sourceName,
      });
      return;
    }

    const nodes = getNodeNames(edges);
    const adjacencyList = buildAdjacencyList(edges);
    const graphStats = computeStats(adjacencyList, edges);

    // Check for negative weights
    const validation = validateNonNegativeWeights(adjacencyList);
    if (!validation.valid) {
      setNegativeWeightWarning(
        `Warning: ${validation.negativeEdges.length} edge(s) have negative weights. Dijkstra's algorithm requires non-negative weights and may produce incorrect results.`
      );
    } else {
      setNegativeWeightWarning(null);
    }

    setGraphData({ edges, nodes, adjacencyList });
    setStats(graphStats);
    setParseSummary({
      success: true,
      nodeCount,
      edgeCount,
      skippedRows,
      warnings,
      sourceName,
    });

    // Invoke cleanups for algorithm and trace states in parent/peer
    if (typeof onReset === 'function') {
      onReset();
    }
  }, []);

  const loadPreset = useCallback((presetId, onReset) => {
    const preset = presets.find(p => p.id === presetId);
    if (preset) {
      loadGraphData(preset.data, preset.name, onReset);
    }
  }, [loadGraphData]);

  const handleFileUpload = useCallback((file, onReset) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      loadGraphData(e.target.result, file.name, onReset);
    };
    reader.readAsText(file);
  }, [loadGraphData]);

  return {
    graphData,
    parseSummary,
    stats,
    setStats,
    negativeWeightWarning,
    loadGraphData,
    loadPreset,
    handleFileUpload,
  };
}
