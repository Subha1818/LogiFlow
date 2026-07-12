import { useState, useEffect, useRef, useCallback } from 'react';

export default function AlgorithmTrace({ type, steps = [], currentStep, onStepChange, graphNodes = [] }) {
  const [autoPlay, setAutoPlay] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const autoPlayRef = useRef(null);

  const totalSteps = steps.length;
  const step = steps[currentStep] || null;
  const isFirst = currentStep <= 0;
  const isLast = currentStep >= totalSteps - 1;
  const currentNodeSet = new Set(graphNodes);

  useEffect(() => {
    if (autoPlay && !isLast && totalSteps > 0) {
      autoPlayRef.current = setInterval(() => {
        onStepChange(prev => {
          const next = prev + 1;
          if (next >= totalSteps - 1) {
            setAutoPlay(false);
          }
          return Math.min(next, totalSteps - 1);
        });
      }, speed);
    }

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
        autoPlayRef.current = null;
      }
    };
  }, [autoPlay, speed, isLast, totalSteps, onStepChange]);

  useEffect(() => {
    if (isLast && autoPlay) {
      setAutoPlay(false);
    }
  }, [isLast, autoPlay]);

  const handlePrev = useCallback(() => {
    setAutoPlay(false);
    onStepChange(prev => Math.max(0, prev - 1));
  }, [onStepChange]);

  const handleNext = useCallback(() => {
    setAutoPlay(false);
    onStepChange(prev => Math.min(totalSteps - 1, prev + 1));
  }, [onStepChange, totalSteps]);

  const toggleAutoPlay = useCallback(() => {
    if (isLast) {
      onStepChange(0);
      setAutoPlay(true);
    } else {
      setAutoPlay(prev => !prev);
    }
  }, [isLast, onStepChange]);

  const algorithmName = type === 'dijkstra' ? "Dijkstra's Algorithm" : "Kruskal's Algorithm";
  const accentColor = type === 'dijkstra' ? 'var(--color-path-500)' : 'var(--color-mst-500)';

  return (
    <div className="p-3 flex flex-col slide-in-right" style={{ borderTop: '1px solid var(--border-color)' }}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-[0.65rem] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>
          Algorithm Trace
        </h3>
        <span
          className="text-[0.6rem] font-medium px-2 py-0.5 rounded-full"
          style={{ background: `${accentColor}20`, color: accentColor }}
        >
          {algorithmName}
        </span>
      </div>

      <div className="text-xs font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
        Step {totalSteps > 0 ? currentStep + 1 : 0} of {totalSteps}
      </div>

      <div className="w-full h-1 rounded-full mb-3" style={{ background: 'var(--border-color)' }}>
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{
            width: `${totalSteps > 0 ? ((currentStep + 1) / totalSteps) * 100 : 0}%`,
            background: accentColor,
          }}
        />
      </div>

      <div className="flex items-center gap-2 mb-3">
        <button
          onClick={handlePrev}
          disabled={isFirst}
          className="w-8 h-8 rounded-lg flex items-center justify-center transition-all disabled:opacity-30"
          style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}
          aria-label="Previous step"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        <button
          onClick={toggleAutoPlay}
          className="flex-1 h-8 rounded-lg flex items-center justify-center gap-1.5 text-xs font-medium transition-all"
          style={{
            background: autoPlay ? accentColor : 'var(--bg-tertiary)',
            color: autoPlay ? 'white' : 'var(--text-secondary)',
            border: `1px solid ${autoPlay ? accentColor : 'var(--border-color)'}`,
          }}
          aria-label={autoPlay ? 'Pause' : 'Auto-play'}
        >
          {autoPlay ? (
            <>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="4" width="4" height="16" />
                <rect x="14" y="4" width="4" height="16" />
              </svg>
              Pause
            </>
          ) : (
            <>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5,3 19,12 5,21" />
              </svg>
              {isLast ? 'Replay' : 'Auto-play'}
            </>
          )}
        </button>

        <button
          onClick={handleNext}
          disabled={isLast}
          className="w-8 h-8 rounded-lg flex items-center justify-center transition-all disabled:opacity-30"
          style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}
          aria-label="Next step"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>

      <div className="flex items-center gap-2 mb-3">
        <span className="text-[0.55rem]" style={{ color: 'var(--text-tertiary)' }}>Fast</span>
        <input
          type="range"
          min="100"
          max="2000"
          step="100"
          value={speed}
          onChange={(e) => setSpeed(Number(e.target.value))}
          className="flex-1"
          aria-label="Animation speed"
        />
        <span className="text-[0.55rem]" style={{ color: 'var(--text-tertiary)' }}>Slow</span>
      </div>

      {step && (
        <div
          className="rounded-lg p-2.5 mb-2 text-xs font-mono leading-relaxed pulse-active"
          style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
        >
          {normalizeTraceText(step.action || step.reason || '')}
        </div>
      )}

      {type === 'dijkstra' && step?.distanceTable && (
        <div className="max-h-40 overflow-y-auto rounded-lg" style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}>
          <table className="trace-table w-full">
            <thead>
              <tr>
                <th>Node</th>
                <th>Distance</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(step.distanceTable)
                .filter(([node]) => currentNodeSet.size === 0 || currentNodeSet.has(node))
                .sort(([, a], [, b]) => a - b)
                .map(([node, dist]) => {
                  const isFinalized = step.finalized?.includes(node);
                  const isCurrent = step.highlightNodes?.includes(node);

                  return (
                    <tr key={node} className={isCurrent ? 'active-row' : ''}>
                      <td style={{ color: 'var(--text-primary)' }}>{node}</td>
                      <td style={{ color: dist === Infinity ? 'var(--text-tertiary)' : accentColor }}>
                        {dist === Infinity ? 'inf' : dist}
                      </td>
                      <td>
                        {isFinalized ? (
                          <span className="text-[0.6rem] px-1 py-0.5 rounded" style={{ background: 'rgba(16,185,129,0.15)', color: 'var(--color-path-400)' }}>Done</span>
                        ) : (
                          <span className="text-[0.6rem]" style={{ color: 'var(--text-tertiary)' }}>-</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      )}

      {type === 'kruskal' && step?.edge && (
        <div className="rounded-lg p-2 text-[0.65rem] font-mono" style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}>
          <div className="flex items-center gap-2 mb-1">
            <span style={{ color: 'var(--text-secondary)' }}>Edge:</span>
            <span style={{ color: 'var(--text-primary)' }}>{step.edge.from} - {step.edge.to}</span>
            <span style={{ color: 'var(--color-mst-400)' }}>({step.edge.weight})</span>
          </div>
          <div className="flex items-center gap-2">
            <span style={{ color: 'var(--text-secondary)' }}>Decision:</span>
            <span
              className="px-1.5 py-0.5 rounded text-[0.6rem] font-medium"
              style={{
                background: step.action === 'accepted' ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
                color: step.action === 'accepted' ? 'var(--color-path-400)' : 'var(--color-danger-600)',
              }}
            >
              {step.action === 'accepted' ? 'Accepted' : 'Rejected'}
            </span>
          </div>
          <p className="mt-1 text-[0.6rem]" style={{ color: 'var(--text-tertiary)' }}>
            {normalizeTraceText(step.reason || '')}
          </p>
          <div className="mt-1.5 text-[0.6rem]" style={{ color: 'var(--text-tertiary)' }}>
            MST edges so far: {step.mstEdgesSoFar?.length || 0} | Cost: {step.costSoFar || 0}
          </div>
        </div>
      )}
    </div>
  );
}

function normalizeTraceText(text = '') {
  return text
    .replace(/∞/g, 'inf')
    .replace(/≥/g, '>=')
    .replace(/[→↔—–]/g, '-')
    .replace(/[✓✔]/g, 'Done')
    .replace(/[✗✕]/g, 'Rejected')
    .replace(/[^\n]+/g, (match) => [...match].map(char => char.charCodeAt(0) > 127 ? ' ' : char).join(''))
    .replace(/\s+/g, ' ')
    .trim();
}
