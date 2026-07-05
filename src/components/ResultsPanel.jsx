export default function ResultsPanel({ shortestPath, mstResult, onExport }) {
  const hasResults = shortestPath || mstResult;

  return (
    <div className="p-3 border-b flex-1 overflow-y-auto" style={{ borderColor: 'var(--border-color)' }}>
      <div className="flex items-center justify-between mb-2.5">
        <h3 className="text-[0.65rem] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>
          Results
        </h3>
        {hasResults && (
          <div className="flex gap-1">
            <button
              onClick={() => onExport('json')}
              className="text-[0.55rem] px-2 py-1 rounded font-medium transition-all hover:scale-105"
              style={{ background: 'var(--bg-tertiary)', color: 'var(--text-secondary)', border: '1px solid var(--border-color)' }}
            >
              JSON
            </button>
            <button
              onClick={() => onExport('pdf')}
              className="text-[0.55rem] px-2 py-1 rounded font-medium transition-all hover:scale-105"
              style={{ background: 'var(--bg-tertiary)', color: 'var(--text-secondary)', border: '1px solid var(--border-color)' }}
            >
              PDF
            </button>
          </div>
        )}
      </div>

      {/* Shortest Path Results */}
      {shortestPath && (
        <div className="mb-3 rounded-lg p-3 fade-in" style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: 'var(--color-path-500)' }} />
            <h4 className="text-xs font-semibold" style={{ color: 'var(--color-path-500)' }}>Shortest Path</h4>
          </div>

          {shortestPath.path ? (
            <>
              {/* Path visualization */}
              <div className="flex items-center flex-wrap gap-1 mb-2">
                {shortestPath.path.map((node, i) => (
                  <span key={i} className="flex items-center gap-1">
                    <span
                      className="text-[0.65rem] font-medium px-1.5 py-0.5 rounded"
                      style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--color-path-400)' }}
                    >
                      {node}
                    </span>
                    {i < shortestPath.path.length - 1 && (
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--text-tertiary)' }}>
                        <path d="M9 18l6-6-6-6" />
                      </svg>
                    )}
                  </span>
                ))}
              </div>

              {/* Total distance */}
              <div className="flex items-center justify-between text-xs" style={{ color: 'var(--text-secondary)' }}>
                <span>Total Distance</span>
                <span className="font-bold text-sm" style={{ color: 'var(--color-path-500)' }}>
                  {shortestPath.totalDistance}
                </span>
              </div>

              {shortestPath.nodesVisited > 0 && (
                <div className="mt-1.5 text-[0.6rem] flex gap-3" style={{ color: 'var(--text-tertiary)' }}>
                  <span>Nodes visited: {shortestPath.nodesVisited}</span>
                  <span>Edges relaxed: {shortestPath.edgesRelaxed}</span>
                </div>
              )}
            </>
          ) : (
            <p className="text-xs" style={{ color: 'var(--color-mst-400)' }}>
              {shortestPath.message || 'No path found between the selected locations.'}
            </p>
          )}
        </div>
      )}

      {/* MST Results */}
      {mstResult && (
        <div className="mb-3 rounded-lg p-3 fade-in" style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: 'var(--color-mst-500)' }} />
            <h4 className="text-xs font-semibold" style={{ color: 'var(--color-mst-500)' }}>Optimized Network</h4>
          </div>

          {mstResult.isForest && (
            <div className="mb-2 p-2 rounded text-[0.6rem]" style={{ background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.2)', color: 'var(--color-mst-400)' }}>
              ⚠ The graph is disconnected ({mstResult.componentCount} components). Showing minimum spanning forest — a single tree covering all locations isn't possible.
            </div>
          )}

          {/* Edge list */}
          <div className="max-h-36 overflow-y-auto mb-2">
            <table className="w-full text-[0.65rem]">
              <thead>
                <tr style={{ color: 'var(--text-tertiary)' }}>
                  <th className="text-left py-1 font-medium">From</th>
                  <th className="text-left py-1 font-medium">To</th>
                  <th className="text-right py-1 font-medium">Weight</th>
                </tr>
              </thead>
              <tbody>
                {mstResult.mstEdges.map((edge, i) => (
                  <tr key={i} style={{ color: 'var(--text-secondary)' }}>
                    <td className="py-0.5">{edge.from}</td>
                    <td className="py-0.5">{edge.to}</td>
                    <td className="py-0.5 text-right font-mono" style={{ color: 'var(--color-mst-400)' }}>{edge.weight}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Total cost */}
          <div className="flex items-center justify-between text-xs pt-1.5" style={{ borderTop: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
            <span>Total Cost</span>
            <span className="font-bold text-sm" style={{ color: 'var(--color-mst-500)' }}>
              {mstResult.totalCost}
            </span>
          </div>

          <div className="mt-1 text-[0.6rem]" style={{ color: 'var(--text-tertiary)' }}>
            {mstResult.mstEdges.length} edges • {mstResult.edgesConsidered} edges considered
          </div>
        </div>
      )}

      {/* Empty State */}
      {!hasResults && (
        <div className="text-center py-6">
          <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
            No results yet. Find a route or generate an optimized network to see results here.
          </p>
        </div>
      )}
    </div>
  );
}
