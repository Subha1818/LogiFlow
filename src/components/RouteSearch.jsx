import React, { useEffect, useState } from 'react';

function CitySelect({ id, label, value, onChange, nodes, placeholder }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const filteredNodes = nodes.filter(node => node.toLowerCase().includes(query.toLowerCase()));
  const disabled = nodes.length === 0;

  const handleSelect = (node) => {
    onChange(node);
    setOpen(false);
    setQuery('');
  };

  return (
    <div className="relative">
      <label htmlFor={id} className="text-[0.6rem] font-medium block mb-1" style={{ color: 'var(--sidebar-text-muted)' }}>{label}</label>
      <button
        id={id}
        type="button"
        disabled={disabled}
        onClick={() => setOpen(current => !current)}
        className="route-select-trigger w-full rounded-lg px-3 py-2 text-left text-xs cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span>{value || placeholder}</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {open && !disabled && (
        <>
          <div className="fixed inset-0 z-20" onClick={() => setOpen(false)} />
          <div className="route-select-menu absolute left-0 right-0 top-full z-30 mt-2 rounded-xl p-2 shadow-xl">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search city"
              className="route-select-search mb-2 w-full rounded-lg px-3 py-2 text-xs outline-none"
              autoFocus
            />
            <div className="max-h-48 overflow-y-auto" role="listbox" aria-label={label}>
              {filteredNodes.length > 0 ? (
                filteredNodes.map(node => (
                  <button
                    key={node}
                    type="button"
                    role="option"
                    aria-selected={value === node}
                    onClick={() => handleSelect(node)}
                    className={`route-select-option w-full rounded-lg px-3 py-2 text-left text-xs transition-colors ${value === node ? 'selected' : ''}`}
                  >
                    {node}
                  </button>
                ))
              ) : (
                <div className="px-3 py-3 text-xs" style={{ color: 'var(--sidebar-text-muted)' }}>
                  No matching cities
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default function RouteSearch({ graphData, onFindRoute, negativeWeightWarning }) {
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [stepThrough, setStepThrough] = useState(false);

  const nodes = graphData?.nodes || [];
  const canSearch = source && destination && source !== destination && nodes.includes(source) && nodes.includes(destination);

  useEffect(() => {
    setSource('');
    setDestination('');
    setStepThrough(false);
  }, [graphData]);

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
          Warning: {negativeWeightWarning}
        </div>
      )}

      <div className="space-y-2">
        <CitySelect
          id="source-select"
          label="From"
          value={source}
          onChange={setSource}
          nodes={nodes}
          placeholder="Select source"
        />

        <CitySelect
          id="dest-select"
          label="To"
          value={destination}
          onChange={setDestination}
          nodes={nodes}
          placeholder="Select destination"
        />

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
