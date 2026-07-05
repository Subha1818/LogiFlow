import React, { useState } from 'react';

export default function OptimizeButton({ graphData, onGenerateMST }) {
  const [stepThrough, setStepThrough] = useState(false);

  return (
    <div className="sidebar-section">
      <h3>Optimization</h3>

      <label className="flex items-center gap-2 cursor-pointer mb-2" htmlFor="step-through-kruskal">
        <input
          type="checkbox"
          id="step-through-kruskal"
          checked={stepThrough}
          onChange={(e) => setStepThrough(e.target.checked)}
          className="w-3.5 h-3.5 rounded accent-cyan-500 cursor-pointer"
        />
        <span className="text-[0.65rem]" style={{ color: 'var(--sidebar-text-muted)' }}>Step through algorithm</span>
      </label>

      <button
        onClick={() => onGenerateMST(stepThrough)}
        disabled={!graphData}
        className="btn-mst cursor-pointer"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="6" cy="6" r="3" />
          <circle cx="6" cy="18" r="3" />
          <circle cx="18" cy="12" r="3" />
          <line x1="8.5" y1="7.5" x2="15.5" y2="10.5" />
          <line x1="8.5" y1="16.5" x2="15.5" y2="13.5" />
        </svg>
        Generate Optimized Network
      </button>
    </div>
  );
}
