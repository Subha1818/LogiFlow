import React from 'react';

export default function FeaturesSection() {
  const features = [
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="6" cy="6" r="3" />
          <circle cx="18" cy="18" r="3" />
          <line x1="8.1" y1="8.1" x2="15.9" y2="15.9" />
          <path d="M12 6h6v6" />
        </svg>
      ),
      title: "Dijkstra's Shortest Path",
      description: "Instantly compute the quickest path between warehouse hubs and delivery points, minimizing fuel and travel times.",
      color: "from-emerald-500 to-teal-600",
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2L2 7l10 5 10-5-10-5z" />
          <path d="M2 17l10 5 10-5" />
          <path d="M2 12l10 5 10-5" />
        </svg>
      ),
      title: "Kruskal's Spanning Trees",
      description: "Establish minimal spanning logistics pipelines. Connect all distribution nodes with the absolute lowest infrastructure overhead.",
      color: "from-amber-500 to-orange-600",
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M21 12H3" />
          <path d="M12 3v18" />
        </svg>
      ),
      title: "Interactive Network Canvas",
      description: "Add nodes, customize link weights, and watch calculations unfold step-by-step with real-time visual tracing.",
      color: "from-cyan-500 to-blue-600",
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
      ),
      title: "Seamless Reports Export",
      description: "Download routes, network stats, and node data instantly as physical-ready PDF documents or high-fidelity raw JSON.",
      color: "from-indigo-500 to-purple-600",
    },
  ];

  return (
    <section
      id="features"
      className="features-cover-reveal relative z-30 -mt-[100vh] min-h-screen will-change-transform py-24 px-6 md:px-12 overflow-hidden bg-gradient-to-b from-transparent to-[var(--bg-tertiary)] bg-[var(--bg-primary)] rounded-t-[2.5rem] md:rounded-t-[3.5rem] shadow-[-2px_-15px_30px_rgba(0,0,0,0.06)] dark:shadow-[-2px_-15px_40px_rgba(0,0,0,0.5)] border-t border-[var(--border-color)]/30"
    >
      {/* Background glow effects */}
      <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto">
        {/* Section Title */}
        <div className="text-center mb-16">
          <span className="text-xs font-semibold uppercase tracking-wider px-3 py-1.5 rounded-full bg-cyan-500/10 text-cyan-500 border border-cyan-500/20">
            Powerful Core Features
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold mt-4 mb-3 tracking-tight">
            Tailored Logistics Decision Systems
          </h2>
          <p className="max-w-xl mx-auto text-sm text-[var(--text-secondary)]">
            Deploy advanced graph computing to streamline delivery nodes, map distributions, and cut carbon and fuel costs.
          </p>
        </div>

        {/* Features Grid */}
        <div className="feature-card-grid grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, i) => (
            <div
              key={i}
              className="feature-card group relative p-8 rounded-2xl border transition-all duration-300 hover:-translate-y-2 hover:shadow-[var(--card-shadow-hover)] hover:border-cyan-500 cursor-default overflow-hidden bg-[var(--bg-secondary)] border-[var(--border-color)] shadow-[var(--card-shadow)]"
            >
              {/* Corner highlight gradient */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="flex gap-5 items-start">
                {/* Glow Icon Base with scale/rotate effect */}
                <div className={`p-3.5 rounded-xl text-white bg-gradient-to-br ${feature.color} shadow-lg shrink-0 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300`}>
                  {feature.icon}
                </div>

                <div>
                  <h3 className="text-lg font-bold mb-2 tracking-tight group-hover:text-cyan-500 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
