import React from 'react';
import { Link } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';

function LogoMark() {
  return (
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-cyan-500/10 ring-1 ring-cyan-500/20">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0EA5C4" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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
  );
}

export default function AppNavbar({
  theme,
  toggleTheme,
  variant = 'dashboard',
  navItems = [],
  actions = null,
  showLaunch = false,
}) {
  const isLanding = variant === 'landing';
  const headerClass = isLanding
    ? 'landing-navbar fixed left-1/2 top-4 -translate-x-1/2'
    : 'dashboard-navbar sticky top-4 mx-auto';
  const foregroundClass = isLanding ? 'landing-nav-foreground' : 'dashboard-nav-foreground';
  const subtitleClass = isLanding ? 'landing-nav-subtitle' : 'dashboard-nav-subtitle';

  return (
    <header
      className={`${headerClass} z-50 flex w-[calc(100%-2rem)] max-w-[1160px] items-center justify-between gap-4 rounded-full border px-4 py-2.5 shadow-[0_18px_45px_rgba(45,37,26,0.12)] backdrop-blur-xl md:w-[calc(100%-3rem)] md:px-5`}
    >
      <Link
        to="/"
        className={`${foregroundClass} flex min-w-0 items-center gap-3 rounded-full transition-all duration-200 hover:scale-[1.015] hover:opacity-85 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/50`}
        aria-label="Go to LogiFlow landing page"
      >
        <LogoMark />
        <div className="min-w-0">
          <h1 className="text-lg font-bold leading-none tracking-tight">LogiFlow</h1>
          <p className={`${subtitleClass} hidden text-[0.6rem] leading-none mt-0.5 sm:block`}>
            Logistics Route Planner
          </p>
        </div>
      </Link>

      {navItems.length > 0 && (
        <nav className={`${foregroundClass} hidden md:flex items-center gap-8 text-sm font-medium`}>
          {navItems.map(item => (
            <a key={item.href} href={item.href} className="hover:text-cyan-500 dark:hover:text-cyan-300 transition-colors">
              {item.label}
            </a>
          ))}
        </nav>
      )}

      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        {actions}
        <ThemeToggle theme={theme} toggleTheme={toggleTheme} className="navbar-action" />
        {showLaunch && (
          <Link
            to="/dashboard"
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 text-white shadow-md hover:shadow-cyan-500/20 hover:scale-[1.03] transition-all duration-200 cursor-pointer"
          >
            Try LogiFlow
          </Link>
        )}
      </div>
    </header>
  );
}
