import React, { useState } from 'react';

export default function RouteSearch({ graphData, onFindRoute, negativeWeightWarning }) {
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [stepThrough, setStepThrough] = useState(false);

  const nodes = graphData?.nodes || [];
  const canSearch = source && destination && source !== destination;

  const handleFind = () => {
    if (canSearch) {
      onFindRoute(source, destination, stepThrough);
    }
  };

  return (
    <div className="sidebar-section">
      <h3>Route Search</h3>

      {negativeWeightWarning && (
        <div className="mb-2 p-2 rounded-lg text-[0.6rem]" style={{ background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)', color: 'var(--color-mst-400)' }}>
          ⚠ {negativeWeightWarning}
        </div>
      )}

      <div className="space-y-2">
        <div>
          <label htmlFor="source-select" className="text-[0.6rem] font-medium block mb-1" style={{ color: 'var(--sidebar-text-muted)' }}>From</label>
          <select
            id="source-select"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            disabled={nodes.length === 0}
            className="custom-select w-full px-3 py-2 rounded-lg text-xs cursor-pointer"
            style={{
              background: 'var(--sidebar-hover)',
              border: '1px solid var(--sidebar-border)',
              color: 'var(--sidebar-text)',
            }}
          >
            <option value="">Select source</option>
            {nodes.map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>

        <div>
          <label htmlFor="dest-select" className="text-[0.6rem] font-medium block mb-1" style={{ color: 'var(--sidebar-text-muted)' }}>To</label>
          <select
            id="dest-select"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            disabled={nodes.length === 0}
            className="custom-select w-full px-3 py-2 rounded-lg text-xs cursor-pointer"
            style={{
              background: 'var(--sidebar-hover)',
              border: '1px solid var(--sidebar-border)',
              color: 'var(--sidebar-text)',
            }}
          >
            <option value="">Select destination</option>
            {nodes.map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>

        {/* Step Through Toggle */}
        <label className="flex items-center gap-2 cursor-pointer" htmlFor="step-through-dijkstra">
          <input
            type="checkbox"
            id="step-through-dijkstra"
            checked={stepThrough}
            onChange={(e) => setStepThrough(e.target.checked)}
            className="w-3.5 h-3.5 rounded accent-cyan-500 cursor-pointer"
          />
          <span className="text-[0.65rem]" style={{ color: 'var(--sidebar-text-muted)' }}>Step through algorithm</span>
        </label>

        <button
          onClick={handleFind}
          disabled={!canSearch}
          className="btn-path cursor-pointer"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
          Find Route
        </button>
      </div>
    </div>
  );
}
