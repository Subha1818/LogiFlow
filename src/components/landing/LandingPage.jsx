import React, { useEffect } from 'react';
import { useTheme } from '../../hooks/useTheme';
import AppNavbar from '../AppNavbar';
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
      <AppNavbar
        theme={theme}
        toggleTheme={toggleTheme}
        variant="landing"
        navItems={[
          { href: '#features', label: 'Features' },
          { href: '#how-it-works', label: 'Process' },
          { href: '#algorithms', label: 'Algorithms' },
        ]}
        showLaunch
      />

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
