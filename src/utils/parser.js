/**
 * Dataset File Parser
 * 
 * Parses .txt and .csv files containing edge data in the format:
 *   Source Destination Weight (space-separated)
 *   Source,Destination,Weight (comma-separated)
 * 
 * Handles validation, duplicate edges, self-loops, and provides
 * detailed error reporting for skipped rows.
 */

/**
 * Configuration for duplicate edge handling.
 * 
 * To switch modes, change this value:
 *   'average' — average the weights of duplicate edges (default)
 *   'first'   — keep the first occurrence, ignore subsequent duplicates
 *   'last'    — keep the last occurrence
 *   'max'     — keep the maximum weight
 *   'min'     — keep the minimum weight
 */
const DUPLICATE_MODE = 'average';

/**
 * Parse raw file content into a list of validated edges.
 * 
 * @param {string} content - Raw file text content
 * @returns {{
 *   edges: Array<{from: string, to: string, weight: number}>,
 *   skippedRows: Array<{line: number, text: string, reason: string}>,
 *   warnings: string[],
 *   nodeCount: number,
 *   edgeCount: number
 * }}
 */
export function parseDataset(content) {
  const lines = content
    .split(/\r?\n/)
    .map((line, i) => ({ text: line.trim(), lineNumber: i + 1 }))
    .filter(({ text }) => text.length > 0 && !text.startsWith('#')); // Skip empty lines and comments

  const rawEdges = [];
  const skippedRows = [];
  const warnings = [];

  for (const { text, lineNumber } of lines) {
    // Auto-detect separator: comma if line contains commas, otherwise spaces
    let parts;
    if (text.includes(',')) {
      parts = text.split(',').map(p => p.trim());
    } else {
      // Split by spaces, but handle multi-word names:
      // Last token is weight, second-to-last could be part of destination
      // Strategy: try splitting from the right - last token must be a number
      parts = text.split(/\s+/);
    }

    // For space-separated, the last token must be the weight (a number)
    // We need at least 3 tokens: source, destination, weight
    if (parts.length < 3) {
      skippedRows.push({
        line: lineNumber,
        text,
        reason: 'Each row must have exactly 3 fields: Source, Destination, and Distance.',
      });
      continue;
    }

    // For space-separated with more than 3 parts, interpret as:
    // Everything except the last token split into two halves? No — simpler:
    // If comma-separated, take first 3 comma-separated values.
    // If space-separated with >3 tokens, last token is weight, 
    // we need to figure out source and destination from the rest.
    // Convention: if space-separated, use exactly 3 tokens (single-word names).
    // For multi-word names, users should use CSV format.
    
    let from, to, weightStr;
    
    if (text.includes(',')) {
      // Comma-separated: first 3 comma-delimited values
      from = parts[0];
      to = parts[1];
      weightStr = parts[2];
    } else {
      // Space-separated: last token is weight, everything else splits evenly
      // For simplicity: last token = weight, first token = source, middle tokens joined = destination
      // Actually, most common: exactly 3 tokens. If more, last = weight, first = source, rest = destination
      weightStr = parts[parts.length - 1];
      from = parts[0];
      to = parts.slice(1, -1).join(' ');
    }

    // Validate: fields must be non-empty
    if (!from || !to) {
      skippedRows.push({
        line: lineNumber,
        text,
        reason: 'Source and Destination names cannot be empty.',
      });
      continue;
    }

    // Validate: weight must be a positive number
    const weight = parseFloat(weightStr);
    if (isNaN(weight)) {
      skippedRows.push({
        line: lineNumber,
        text,
        reason: `Distance "${weightStr}" is not a valid number.`,
      });
      continue;
    }

    if (weight <= 0) {
      skippedRows.push({
        line: lineNumber,
        text,
        reason: `Distance must be a positive number, got ${weight}.`,
      });
      continue;
    }

    // Validate: no self-loops
    if (from.toLowerCase() === to.toLowerCase()) {
      skippedRows.push({
        line: lineNumber,
        text,
        reason: `Self-loop detected: "${from}" connects to itself.`,
      });
      continue;
    }

    rawEdges.push({ from, to, weight, lineNumber });
  }

  // Handle duplicate edges
  const edgeMap = new Map(); // key: "A|B" (sorted), value: { weights: number[], from, to }

  for (const edge of rawEdges) {
    const key = [edge.from, edge.to].sort().join('|');

    if (!edgeMap.has(key)) {
      edgeMap.set(key, { from: edge.from, to: edge.to, weights: [edge.weight] });
    } else {
      edgeMap.get(key).weights.push(edge.weight);
    }
  }

  const edges = [];
  for (const [key, { from, to, weights }] of edgeMap) {
    if (weights.length > 1) {
      warnings.push(
        `Duplicate edge "${from}" ↔ "${to}" found ${weights.length} times (weights: ${weights.join(', ')}). Using ${DUPLICATE_MODE} = ${resolveDuplicate(weights)}.`
      );
    }
    edges.push({
      from,
      to,
      weight: resolveDuplicate(weights),
    });
  }

  // Collect unique nodes
  const nodes = new Set();
  for (const { from, to } of edges) {
    nodes.add(from);
    nodes.add(to);
  }

  return {
    edges,
    skippedRows,
    warnings,
    nodeCount: nodes.size,
    edgeCount: edges.length,
  };
}

/**
 * Resolve duplicate edge weights according to the configured mode.
 * @param {number[]} weights
 * @returns {number}
 */
function resolveDuplicate(weights) {
  if (weights.length === 1) return weights[0];

  switch (DUPLICATE_MODE) {
    case 'average':
      return Math.round((weights.reduce((a, b) => a + b, 0) / weights.length) * 100) / 100;
    case 'first':
      return weights[0];
    case 'last':
      return weights[weights.length - 1];
    case 'max':
      return Math.max(...weights);
    case 'min':
      return Math.min(...weights);
    default:
      return weights[0];
  }
}
