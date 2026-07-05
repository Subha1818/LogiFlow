/**
 * Kruskal's Minimum Spanning Tree Algorithm
 * 
 * Finds the MST (or Minimum Spanning Forest for disconnected graphs)
 * using a Union-Find (Disjoint Set Union) data structure for
 * efficient cycle detection.
 * 
 * Time Complexity: O(E log E) for sorting + O(E α(V)) for union-find ≈ O(E log E)
 * Space Complexity: O(V + E)
 */

/**
 * Union-Find (Disjoint Set Union) with path compression and union by rank.
 */
class UnionFind {
  constructor(elements) {
    this.parent = new Map();
    this.rank = new Map();
    for (const el of elements) {
      this.parent.set(el, el);
      this.rank.set(el, 0);
    }
  }

  /**
   * Find the root/representative of the set containing x.
   * Uses path compression for amortized near-constant time.
   */
  find(x) {
    if (this.parent.get(x) !== x) {
      this.parent.set(x, this.find(this.parent.get(x)));
    }
    return this.parent.get(x);
  }

  /**
   * Merge the sets containing x and y.
   * Uses union by rank to keep trees shallow.
   * @returns {boolean} true if merge happened (were in different sets), false if same set (cycle!)
   */
  union(x, y) {
    const rootX = this.find(x);
    const rootY = this.find(y);

    if (rootX === rootY) return false; // Same set — would create a cycle

    const rankX = this.rank.get(rootX);
    const rankY = this.rank.get(rootY);

    if (rankX < rankY) {
      this.parent.set(rootX, rootY);
    } else if (rankX > rankY) {
      this.parent.set(rootY, rootX);
    } else {
      this.parent.set(rootY, rootX);
      this.rank.set(rootX, rankX + 1);
    }

    return true;
  }

  /**
   * Get a snapshot of the current parent state for trace visualization.
   */
  getState() {
    const state = {};
    for (const [key, val] of this.parent) {
      state[key] = this.find(key); // Also triggers path compression
    }
    return state;
  }
}

/**
 * Runs Kruskal's algorithm with step-by-step trace recording.
 * 
 * @param {Array<{from: string, to: string, weight: number}>} edges - All edges in the graph
 * @param {string[]} nodes - All node names in the graph
 * @returns {{
 *   mstEdges: Array<{from: string, to: string, weight: number}>,
 *   totalCost: number,
 *   steps: Array<{
 *     stepNumber: number,
 *     edge: {from: string, to: string, weight: number},
 *     action: 'accepted' | 'rejected',
 *     reason: string,
 *     parentState: Object,
 *     mstEdgesSoFar: Array<{from: string, to: string, weight: number}>,
 *     costSoFar: number,
 *     highlightNodes: string[],
 *     highlightEdges: Array<{from: string, to: string}>
 *   }>,
 *   isForest: boolean,
 *   componentCount: number,
 *   edgesConsidered: number,
 *   comparisons: number
 * }}
 */
export function kruskal(edges, nodes) {
  // Sort edges by weight (ascending)
  const sortedEdges = [...edges].sort((a, b) => a.weight - b.weight);

  const uf = new UnionFind(nodes);
  const mstEdges = [];
  const steps = [];
  let stepNumber = 0;
  let totalCost = 0;
  let comparisons = 0;

  // Record initial state
  steps.push({
    stepNumber: stepNumber++,
    edge: null,
    action: 'init',
    reason: `Sorted ${sortedEdges.length} edges by weight. Starting with ${nodes.length} individual components.`,
    parentState: uf.getState(),
    mstEdgesSoFar: [],
    costSoFar: 0,
    highlightNodes: [],
    highlightEdges: [],
  });

  for (const edge of sortedEdges) {
    comparisons++;

    const merged = uf.union(edge.from, edge.to);

    if (merged) {
      // Edge accepted — connects two different components
      mstEdges.push(edge);
      totalCost += edge.weight;

      steps.push({
        stepNumber: stepNumber++,
        edge,
        action: 'accepted',
        reason: `"${edge.from}" and "${edge.to}" are in different components → edge accepted (weight: ${edge.weight})`,
        parentState: uf.getState(),
        mstEdgesSoFar: [...mstEdges],
        costSoFar: totalCost,
        highlightNodes: [edge.from, edge.to],
        highlightEdges: mstEdges.map(e => ({ from: e.from, to: e.to })),
      });
    } else {
      // Edge rejected — would create a cycle
      steps.push({
        stepNumber: stepNumber++,
        edge,
        action: 'rejected',
        reason: `"${edge.from}" and "${edge.to}" are already connected → edge rejected (would create cycle)`,
        parentState: uf.getState(),
        mstEdgesSoFar: [...mstEdges],
        costSoFar: totalCost,
        highlightNodes: [edge.from, edge.to],
        highlightEdges: mstEdges.map(e => ({ from: e.from, to: e.to })),
      });
    }

    // Early termination: MST has V-1 edges
    if (mstEdges.length === nodes.length - 1) break;
  }

  // Count connected components in the result
  const roots = new Set();
  for (const node of nodes) {
    roots.add(uf.find(node));
  }
  const componentCount = roots.size;
  const isForest = componentCount > 1;

  // Record final step
  steps.push({
    stepNumber: stepNumber++,
    edge: null,
    action: 'complete',
    reason: isForest
      ? `Minimum Spanning Forest complete: ${componentCount} components, ${mstEdges.length} edges, total cost: ${totalCost}. The graph is disconnected — a single spanning tree covering all locations isn't possible.`
      : `Minimum Spanning Tree complete: ${mstEdges.length} edges, total cost: ${totalCost}`,
    parentState: uf.getState(),
    mstEdgesSoFar: [...mstEdges],
    costSoFar: totalCost,
    highlightNodes: nodes,
    highlightEdges: mstEdges.map(e => ({ from: e.from, to: e.to })),
  });

  return {
    mstEdges,
    totalCost,
    steps,
    isForest,
    componentCount,
    edgesConsidered: comparisons,
    comparisons,
  };
}
