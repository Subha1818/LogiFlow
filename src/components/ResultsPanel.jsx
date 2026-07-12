export default function ResultsPanel({ shortestPath, mstResult, onExport }) {
  const hasResults = Boolean(shortestPath || mstResult);

  return (
    <div className="results-panel">
      <div className="flex items-center justify-between gap-3 mb-3">
        <h3 className="text-[0.68rem] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>
          Results
        </h3>
        {hasResults && (
          <div className="flex gap-2">
            <button onClick={() => onExport('json')} className="dashboard-soft-button">
              JSON
            </button>
            <button onClick={() => onExport('pdf')} className="dashboard-soft-button">
              PDF
            </button>
          </div>
        )}
      </div>

      <div className="results-grid">
        <div className={`result-card result-card-path fade-in ${shortestPath ? '' : 'result-card-empty'}`}>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <h4 className="text-sm font-bold" style={{ color: 'var(--color-path-500)' }}>Shortest Path</h4>
          </div>

          {shortestPath ? (
            shortestPath.path ? (
              <>
                <div className="flex items-center flex-wrap gap-1.5 mb-4">
                  {shortestPath.path.map((node, i) => (
                    <span key={i} className="flex items-center gap-1">
                      <span
                        className="text-[0.7rem] font-semibold px-2 py-1 rounded-md"
                        style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--color-path-400)' }}
                      >
                        {node}
                      </span>
                      {i < shortestPath.path.length - 1 && (
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--text-tertiary)' }}>
                          <path d="M9 18l6-6-6-6" />
                        </svg>
                      )}
                    </span>
                  ))}
                </div>

                <div className="metric-row" style={{ color: 'var(--text-secondary)' }}>
                  <span>Total Distance</span>
                  <span className="font-extrabold text-xl" style={{ color: 'var(--color-path-500)' }}>
                    {shortestPath.totalDistance}
                  </span>
                </div>

                {shortestPath.nodesVisited > 0 && (
                  <div className="mt-3 text-[0.68rem] flex flex-wrap gap-4" style={{ color: 'var(--text-tertiary)' }}>
                    <span>Nodes visited: {shortestPath.nodesVisited}</span>
                    <span>Edges relaxed: {shortestPath.edgesRelaxed}</span>
                  </div>
                )}
              </>
            ) : (
              <p className="text-xs result-error-text">
                {normalizeResultMessage(shortestPath.message || 'No path found between the selected locations.')}
              </p>
            )
          ) : (
            <EmptyResult
              type="path"
              message="Run a route search to see the shortest path summary."
            />
          )}
        </div>

        <div className={`result-card result-card-mst fade-in ${mstResult ? '' : 'result-card-empty'}`}>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <h4 className="text-sm font-bold" style={{ color: 'var(--color-mst-500)' }}>Optimized Network</h4>
          </div>

          {mstResult ? (
            <>
              {mstResult.isForest && (
                <div className="mb-3 p-2 rounded text-[0.68rem]" style={{ background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.2)', color: 'var(--color-mst-400)' }}>
                  The graph is disconnected ({mstResult.componentCount} components). Showing a minimum spanning forest.
                </div>
              )}

              <div className="optimized-table-wrap">
                <table className="w-full text-xs">
                  <thead>
                    <tr style={{ color: 'var(--text-tertiary)' }}>
                      <th className="text-left py-1.5 font-semibold">From</th>
                      <th className="text-left py-1.5 font-semibold">To</th>
                      <th className="text-right py-1.5 font-semibold">Weight</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mstResult.mstEdges.map((edge, i) => (
                      <tr key={i} style={{ color: 'var(--text-secondary)' }}>
                        <td className="py-1">{edge.from}</td>
                        <td className="py-1">{edge.to}</td>
                        <td className="py-1 text-right font-mono" style={{ color: 'var(--color-mst-400)' }}>{edge.weight}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="metric-row pt-2" style={{ borderTop: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                <span>Total Cost</span>
                <span className="font-extrabold text-xl" style={{ color: 'var(--color-mst-500)' }}>
                  {mstResult.totalCost}
                </span>
              </div>

              <div className="mt-2 text-[0.68rem]" style={{ color: 'var(--text-tertiary)' }}>
                {mstResult.mstEdges.length} edges / {mstResult.edgesConsidered} edges considered
              </div>
            </>
          ) : (
            <EmptyResult
              type="network"
              message="Generate an optimized network to see the edge table and cost."
            />
          )}
        </div>
      </div>
    </div>
  );
}

function EmptyResult({ type, message }) {
  return (
    <div className="empty-result">
      <div className={`empty-result-icon ${type === 'path' ? 'empty-result-path' : 'empty-result-network'}`}>
        {type === 'path' ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="6" cy="18" r="2" />
            <circle cx="18" cy="6" r="2" />
            <path d="M8 18c4 0 4-12 8-12" />
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="6" cy="6" r="2" />
            <circle cx="18" cy="6" r="2" />
            <circle cx="12" cy="18" r="2" />
            <path d="M8 7l3 9M16 7l-3 9M8 6h8" />
          </svg>
        )}
      </div>
      <p>{message}</p>
    </div>
  );
}

function normalizeResultMessage(message = '') {
  return message
    .replace(/[^\n]+/g, (match) => [...match].map(char => char.charCodeAt(0) > 127 ? '-' : char).join(''))
    .replace(/\s+/g, ' ')
    .trim();
}
