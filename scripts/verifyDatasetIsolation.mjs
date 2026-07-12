import { presets } from '../src/data/presets.js';
import { parseDataset } from '../src/utils/parser.js';
import { buildAdjacencyList, getNodeNames } from '../src/algorithms/graphUtils.js';
import { dijkstra } from '../src/algorithms/dijkstra.js';
import { kruskal } from '../src/algorithms/kruskal.js';

let previousNodes = new Set();

for (const preset of presets) {
  const parsed = parseDataset(preset.data);
  const nodes = getNodeNames(parsed.edges);
  const nodeSet = new Set(nodes);
  const adjacencyList = buildAdjacencyList(parsed.edges);

  const [source, destination] = nodes;
  const shortestPath = dijkstra(adjacencyList, source, destination);
  const mstResult = kruskal(parsed.edges, nodes);

  assertDijkstraNodes(`${preset.name} Dijkstra`, shortestPath.steps, nodeSet);
  assertKruskalNodes(`${preset.name} Kruskal`, mstResult.steps, nodeSet);

  for (const node of previousNodes) {
    if (!nodeSet.has(node) && appearsInDijkstra(shortestPath.steps, node)) {
      throw new Error(`${preset.name}: stale previous-dataset node "${node}" leaked into Dijkstra trace.`);
    }
  }

  previousNodes = nodeSet;
}

console.log('Dataset isolation sanity check passed.');

function assertDijkstraNodes(label, steps, currentNodes) {
  for (const step of steps) {
    for (const node of Object.keys(step.distanceTable || {})) {
      assertCurrentNode(label, node, currentNodes);
    }
    for (const node of step.finalized || []) {
      assertCurrentNode(label, node, currentNodes);
    }
    for (const node of step.highlightNodes || []) {
      assertCurrentNode(label, node, currentNodes);
    }
  }
}

function assertKruskalNodes(label, steps, currentNodes) {
  for (const step of steps) {
    if (step.edge) {
      assertCurrentNode(label, step.edge.from, currentNodes);
      assertCurrentNode(label, step.edge.to, currentNodes);
    }
    for (const edge of step.mstEdgesSoFar || []) {
      assertCurrentNode(label, edge.from, currentNodes);
      assertCurrentNode(label, edge.to, currentNodes);
    }
  }
}

function appearsInDijkstra(steps, node) {
  return steps.some(step =>
    Object.prototype.hasOwnProperty.call(step.distanceTable || {}, node) ||
    (step.finalized || []).includes(node) ||
    (step.highlightNodes || []).includes(node)
  );
}

function assertCurrentNode(label, node, currentNodes) {
  if (!currentNodes.has(node)) {
    throw new Error(`${label}: unexpected node "${node}" not found in current dataset.`);
  }
}
