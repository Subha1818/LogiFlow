/**
 * Dijkstra's Shortest Path Algorithm
 * 
 * Finds the shortest path between two nodes in a weighted graph
 * with non-negative edge weights. Returns the path, total distance,
 * and a step-by-step trace for visualization.
 * 
 * Time Complexity: O((V + E) log V) with a min-heap
 * Space Complexity: O(V)
 */

/**
 * Simple MinHeap implementation for Dijkstra's priority queue.
 */
class MinHeap {
  constructor() {
    this.heap = [];
  }

  push(item) {
    this.heap.push(item);
    this._bubbleUp(this.heap.length - 1);
  }

  pop() {
    if (this.heap.length === 0) return null;
    const min = this.heap[0];
    const last = this.heap.pop();
    if (this.heap.length > 0) {
      this.heap[0] = last;
      this._sinkDown(0);
    }
    return min;
  }

  get size() {
    return this.heap.length;
  }

  _bubbleUp(i) {
    while (i > 0) {
      const parent = Math.floor((i - 1) / 2);
      if (this.heap[parent].dist <= this.heap[i].dist) break;
      [this.heap[parent], this.heap[i]] = [this.heap[i], this.heap[parent]];
      i = parent;
    }
  }

  _sinkDown(i) {
    const n = this.heap.length;
    while (true) {
      let smallest = i;
      const left = 2 * i + 1;
      const right = 2 * i + 2;
      if (left < n && this.heap[left].dist < this.heap[smallest].dist) smallest = left;
      if (right < n && this.heap[right].dist < this.heap[smallest].dist) smallest = right;
      if (smallest === i) break;
      [this.heap[smallest], this.heap[i]] = [this.heap[i], this.heap[smallest]];
      i = smallest;
    }
  }
}

/**
 * Validates that all edge weights in the graph are non-negative.
 * @param {Map<string, Array<{node: string, weight: number}>>} adjacencyList
 * @returns {{ valid: boolean, negativeEdges: Array<{from: string, to: string, weight: number}> }}
 */
export function validateNonNegativeWeights(adjacencyList) {
  const negativeEdges = [];
  for (const [from, neighbors] of adjacencyList) {
    for (const { node: to, weight } of neighbors) {
      if (weight < 0) {
        negativeEdges.push({ from, to, weight });
      }
    }
  }
  return { valid: negativeEdges.length === 0, negativeEdges };
}

/**
 * Runs Dijkstra's algorithm with step-by-step trace recording.
 * 
 * @param {Map<string, Array<{node: string, weight: number}>>} adjacencyList - The graph
 * @param {string} source - Starting node
 * @param {string} destination - Target node
 * @returns {{
 *   path: string[] | null,
 *   totalDistance: number | null,
 *   steps: Array<{
 *     stepNumber: number,
 *     currentNode: string,
 *     action: string,
 *     distanceTable: Object,
 *     finalized: string[],
 *     edgeConsidered: {from: string, to: string, weight: number} | null,
 *     highlightNodes: string[],
 *     highlightEdges: Array<{from: string, to: string}>
 *   }>,
 *   nodesVisited: number,
 *   edgesRelaxed: number
 * }}
 */
export function dijkstra(adjacencyList, source, destination) {
  const nodes = Array.from(adjacencyList.keys());
  const dist = new Map();
  const prev = new Map();
  const finalized = new Set();
  const steps = [];
  let stepNumber = 0;
  let edgesRelaxed = 0;
  let nodesVisited = 0;

  // Initialize distances
  for (const node of nodes) {
    dist.set(node, Infinity);
    prev.set(node, null);
  }
  dist.set(source, 0);

  const heap = new MinHeap();
  heap.push({ node: source, dist: 0 });

  // Record initial state
  steps.push({
    stepNumber: stepNumber++,
    currentNode: source,
    action: `Initialize: Set distance to "${source}" = 0, all others = ∞`,
    distanceTable: Object.fromEntries(dist),
    finalized: [],
    edgeConsidered: null,
    highlightNodes: [source],
    highlightEdges: [],
  });

  while (heap.size > 0) {
    const { node: current, dist: currentDist } = heap.pop();

    // Skip if already finalized (stale entry in heap)
    if (finalized.has(current)) continue;

    // If current distance is stale, skip
    if (currentDist > dist.get(current)) continue;

    finalized.add(current);
    nodesVisited++;

    // Record finalization step
    steps.push({
      stepNumber: stepNumber++,
      currentNode: current,
      action: `Finalize "${current}" with distance ${dist.get(current)}`,
      distanceTable: Object.fromEntries(dist),
      finalized: Array.from(finalized),
      edgeConsidered: null,
      highlightNodes: [current],
      highlightEdges: [],
    });

    // If we reached the destination, we can stop
    if (current === destination) break;

    // Relax neighbors
    const neighbors = adjacencyList.get(current) || [];
    for (const { node: neighbor, weight } of neighbors) {
      if (finalized.has(neighbor)) continue;

      const newDist = dist.get(current) + weight;
      edgesRelaxed++;

      if (newDist < dist.get(neighbor)) {
        dist.set(neighbor, newDist);
        prev.set(neighbor, current);
        heap.push({ node: neighbor, dist: newDist });

        steps.push({
          stepNumber: stepNumber++,
          currentNode: current,
          action: `Relax edge "${current}" → "${neighbor}": ${dist.get(current)} + ${weight} = ${newDist} (improved from ${dist.get(neighbor) === Infinity ? '∞' : dist.get(neighbor) + newDist})`,
          distanceTable: Object.fromEntries(dist),
          finalized: Array.from(finalized),
          edgeConsidered: { from: current, to: neighbor, weight },
          highlightNodes: [current, neighbor],
          highlightEdges: [{ from: current, to: neighbor }],
        });
      } else {
        steps.push({
          stepNumber: stepNumber++,
          currentNode: current,
          action: `Check edge "${current}" → "${neighbor}": ${dist.get(current)} + ${weight} = ${newDist} ≥ ${dist.get(neighbor)} (no improvement)`,
          distanceTable: Object.fromEntries(dist),
          finalized: Array.from(finalized),
          edgeConsidered: { from: current, to: neighbor, weight },
          highlightNodes: [current, neighbor],
          highlightEdges: [{ from: current, to: neighbor }],
        });
      }
    }
  }

  // Reconstruct path
  if (!finalized.has(destination)) {
    return {
      path: null,
      totalDistance: null,
      steps,
      nodesVisited,
      edgesRelaxed,
      message: `No path exists between "${source}" and "${destination}" — they are in disconnected components.`,
    };
  }

  const path = [];
  let current = destination;
  while (current !== null) {
    path.unshift(current);
    current = prev.get(current);
  }

  // Record final path step
  const pathEdges = [];
  for (let i = 0; i < path.length - 1; i++) {
    pathEdges.push({ from: path[i], to: path[i + 1] });
  }

  steps.push({
    stepNumber: stepNumber++,
    currentNode: destination,
    action: `Shortest path found: ${path.join(' → ')} (total: ${dist.get(destination)})`,
    distanceTable: Object.fromEntries(dist),
    finalized: Array.from(finalized),
    edgeConsidered: null,
    highlightNodes: [...path],
    highlightEdges: pathEdges,
  });

  return {
    path,
    totalDistance: dist.get(destination),
    steps,
    nodesVisited,
    edgesRelaxed,
  };
}
