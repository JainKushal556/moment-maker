import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import Footer from '../../layout/Footer';

export default function CopyrightPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.classList.add('view-legal');
    return () => document.body.classList.remove('view-legal');
  }, []);

  const sections = [
    {
      id: "01",
      title: "Code & Architecture Ownership",
      points: [
        "All source code (React components, Vite configurations, backend logic) is the exclusive property of Moment Crafter.",
        "The proprietary iframe-based template rendering and postMessage communication system cannot be replicated.",
        "Attempting to de-obfuscate, reverse-engineer, or bypass our domain-lock security scripts is a direct violation of our Terms.",
        "Scraping or unauthorized downloading of the 'dist' build files is strictly prohibited."
      ]
    },
    {
      id: "02",
      title: "Visual Design & 'Trade Dress'",
      points: [
        "The specific combination of colors, typography, glassmorphism effects, and layout structures constitutes our protected 'Trade Dress'.",
        "Pixel-perfect visual cloning or creating 'lookalike' websites that confuse users about the origin of the service is illegal.",
        "Re-creating our UI/UX flow from scratch to mimic our platform's exact functionality is considered intellectual property theft."
      ]
    },
    {
      id: "03",
      title: "Media & Asset Protection",
      points: [
        "Custom SVG animations, Lottie files, and transition effects used on this platform are licensed exclusively to us or created in-house.",
        "Extracting background music (BGM), images, or any graphical assets from our network requests for external use is forbidden.",
        "Digital signatures and invisible watermarks are embedded within our assets to track unauthorized usage across the web."
      ]
    },
    {
      id: "04",
      title: "Anti-Cloning & Enforcement (DMCA)",
      points: [
        "We actively utilize automated tools to scan the web for unauthorized clones of Moment Crafter.",
        "Upon detecting a clone, we immediately issue formal DMCA Takedown Notices to the hosting providers (e.g., Vercel, Firebase, Netlify, Hostinger).",
        "We report infringing domains to Google Search Console and advertising networks, resulting in de-indexing and blacklisting.",
        "We reserve the right to take legal action against individuals or entities that commercially exploit our stolen assets."
      ]
    },
    {
      id: "05",
      title: "Allowed vs. Prohibited Usage",
      points: [
        "ALLOWED: Using the platform as intended to generate and share personal templates via our official domain.",
        "PROHIBITED: Selling or renting our templates as a service on external platforms or to local businesses.",
        "PROHIBITED: Attempting to embed our templates via iframe on unauthorized external domains.",
        "PROHIBITED: Removing or obscuring the 'Made with Moment Crafter' watermark from shared links."
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-fuchsia-500/30 w-full relative z-50">
      {/* Background Effects */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.1] z-0"
        style={{ backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`, backgroundSize: '32px 32px' }}
      />
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-5%] left-[-5%] w-[60%] h-[40%] bg-fuchsia-600/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[10%] right-[-10%] w-[50%] h-[50%] bg-orange-600/5 blur-[120px] rounded-full" />
      </div>

      <nav className="sticky top-0 z-50 bg-black/20 backdrop-blur-md border-b border-white/5 w-full h-12 flex items-center px-6 md:px-12">
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => window.history.back()}
              className="group flex items-center gap-2 md:gap-3 text-white/40 hover:text-white transition-colors"
              aria-label="Go back"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="group-hover:-translate-x-1 transition-transform">
                <polyline points="15 18 9 12 15 6" />
              </svg>
              <span className="text-[9px] md:text-[10px] font-mono uppercase tracking-[0.2em] md:tracking-[0.3em] font-bold whitespace-nowrap">BACK</span>
            </button>
          </div>
        </div>
      </nav>

      <main className="w-full max-w-[1600px] mx-auto px-6 md:px-12 pt-16 md:pt-24 pb-12 md:pb-24 relative z-10">
        <header className="mb-20 md:mb-32 space-y-8 md:space-y-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <h1 className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-[1.1] text-white">
              Copyright<br />
              <span className="text-transparent bg-clip-text bg-linear-to-br from-fuchsia-500 via-pink-400 to-orange-400">Policy.</span>
            </h1>

            <div className="border-l border-white/10 pl-4 md:pl-6 py-1 max-w-[300px] sm:max-w-xl mb-1 md:mb-6">
              <p className="text-white/40 text-[10px] sm:text-sm md:text-base font-medium leading-tight sm:leading-relaxed">
                A comprehensive breakdown of our intellectual property rights, prohibited actions, and enforcement protocols.
              </p>
            </div>
          </div>
        </header>

        {/* Single Page Content Area */}
        <div className="space-y-16 md:space-y-24">
          {sections.map((section, index) => (
            <motion.section 
              key={section.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative"
            >
              <div className="flex flex-col md:flex-row gap-6 md:gap-12">
                
                {/* Section Header */}
                <div className="md:w-1/3 shrink-0">
                  <div className="sticky top-24">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-fuchsia-500 font-mono font-bold text-sm tracking-widest">{section.id}</span>
                      <div className="h-[1px] w-12 bg-fuchsia-500/30" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight leading-tight">
                      {section.title}
                    </h2>
                  </div>
                </div>

                {/* Section Points */}
                <div className="md:w-2/3 space-y-4">
                  {section.points.map((point, pIndex) => {
                    const isAllowed = point.startsWith("ALLOWED:");
                    const isProhibited = point.startsWith("PROHIBITED:");
                    
                    let pointClass = "bg-white/5 border border-white/5 p-5 md:p-6 rounded-2xl hover:bg-white/10 transition-colors duration-300";
                    let textClass = "text-white/70 font-light leading-relaxed text-sm md:text-base";
                    let iconColor = "text-fuchsia-400";
                    
                    if (isAllowed) {
                      pointClass = "bg-emerald-500/5 border border-emerald-500/20 p-5 md:p-6 rounded-2xl";
                      iconColor = "text-emerald-400";
                    } else if (isProhibited) {
                      pointClass = "bg-red-500/5 border border-red-500/20 p-5 md:p-6 rounded-2xl";
                      iconColor = "text-red-400";
                    }

                    return (
                      <div key={pIndex} className={pointClass}>
                        <div className="flex gap-4">
                          <div className={`mt-1 shrink-0 ${iconColor}`}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              {isProhibited ? (
                                <>
                                  <circle cx="12" cy="12" r="10" />
                                  <line x1="15" y1="9" x2="9" y2="15" />
                                  <line x1="9" y1="9" x2="15" y2="15" />
                                </>
                              ) : isAllowed ? (
                                <>
                                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                  <polyline points="22 4 12 14.01 9 11.01" />
                                </>
                              ) : (
                                <polyline points="9 18 15 12 9 6" />
                              )}
                            </svg>
                          </div>
                          <p className={textClass}>
                            {isAllowed || isProhibited ? (
                              <>
                                <strong className={`font-bold ${isAllowed ? 'text-emerald-400' : 'text-red-400'}`}>
                                  {isAllowed ? 'ALLOWED: ' : 'PROHIBITED: '}
                                </strong>
                                {point.replace(/^(ALLOWED:|PROHIBITED:)\s*/, '')}
                              </>
                            ) : (
                              point
                            )}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>

              </div>
            </motion.section>
          ))}
        </div>
        <div style={{ height: '200px' }} />
      </main>

      <Footer />

      <div className="fixed inset-0 pointer-events-none z-100 bg-white opacity-[0.015] mix-blend-overlay" />
    </div>
  )
}
