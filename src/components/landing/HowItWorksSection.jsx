import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

export default function HowItWorksSection() {
  const containerRef = useRef(null);

  useGSAP(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const steps = gsap.utils.toArray('.process-step');
    const lines = gsap.utils.toArray('.process-line');

    gsap.fromTo(steps,
      { opacity: 0, y: 24 },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.process-step-grid',
          start: 'top 85%',
          toggleActions: 'play none none none',
        }
      }
    );

    gsap.fromTo(lines,
      { scaleX: 0 },
      {
        scaleX: 1,
        duration: 0.6,
        stagger: 0.1,
        delay: 0.2,
        ease: 'power1.inOut',
        scrollTrigger: {
          trigger: '.process-step-grid',
          start: 'top 85%',
          toggleActions: 'play none none none',
        }
      }
    );
  }, { scope: containerRef });

  const steps = [
    {
      number: "01",
      title: "Provide Node Coordinates",
      description: "Import your network using files (CSV or JSON) or simply drop warehouse coordinates directly onto our interactive coordinate drag zone.",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
      ),
      glow: "shadow-cyan-500/10"
    },
    {
      number: "02",
      title: "Run Graph Algorithms",
      description: "Compute path sequences with Dijkstra's or optimize link weight overlays across nodes with Kruskal's minimum spanning tree.",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      ),
      glow: "shadow-emerald-500/10"
    },
    {
      number: "03",
      title: "Visualize & Export PDF",
      description: "Inspect visual path simulations step-by-step or export fully formatted invoices and delivery schedules straight to PDF / raw JSON.",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      ),
      glow: "shadow-amber-500/10"
    }
  ];

  return (
    <section id="how-it-works" ref={containerRef} className="py-24 px-6 md:px-12 relative bg-[var(--bg-primary)]">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20">
          <span className="text-xs font-semibold uppercase tracking-wider px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
            Workflows Simplified
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold mt-4 mb-3 tracking-tight">
            How LogiFlow Streamlines Operations
          </h2>
          <p className="max-w-xl mx-auto text-sm text-[var(--text-secondary)]">
            A frictionless three-step pipeline built directly into a high-performance visual browser dashboard.
          </p>
        </div>

        {/* Timeline Row */}
        <div className="process-step-grid relative flex flex-col md:flex-row gap-12 md:gap-6 justify-between items-start">
          {/* Connector Line (Desktop) */}
          <div className="hidden md:block absolute top-12 left-10 right-10 h-0.5 bg-[var(--border-color)] z-0 pointer-events-none overflow-hidden">
            <div className="process-line w-full h-full bg-gradient-to-r from-cyan-500 via-emerald-500 to-amber-500 origin-left" />
          </div>

          {steps.map((step, i) => (
            <div key={i} className="process-step group flex-1 flex flex-col items-center md:items-start text-center md:text-left z-10">
              {/* Step bubble with CSS-only hover border and lift */}
              <div
                className={`w-24 h-24 rounded-full flex items-center justify-center border-2 transition-all duration-300 group-hover:scale-105 group-hover:border-cyan-500 shadow-[var(--card-shadow)] bg-[var(--bg-secondary)] border-[var(--border-color)] ${step.glow} mb-6`}
              >
                <div className="relative flex items-center justify-center w-full h-full">
                  <span className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-cyan-500/10 text-cyan-500 border border-cyan-500/20 text-[10px] font-bold flex items-center justify-center">
                    {step.number}
                  </span>
                  <div className="text-cyan-500 dark:text-cyan-400 group-hover:text-emerald-500 transition-colors">
                    {step.icon}
                  </div>
                </div>
              </div>

              {/* Title & Description */}
              <h3 className="text-lg font-bold mb-3 tracking-tight group-hover:text-cyan-500 transition-colors">
                {step.title}
              </h3>
              <p className="text-sm leading-relaxed text-[var(--text-secondary)] md:max-w-[280px]">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
