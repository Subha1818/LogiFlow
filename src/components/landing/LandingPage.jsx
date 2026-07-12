import React, { useEffect } from 'react';
import { useTheme } from '../../hooks/useTheme';
import { Link } from 'react-router-dom';
import ThemeToggle from '../ThemeToggle';
import HeroSection from './HeroSection';
import FeaturesSection from './FeaturesSection';
import HowItWorksSection from './HowItWorksSection';
import AlgorithmsSection from './AlgorithmsSection';
import Footer from './Footer';

export default function LandingPage() {
  const { theme, toggleTheme } = useTheme();

  // Scroll to top on load and handle body overflow
  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Enable scrolling on landing page
    document.body.style.overflowY = 'auto';
    document.body.style.overflowX = 'hidden';
    
    return () => {
      // Revert body overflow back to hidden when leaving the landing page (e.g., navigating to dashboard)
      document.body.style.overflowY = 'hidden';
      document.body.style.overflowX = 'hidden';
    };
  }, []);

  return (
    <div className="landing-page-container min-h-screen flex flex-col font-sans transition-colors duration-300" style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      {/* Landing Navbar */}
      <header className="landing-navbar fixed top-4 left-4 right-4 z-50 mx-auto flex max-w-[1160px] items-center justify-between gap-4 rounded-full border px-4 py-2.5 shadow-[0_18px_45px_rgba(45,37,26,0.12)] backdrop-blur-xl md:left-6 md:right-6 md:px-5">
        {/* Logo */}
        <div className="landing-nav-foreground flex min-w-0 items-center gap-3">
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
          <div className="min-w-0">
            <h1 className="text-lg font-bold leading-none tracking-tight">LogiFlow</h1>
            <p className="landing-nav-subtitle hidden text-[0.6rem] leading-none mt-0.5 sm:block">Logistics Route Planner</p>
          </div>
        </div>

        {/* Desktop Nav Items */}
        <nav className="landing-nav-foreground hidden md:flex items-center gap-8 text-sm font-medium">
          <a href="#features" className="hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors">Process</a>
          <a href="#algorithms" className="hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors">Algorithms</a>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
          
          <Link
            to="/dashboard"
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 text-white shadow-md hover:shadow-cyan-500/20 hover:scale-[1.03] transition-all duration-200 cursor-pointer"
          >
            Launch Dashboard
          </Link>
        </div>
      </header>

      {/* Main Content Sections */}
      <main className="flex-grow">
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <AlgorithmsSection />
      </main>

      <Footer />
    </div>
  );
}
