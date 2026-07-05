import React, { useState, useRef, useCallback } from 'react';
import { presets } from '../data/presets';
import ParseSummary from './ParseSummary';

export default function FileUpload({ onFileUpload, onLoadPreset, parseSummary }) {
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && (file.name.endsWith('.txt') || file.name.endsWith('.csv'))) {
      onFileUpload(file);
    }
  }, [onFileUpload]);

  const handleFileChange = useCallback((e) => {
    const file = e.target.files[0];
    if (file) onFileUpload(file);
    e.target.value = '';
  }, [onFileUpload]);

  return (
    <div className="sidebar-section">
      <h3>Dataset</h3>

      {/* Drop Zone */}
      <div
        className={`drop-zone p-4 text-center transition-all ${dragOver ? 'drag-over' : ''}`}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') fileInputRef.current?.click(); }}
        aria-label="Upload dataset file"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".txt,.csv"
          onChange={handleFileChange}
          className="hidden"
          id="file-upload-input"
        />
        <svg className="mx-auto mb-2" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--sidebar-text-muted)' }}>
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
        <p className="text-xs font-medium" style={{ color: 'var(--sidebar-text-muted)' }}>
          {dragOver ? 'Drop file here' : 'Drop .txt or .csv file'}
        </p>
        <p className="text-[0.6rem] mt-1" style={{ color: 'var(--color-surface-500)' }}>
          or click to browse
        </p>
      </div>

      {/* Preset Buttons */}
      <div className="mt-3">
        <p className="text-[0.6rem] font-medium mb-2 uppercase tracking-wider" style={{ color: 'var(--sidebar-text-muted)' }}>
          Demo Datasets
        </p>
        <div className="grid grid-cols-2 gap-1.5">
          {presets.map(preset => (
            <button
              key={preset.id}
              onClick={() => onLoadPreset(preset.id)}
              className="text-[0.65rem] px-2 py-1.5 rounded-md text-left transition-all hover:scale-[1.02] cursor-pointer"
              style={{ background: 'var(--sidebar-hover)', border: '1px solid var(--sidebar-border)' }}
              title={preset.description}
            >
              <span className="mr-1">{preset.icon}</span>
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      {/* Parse Summary */}
      {parseSummary && (
        <ParseSummary summary={parseSummary} />
      )}
    </div>
  );
}
