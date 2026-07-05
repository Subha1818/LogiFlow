import React from 'react';
import ThemeToggle from './ThemeToggle';
import ExportMenu from './ExportMenu';

export default function Navbar({ theme, toggleTheme, onExport, hasData, onAbout, onToggleRightPanel, rightPanelOpen }) {
  return (
    <nav className="navbar-glass flex items-center justify-between px-5 h-14 z-50 relative" style={{ flexShrink: 0 }}>
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--color-brand-500), var(--color-brand-700))' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="6" cy="6" r="2" />
            <circle cx="18" cy="6" r="2" />
            <circle cx="6" cy="18" r="2" />
            <circle cx="18" cy="18" r="2" />
            <circle cx="12" cy="12" r="2" />
            <line x1="7.5" y1="7.5" x2="10.5" y2="10.5" />
            <line x1="13.5" y1="10.5" x2="16.5" y2="7.5" />
            <line x1="7.5" y1="16.5" x2="10.5" y2="13.5" />
            <line x1="13.5" y1="13.5" x2="16.5" y2="16.5" />
          </svg>
        </div>
        <div>
          <h1 className="text-lg font-bold leading-none" style={{ color: 'var(--text-primary)' }}>LogiFlow</h1>
          <p className="text-[0.6rem] leading-none mt-0.5" style={{ color: 'var(--text-tertiary)' }}>Logistics Route Planner</p>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2">
        {/* Theme Toggle */}
        <ThemeToggle theme={theme} toggleTheme={toggleTheme} />

        {/* Export Button */}
        <ExportMenu onExport={onExport} hasData={hasData} />

        {/* About */}
        <button
          onClick={onAbout}
          className="w-9 h-9 rounded-lg flex items-center justify-center transition-all hover:scale-105 cursor-pointer"
          style={{ background: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}
          aria-label="About LogiFlow"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
        </button>

        {/* Right Panel Toggle (mobile) */}
        <button
          onClick={onToggleRightPanel}
          className="w-9 h-9 rounded-lg items-center justify-center transition-all hover:scale-105 hidden max-[1024px]:flex cursor-pointer"
          style={{ background: rightPanelOpen ? 'var(--color-brand-500)' : 'var(--bg-tertiary)', color: rightPanelOpen ? 'white' : 'var(--text-secondary)' }}
          aria-label="Toggle details panel"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <line x1="15" y1="3" x2="15" y2="21" />
          </svg>
        </button>
      </div>
    </nav>
  );
}

