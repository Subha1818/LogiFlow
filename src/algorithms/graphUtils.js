/**
 * Graph Utility Functions
 * 
 * Pure utility functions for building and analyzing graph data structures.
 * No React dependencies — these are reusable in any context.
 */

/**
 * Build an adjacency list from a list of edges.
 * The graph is undirected: each edge creates entries in both directions.
 * 
 * @param {Array<{from: string, to: string, weight: number}>} edges
 * @returns {Map<string, Array<{node: string, weight: number}>>}
 */
export function buildAdjacencyList(edges) {
  const adj = new Map();

  for (const { from, to, weight } of edges) {
    if (!adj.has(from)) adj.set(from, []);
    if (!adj.has(to)) adj.set(to, []);
    adj.get(from).push({ node: to, weight });
    adj.get(to).push({ node: from, weight });
  }

  return adj;
}

/**
 * Compute comprehensive graph statistics.
 * 
 * @param {Map<string, Array<{node: string, weight: number}>>} adjacencyList
 * @param {Array<{from: string, to: string, weight: number}>} edges
 * @returns {{
 *   nodeCount: number,
 *   edgeCount: number,
 *   avgWeight: number,
 *   density: number,
 *   longestRoute: { from: string, to: string, weight: number } | null,
 *   minWeight: number | null,
 *   maxWeight: number | null
 * }}
 */
export function computeStats(adjacencyList, edges) {
  const nodeCount = adjacencyList.size;
  const edgeCount = edges.length;

  if (edgeCount === 0) {
    return {
      nodeCount,
      edgeCount,
      avgWeight: 0,
      density: 0,
      longestRoute: null,
      minWeight: null,
      maxWeight: null,
    };
  }

  const weights = edges.map(e => e.weight);
  const totalWeight = weights.reduce((sum, w) => sum + w, 0);
  const avgWeight = totalWeight / edgeCount;

  // Graph density = 2E / (V * (V - 1)) for undirected graph
  const maxPossibleEdges = (nodeCount * (nodeCount - 1)) / 2;
  const density = maxPossibleEdges > 0 ? edgeCount / maxPossibleEdges : 0;

  const minWeight = Math.min(...weights);
  const maxWeight = Math.max(...weights);

  // Find the longest route (highest weight edge)
  const longestRoute = edges.reduce((max, edge) =>
    edge.weight > (max?.weight ?? -Infinity) ? edge : max, null
  );

  return {
    nodeCount,
    edgeCount,
    avgWeight: Math.round(avgWeight * 100) / 100,
    density: Math.round(density * 1000) / 1000,
    longestRoute,
    minWeight,
    maxWeight,
  };
}

/**
 * Find connected components using BFS.
 * 
 * @param {Map<string, Array<{node: string, weight: number}>>} adjacencyList
 * @returns {Array<Set<string>>} - Array of sets, each set is one connected component
 */
export function getConnectedComponents(adjacencyList) {
  const visited = new Set();
  const components = [];

  for (const node of adjacencyList.keys()) {
    if (visited.has(node)) continue;

    const component = new Set();
    const queue = [node];

    while (queue.length > 0) {
      const current = queue.shift();
      if (visited.has(current)) continue;
      visited.add(current);
      component.add(current);

      for (const { node: neighbor } of (adjacencyList.get(current) || [])) {
        if (!visited.has(neighbor)) {
          queue.push(neighbor);
        }
      }
    }

    components.push(component);
  }

  return components;
}

/**
 * Get all unique node names from edges, sorted alphabetically.
 * @param {Array<{from: string, to: string, weight: number}>} edges
 * @returns {string[]}
 */
export function getNodeNames(edges) {
  const nodes = new Set();
  for (const { from, to } of edges) {
    nodes.add(from);
    nodes.add(to);
  }
  return Array.from(nodes).sort();
}
