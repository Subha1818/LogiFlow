import { useState, useCallback, useEffect } from 'react';
import { dijkstra } from '../algorithms/dijkstra';
import { kruskal } from '../algorithms/kruskal';

export function useAlgorithm(graphData, setStats) {
  const [shortestPath, setShortestPath] = useState(null);
  const [mstResult, setMstResult] = useState(null);
  const [activeTrace, setActiveTrace] = useState(null); // { type: 'dijkstra'|'kruskal', steps }
  const [traceStep, setTraceStep] = useState(0);
  const [routeHistory, setRouteHistory] = useState([]);

  const resetAlgorithmState = useCallback(() => {
    setShortestPath(null);
    setMstResult(null);
    setActiveTrace(null);
    setTraceStep(0);
    setRouteHistory([]);
  }, []);

  useEffect(() => {
    resetAlgorithmState();
  }, [graphData, resetAlgorithmState]);

  const findShortestPath = useCallback((source, destination, stepThrough = false) => {
    if (!graphData) return;
    if (!graphData.nodes.includes(source) || !graphData.nodes.includes(destination)) return;

    const result = dijkstra(graphData.adjacencyList, source, destination);
    setShortestPath(result);

    // Update stats with shortest distance
    if (result.totalDistance !== null) {
      setStats(prev => prev ? { ...prev, shortestDistance: result.totalDistance } : prev);
    }

    // Add to history
    setRouteHistory(prev => [{
      id: Date.now(),
      source,
      destination,
      totalDistance: result.totalDistance,
      path: result.path,
      timestamp: new Date().toLocaleTimeString(),
      message: result.message || null,
    }, ...prev]);

    if (stepThrough) {
      setActiveTrace({ type: 'dijkstra', steps: result.steps });
      setTraceStep(0);
    } else {
      setActiveTrace(null);
      setTraceStep(0);
    }
  }, [graphData, setStats]);

  const generateMST = useCallback((stepThrough = false) => {
    if (!graphData) return;

    const result = kruskal(graphData.edges, graphData.nodes);
    setMstResult(result);

    // Update stats with MST cost
    setStats(prev => prev ? { ...prev, mstCost: result.totalCost } : prev);

    if (stepThrough) {
      setActiveTrace({ type: 'kruskal', steps: result.steps });
      setTraceStep(0);
    } else {
      setActiveTrace(null);
      setTraceStep(0);
    }
  }, [graphData, setStats]);

  const replayHistoryEntry = useCallback((entry) => {
    if (entry.path) {
      setShortestPath({
        path: entry.path,
        totalDistance: entry.totalDistance,
        steps: [],
        nodesVisited: 0,
        edgesRelaxed: 0,
      });
    } else {
      setShortestPath({
        path: null,
        totalDistance: null,
        steps: [],
        nodesVisited: 0,
        edgesRelaxed: 0,
        message: entry.message,
      });
    }
    setActiveTrace(null);
    setTraceStep(0);
  }, []);

  return {
    shortestPath,
    setShortestPath,
    mstResult,
    setMstResult,
    activeTrace,
    setActiveTrace,
    traceStep,
    setTraceStep,
    routeHistory,
    setRouteHistory,
    resetAlgorithmState,
    findShortestPath,
    generateMST,
    replayHistoryEntry,
  };
}
