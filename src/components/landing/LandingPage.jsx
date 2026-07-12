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
      <header className="fixed top-0 left-0 right-0 z-50 h-16 navbar-glass flex items-center justify-between px-6 md:px-12 border-b">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--color-brand-500), var(--color-brand-700))' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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
            <h1 className="text-lg font-bold leading-none tracking-tight">LogiFlow</h1>
            <p className="text-[0.6rem] leading-none mt-0.5" style={{ color: 'var(--text-tertiary)' }}>Logistics Route Planner</p>
          </div>
        </div>

        {/* Desktop Nav Items */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
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
