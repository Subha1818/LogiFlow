import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <footer className="py-16 px-6 md:px-12 border-t border-[rgba(255,255,255,0.06)]" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center md:items-start gap-10">
        {/* Brand Block */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left max-w-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br from-cyan-500 to-cyan-700">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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
            <h3 className="text-base font-bold tracking-tight">LogiFlow</h3>
          </div>
          <p className="text-xs leading-relaxed text-[var(--text-secondary)] mb-6">
            An advanced logistics route network analyzer enabling distribution centers to compute routing models with Dijkstra and Kruskal spanning optimizations in real-time.
          </p>
          <p className="text-[10px] text-[var(--text-tertiary)]">
            &copy; {new Date().getFullYear()} LogiFlow Systems Inc. All rights reserved.
          </p>
          <p className="text-[14px] text-[var(--text-tertiary)]">
            Made with ❤️ by SUBHA
          </p>
        </div>

        {/* Links */}
        <div className="flex flex-wrap justify-center gap-12 md:gap-20 text-sm">
          <div className="flex flex-col items-center md:items-start">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-tertiary)] mb-4">Explore</h4>
            <a href="#features" className="hover:text-cyan-500 transition-colors mb-2 text-xs">Features</a>
            <a href="#how-it-works" className="hover:text-cyan-500 transition-colors mb-2 text-xs">Process Flow</a>
            <a href="#algorithms" className="hover:text-cyan-500 transition-colors text-xs">Core Math</a>
          </div>

          <div className="flex flex-col items-center md:items-start">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-tertiary)] mb-4">Product</h4>
            <Link to="/dashboard" className="hover:text-cyan-500 transition-colors mb-2 text-xs">Dashboard</Link>
            <button onClick={scrollToTop} className="hover:text-cyan-500 transition-colors text-xs cursor-pointer">Back to Top</button>
          </div>
        </div>
      </div>
    </footer>
  );
}
