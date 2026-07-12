import React from 'react';
import ExportMenu from './ExportMenu';
import AppNavbar from './AppNavbar';

export default function Navbar({ theme, toggleTheme, onExport, hasData, onAbout }) {
  const actions = (
    <>
      <ExportMenu onExport={onExport} hasData={hasData} className="navbar-export" />

      <button
        onClick={onAbout}
        className="navbar-action w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-105 cursor-pointer"
        aria-label="About LogiFlow"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
      </button>
    </>
  );

  return (
    <AppNavbar
      theme={theme}
      toggleTheme={toggleTheme}
      variant="dashboard"
      actions={actions}
    />
  );
}
