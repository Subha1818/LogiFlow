import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

export default function AlgorithmsSection() {
  const containerRef = useRef(null);

  useGSAP(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    gsap.fromTo('.algo-card',
      { opacity: 0, scale: 0.95, y: 30 },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: 'back.out(1.2)',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 70%',
          toggleActions: 'play none none none',
        }
      }
    );
  }, { scope: containerRef });

  return (
    <section id="algorithms" ref={containerRef} className="py-24 px-6 md:px-12 bg-gradient-to-b from-[var(--bg-tertiary)] to-[var(--bg-primary)] overflow-hidden">
      <div className="max-w-6xl mx-auto">
        {/* Title */}
        <div className="text-center mb-16">
          <span className="text-xs font-semibold uppercase tracking-wider px-3 py-1.5 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20">
            Engine Optimization
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold mt-4 mb-3 tracking-tight">
            The Algorithmic Core of LogiFlow
          </h2>
          <p className="max-w-xl mx-auto text-sm text-[var(--text-secondary)]">
            LogiFlow utilizes mathematically proven algorithms to resolve complex distribution puzzles in milliseconds.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Dijkstra Card */}
          <div
            className="algo-card group p-8 rounded-2xl border transition-all duration-300 cursor-default"
            style={{
              background: 'var(--bg-secondary)',
              borderColor: 'var(--border-color)',
              boxShadow: 'var(--card-shadow)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-path-500)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-color)';
            }}
          >
            <div className="flex flex-col md:flex-row gap-6 items-start">
              {/* SVG Network Visual (Dijkstra) */}
              <div className="w-full md:w-44 h-44 rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] flex items-center justify-center shrink-0 overflow-hidden relative">
                <svg width="150" height="150" className="w-full h-full p-4">
                  {/* Edges */}
                  <line x1="25" y1="75" x2="65" y2="35" stroke="var(--border-color)" strokeWidth="1.5" />
                  <line x1="25" y1="75" x2="65" y2="115" stroke="var(--border-color)" strokeWidth="1.5" />
                  <line x1="65" y1="35" x2="125" y2="75" stroke="var(--border-color)" strokeWidth="1.5" />
                  <line x1="65" y1="115" x2="125" y2="75" stroke="var(--border-color)" strokeWidth="1.5" />
                  
                  {/* Dijkstra Path Highlighted (Shortest Path: Start -> Top -> End) */}
                  <path d="M 25 75 L 65 35 L 125 75" fill="none" stroke="var(--color-path-500)" strokeWidth="3" strokeLinecap="round" className="stroke-dash-animation opacity-80 group-hover:opacity-100 transition-opacity" style={{ strokeDasharray: '200', strokeDashoffset: '0' }} />
                  
                  {/* Nodes */}
                  {/* Start (Left) */}
                  <circle cx="25" cy="75" r="8" fill="var(--color-brand-500)" className="animate-pulse" />
                  <text x="25" y="79" fill="white" fontSize="9" fontWeight="bold" textAnchor="middle">A</text>
                  
                  {/* Mid Top */}
                  <circle cx="65" cy="35" r="7" fill="var(--color-path-500)" />
                  <text x="65" y="38" fill="white" fontSize="8" fontWeight="bold" textAnchor="middle">B</text>
                  
                  {/* Mid Bottom */}
                  <circle cx="65" cy="115" r="7" fill="var(--text-tertiary)" />
                  <text x="65" y="118" fill="white" fontSize="8" fontWeight="bold" textAnchor="middle">C</text>
                  
                  {/* End (Right) */}
                  <circle cx="125" cy="75" r="8" fill="var(--color-path-500)" />
                  <text x="125" y="79" fill="white" fontSize="9" fontWeight="bold" textAnchor="middle">D</text>

                  {/* Weights labels */}
                  <rect x="40" y="47" width="10" height="9" rx="2" fill="var(--bg-secondary)" />
                  <text x="45" y="54" fill="var(--text-secondary)" fontSize="7" textAnchor="middle">2</text>

                  <rect x="40" y="93" width="10" height="9" rx="2" fill="var(--bg-secondary)" />
                  <text x="45" y="100" fill="var(--text-secondary)" fontSize="7" textAnchor="middle">6</text>

                  <rect x="90" y="47" width="10" height="9" rx="2" fill="var(--bg-secondary)" />
                  <text x="95" y="54" fill="var(--text-secondary)" fontSize="7" textAnchor="middle">3</text>

                  <rect x="90" y="93" width="10" height="9" rx="2" fill="var(--bg-secondary)" />
                  <text x="95" y="100" fill="var(--text-secondary)" fontSize="7" textAnchor="middle">1</text>
                </svg>
              </div>

              <div>
                <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-full uppercase tracking-wider border border-emerald-500/20">
                  Dijkstra's Engine
                </span>
                <h3 className="text-xl font-bold mt-3 mb-2 tracking-tight group-hover:text-emerald-500 transition-colors">
                  Shortest Route Calculation
                </h3>
                <p className="text-sm leading-relaxed text-[var(--text-secondary)] mb-4">
                  Finds the absolute shortest path from a starting hub to one or multiple destination nodes.
                </p>
                <div className="p-3.5 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-color)]">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-tertiary)] mb-1">Optimal Use Case</h4>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                    Determining precise dispatch routes for a single delivery vehicle routing between multiple hubs along mapped road distances.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Kruskal Card */}
          <div
            className="algo-card group p-8 rounded-2xl border transition-all duration-300 cursor-default"
            style={{
              background: 'var(--bg-secondary)',
              borderColor: 'var(--border-color)',
              boxShadow: 'var(--card-shadow)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-mst-500)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-color)';
            }}
          >
            <div className="flex flex-col md:flex-row gap-6 items-start">
              {/* SVG Network Visual (Kruskal) */}
              <div className="w-full md:w-44 h-44 rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] flex items-center justify-center shrink-0 overflow-hidden relative">
                <svg width="150" height="150" className="w-full h-full p-4">
                  {/* Edges */}
                  {/* Redundant loop edge (B to C) - normal color */}
                  <line x1="75" y1="25" x2="75" y2="125" stroke="var(--border-color)" strokeWidth="1.5" strokeDasharray="3" />
                  
                  {/* Kruskal MST Edges (Start to others, forming a tree without loops) */}
                  <line x1="25" y1="75" x2="75" y2="25" stroke="var(--color-mst-500)" strokeWidth="3" strokeLinecap="round" />
                  <line x1="25" y1="75" x2="75" y2="125" stroke="var(--color-mst-500)" strokeWidth="3" strokeLinecap="round" />
                  <line x1="75" y1="25" x2="125" y2="75" stroke="var(--color-mst-500)" strokeWidth="3" strokeLinecap="round" />

                  {/* Nodes */}
                  <circle cx="25" cy="75" r="7" fill="var(--color-mst-500)" />
                  <text x="25" y="78" fill="white" fontSize="8" fontWeight="bold" textAnchor="middle">A</text>

                  <circle cx="75" cy="25" r="7" fill="var(--color-mst-500)" />
                  <text x="75" y="28" fill="white" fontSize="8" fontWeight="bold" textAnchor="middle">B</text>

                  <circle cx="75" cy="125" r="7" fill="var(--color-mst-500)" />
                  <text x="75" y="128" fill="white" fontSize="8" fontWeight="bold" textAnchor="middle">C</text>

                  <circle cx="125" cy="75" r="7" fill="var(--color-mst-500)" />
                  <text x="125" y="78" fill="white" fontSize="8" fontWeight="bold" textAnchor="middle">D</text>

                  {/* Weights labels */}
                  <rect x="45" y="42" width="10" height="9" rx="2" fill="var(--bg-secondary)" />
                  <text x="50" y="49" fill="var(--text-secondary)" fontSize="7" textAnchor="middle">1</text>

                  <rect x="45" y="98" width="10" height="9" rx="2" fill="var(--bg-secondary)" />
                  <text x="50" y="105" fill="var(--text-secondary)" fontSize="7" textAnchor="middle">2</text>

                  <rect x="95" y="42" width="10" height="9" rx="2" fill="var(--bg-secondary)" />
                  <text x="100" y="49" fill="var(--text-secondary)" fontSize="7" textAnchor="middle">3</text>

                  <rect x="70" y="70" width="10" height="9" rx="2" fill="var(--bg-secondary)" />
                  <text x="75" y="77" fill="var(--text-secondary)" fontSize="7" textAnchor="middle">5</text>
                </svg>
              </div>

              <div>
                <span className="text-[10px] font-bold text-amber-500 bg-amber-500/10 px-2.5 py-1 rounded-full uppercase tracking-wider border border-amber-500/20">
                  Kruskal's MST
                </span>
                <h3 className="text-xl font-bold mt-3 mb-2 tracking-tight group-hover:text-amber-500 transition-colors">
                  Minimum Spanning Network
                </h3>
                <p className="text-sm leading-relaxed text-[var(--text-secondary)] mb-4">
                  Connects all nodes in a network together with the absolute lowest combined weight, avoiding loops.
                </p>
                <div className="p-3.5 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-color)]">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-tertiary)] mb-1">Optimal Use Case</h4>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                    Designing connection routes (such as highway networks or shipping routes) that link all hubs with minimal structural overhead.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
