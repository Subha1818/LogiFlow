# LogiFlow — Interactive Logistics Route Planner

LogiFlow is a browser-based logistics network planner and routing web application. It parses location and route datasets, renders an interactive network graph, and visualizes route optimizations in real time.

## Live Demo & Features

- **Interactive Graph Visualization**: Reposition nodes, zoom, pan, hover for connection details, and freeze layout physics.
- **Shortest Path Routing**: Calculates paths between any two locations using Dijkstra's algorithm with customizable step-by-step interactive tracing.
- **Network Optimization**: Computes the Minimum Spanning Tree (MST) or Minimum Spanning Forest (MSF) using Kruskal's algorithm and Union-Find cycle detection, complete with step-by-step tracing.
- **Statistics Dashboard**: Real-time updates for network locations, routes, average weight, density, longest route, shortest route distance, and optimized network cost.
- **Route History**: Session-level history tracking of calculated paths, allowing instant re-rendering.
- **Exporting**: Save results as structured JSON (for programmatic use) or as a formatted PDF summary report.
- **Aesthetic UI**: Curated dark/light theme supporting glassmorphism effects, harmonized colors, and fluid CSS animations.

---

## Dataset Formats Supported

Upload a `.txt` or `.csv` file. The file should list one edge per row in one of these formats:

### Space-Separated (TXT)
```
Mumbai Delhi 1400
Mumbai Bangalore 980
Bangalore Chennai 350
```

### Comma-Separated (CSV)
```
Mumbai,Delhi,1400
Mumbai,Bangalore,980
Bangalore,Chennai,350
```

### Validation Rules
- Each row must have exactly three fields: `[Source]`, `[Destination]`, and `[Distance]`.
- Distance/Weight must be a positive number.
- Self-loops (Source identical to Destination) are rejected with a helpful line message.
- Duplicate edges are automatically handled (defaults to averaging their weights).

---

## Running Locally

To run the application locally on your machine, follow these steps:

### Prerequisites
Make sure you have Node.js (v18+) and npm installed.

### Setup

1. Navigate to the project folder:
   ```bash
   cd Project_LogiFlow
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```

4. Open your browser and go to:
   ```
   http://localhost:5173
   ```

---

## Architecture & Codebase Structure

- `src/algorithms/`: Pure algorithms and mathematical structures.
  - `dijkstra.js`: Dijkstra's algorithm using custom MinHeap and trace records.
  - `kruskal.js`: Kruskal's MST algorithm utilizing a Union-Find (disjoint-set) class.
  - `graphUtils.js`: Helper functions for adjacency lists, connected components, and statistics.
- `src/components/`: Reusable React layout and control components.
- `src/hooks/`: State wrappers (`useTheme.js`).
- `src/utils/`: File parsers and data exporters (`parser.js`, `exportJson.js`, `exportPdf.js`).
- `src/data/`: Demo preset datasets (`presets.js`).
