import React, { useRef, useContext, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import { useGSAP } from "@gsap/react";
import Footer from "../../layout/Footer";
import { ViewContext } from "../../context/NavContext";

gsap.registerPlugin(ScrollTrigger);

const stages = [
  {
    number: "01",
    title: "Conceptual Genesis",
    subtitle: "The Years of Thinking",
    description: "Every great thing begins in silence. Before a single line of code, before a single pixel — there is a long, obsessive period of pure thought. We let ideas age until they're undeniable.",
    image: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?q=80&w=1200&auto=format&fit=crop"
  },
  {
    number: "02",
    title: "Relational Synthesis",
    subtitle: "Finding the Resonance",
    description: "Ideas don't exist alone. We map the invisible threads between memory, emotion, and design — pulling from disparate worlds until a singular, resonant vision begins to hum.",
    image: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1200&auto=format&fit=crop"
  },
  {
    number: "03",
    title: "Unified Convergence",
    subtitle: "The Perfect Lock",
    description: "When story, design, and technology stop competing and start breathing as one — that's the moment. Not built, not shipped. Converged. That's what we make.",
    image: "https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=1200&auto=format&fit=crop"
  }
];

const team = [
  {
    name: "Suman Maji",
    role: "Story",
    bio: "Obsessed with the intersection of nostalgia and technology. Suman ensures every moment feels like a masterpiece.",
    github: "#",
    linkedin: "#"
  },
  {
    name: "Kushal Jain",
    role: "Design",
    bio: "Kushal crafts the visual language of emotion. Every pixel is intentional, every layout a love letter to the user.",
    github: "#",
    linkedin: "#"
  },
  {
    name: "Pritam Sahoo",
    role: "Tech",
    bio: "Pritam translates emotion into code. He builds systems that are fast, fluid, and built for forever.",
    github: "#",
    linkedin: "#"
  }
];

export default function AboutUs() {
  const containerRef = useRef(null);
  const processSectionRef = useRef(null);
  const processContainerRef = useRef(null);
  const [, navigateTo] = useContext(ViewContext);

  useGSAP(() => {
    // Background Blobs Animation
    gsap.to(".bg-blob", {
      x: "random(-100, 100)",
      y: "random(-100, 100)",
      duration: "random(10, 20)",
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      stagger: {
        each: 2,
        from: "random"
      }
    });

    // Hero Animation
    gsap.from(".hero-text", {
      y: 100,
      opacity: 0,
      duration: 1.2,
      ease: "power4.out",
      stagger: 0.2
    });

    // Hero Parallax
    gsap.to(".hero-parallax", {
      scrollTrigger: {
        trigger: ".hero-section",
        start: "top top",
        end: "bottom top",
        scrub: true
      },
      y: 200,
      ease: "none"
    });

    // Section Headers Reveal
    gsap.utils.toArray(".section-header").forEach((header) => {
      gsap.from(header, {
        scrollTrigger: {
          trigger: header,
          start: "top 95%",
          end: "top 70%",
          scrub: 1,
          toggleActions: "play none none reverse"
        },
        y: 60,
        opacity: 0,
        scale: 0.95,
        ease: "power2.out"
      });
    });

    // Story Section Pinning & Reveal
    gsap.to(".story-content", {
      scrollTrigger: {
        trigger: ".story-section",
        start: "top top",
        end: "+=100%",
        pin: window.innerWidth >= 768,
        scrub: 1
      },
      scale: 1.1,
      opacity: 1
    });

    // Stats Staggered Scale
    gsap.from(".stat-item", {
      scrollTrigger: {
        trigger: ".stats-container",
        start: "top 90%",
        toggleActions: "play none none reverse"
      },
      scale: 0,
      opacity: 0,
      stagger: 0.1,
      duration: 1,
      ease: "back.out(1.7)"
    });

    // Process Zig-Zag Story Flow
    if (processSectionRef.current) {
      const section = processSectionRef.current;

      // Central line glow animation
      gsap.to(".process-glow-line", {
        scrollTrigger: {
          trigger: section,
          start: "top center",
          end: "bottom center",
          scrub: true
        },
        height: "100%",
        ease: "none"
      });

      // Content reveal animations
      gsap.utils.toArray(".process-item").forEach((item, i) => {
        const isLeft = i % 2 === 0;
        const content = item.querySelector(".process-content-wrapper");
        const image = item.querySelector(".process-image-container");

        gsap.from(content, {
          scrollTrigger: {
            trigger: item,
            start: "top 80%",
            toggleActions: "play none none reverse"
          },
          x: isLeft ? 100 : -100,
          opacity: 0,
          duration: 1.2,
          ease: "power4.out"
        });

        gsap.from(image, {
          scrollTrigger: {
            trigger: item,
            start: "top 80%",
            toggleActions: "play none none reverse"
          },
          x: isLeft ? -100 : 100,
          opacity: 0,
          duration: 1.2,
          ease: "power4.out",
          delay: 0.2
        });
      });
    }

    // Team Grid Staggered Reveal — disabled (.team-member class removed from DOM)
    // gsap.from(".team-member", {
    //   scrollTrigger: {
    //     trigger: ".team-grid",
    //     start: "top 90%",
    //     end: "bottom 80%",
    //     toggleActions: "play none none reverse"
    //   },
    //   y: 80,
    //   opacity: 0,
    //   stagger: 0.2,
    //   duration: 1.5,
    //   ease: "power4.out"
    // });

    // Magnetic Buttons
    gsap.utils.toArray(".magnetic-btn").forEach((btn) => {
      const onMouseMove = (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        gsap.to(btn, {
          x: x * 0.3,
          y: y * 0.3,
          duration: 0.3,
          ease: "power2.out"
        });
      };
      const onMouseLeave = () => {
        gsap.to(btn, {
          x: 0,
          y: 0,
          duration: 0.5,
          ease: "elastic.out(1, 0.3)"
        });
      };
      btn.addEventListener("mousemove", onMouseMove);
      btn.addEventListener("mouseleave", onMouseLeave);
      return () => {
        btn.removeEventListener("mousemove", onMouseMove);
        btn.removeEventListener("mouseleave", onMouseLeave);
      };
    });

    // Background Blobs Parallax
    gsap.to(".bg-blob", {
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 2
      },
      y: (i) => -200 - (i * 100),
      ease: "none"
    });

    // Final refresh
    ScrollTrigger.refresh();

  }, { scope: containerRef });

  // Force reflow and layout recalculation on mount for proper hydration
  useEffect(() => {
    // Trigger layout recalculation
    if (containerRef.current) {
      containerRef.current.offsetHeight;
    }
    // Refresh ScrollTrigger after DOM is ready
    ScrollTrigger.refresh();
  }, []);

  return (
    <div ref={containerRef} className="bg-[#020204] bg-gradient-to-br from-[#0a0c14] via-[#020204] to-[#050508] text-white selection:bg-transparent selection:text-cyan-500 relative">

      {/* --- PRE-HEADER NAVIGATION --- */}
      <div className="w-full h-12 flex items-center px-4 sm:px-6 md:px-16 border-b border-white/5 bg-black/20 backdrop-blur-md sticky top-0 z-150">
        <button
          onClick={() => navigateTo('landing')}
          className="group flex items-center gap-3 text-white/40 hover:text-white transition-colors pointer-events-auto"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="group-hover:-translate-x-1 transition-transform">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          <span className="text-[10px] font-mono uppercase tracking-[0.3em] font-bold">
            Return Home
          </span>
        </button>
      </div>

      {/* --- CUSTOM COOL BACKGROUND --- */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="bg-blob absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-pink-500/5 blur-[120px]"></div>
        <div className="bg-blob absolute top-[20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/5 blur-[120px]"></div>
        <div className="bg-blob absolute bottom-[-10%] left-[20%] w-[60%] h-[60%] rounded-full bg-purple-500/5 blur-[120px]"></div>
        <div className="bg-blob absolute top-[40%] left-[40%] w-[30%] h-[30%] rounded-full bg-sun-gold/5 blur-[100px]"></div>

        {/* Subtle Scanlines */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.02),rgba(0,255,0,0.01),rgba(0,0,255,0.02))] bg-size-[100%_4px,3px_100%] opacity-20"></div>
      </div>

      {/* --- HERO --- */}
      <section className="hero-section relative min-h-[100svh] sm:min-h-screen flex items-center px-4 sm:px-6 md:px-12 pt-20 sm:pt-24 pb-16 sm:pb-0 overflow-hidden">
        <div className="hero-parallax absolute top-1/4 -left-24 sm:-left-20 w-56 h-56 sm:w-72 sm:h-72 md:w-96 md:h-96 bg-love-gradient opacity-10 blur-[90px] md:blur-[120px] rounded-full pointer-events-none"></div>
        <div className="hero-parallax absolute bottom-1/4 -right-24 sm:-right-20 w-56 h-56 sm:w-72 sm:h-72 md:w-96 md:h-96 bg-sun-gold opacity-5 blur-[90px] md:blur-[120px] rounded-full pointer-events-none"></div>

        <div className="max-w-7xl mx-auto w-full relative z-10">
          <div className="hero-text inline-block mb-4">
            <span className="px-4 py-3 border border-white/20 rounded-full text-xs font-montserrat uppercase tracking-widest text-white/60">
              The Creators
            </span>
          </div>

          <h1 className="font-montserrat font-black uppercase tracking-tighter fluid-h1 mb-8 sm:mb-12 hero-text break-words">
            WE MAKE<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-violet-500 italic font-playfair lowercase inline-block">moments&nbsp;&nbsp;</span><br />
            <span className="text-transparent block leading-[0.8]" style={{ WebkitTextStroke: '1px var(--sun-gold)' }}>
              LIVE FOREVER
            </span>
          </h1>

          <div className="grid md:grid-cols-2 gap-8 sm:gap-12 md:gap-24 items-start md:items-end hero-text">
            <p className="text-2xl sm:text-3xl md:text-6xl leading-[1.2] text-white/95 w-full" style={{ fontFamily: "'Dancing Script', cursive" }}>
              We are three friends building digital artifacts that make memories permanent.
            </p>

            <div className="space-y-4 sm:space-y-6">
              <p className="text-white/40 text-sm sm:text-lg md:text-xl leading-relaxed max-w-md">
                No templates. No shortcuts. Only intentional design and clean systems built for the long haul.
              </p>
              <div className="flex flex-col items-start gap-8">
                <button
                  onClick={() => navigateTo('categories')}
                  className="magnetic-btn relative w-full sm:w-auto px-6 sm:px-12 md:px-16 py-4 sm:py-6 md:py-8 bg-white/5 backdrop-blur-xl border border-sun-gold/40 text-sun-gold font-montserrat font-black uppercase tracking-[0.3em] sm:tracking-[0.4em] text-[10px] sm:text-xs hover:text-white transition-colors duration-500 group overflow-hidden rounded-sm"
                >
                  <span className="relative z-10">Start Creating</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-violet-500 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out"></div>
                </button>

                {/* Mobile Scroll Indicator - only visible on small screens */}
                <div className="flex md:hidden flex-col items-center gap-2 opacity-40 self-center">
                  <div className="w-px h-10 bg-gradient-to-b from-white/90 to-transparent"></div>
                  <span className="text-[9px] uppercase tracking-[0.2em] text-white/70 [writing-mode:vertical-rl] [text-orientation:mixed]">
                    Scroll
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Scroll Indicator - only visible on md and up */}
        <div className="hidden md:flex absolute bottom-12 left-1/2 -translate-x-1/2 flex-col items-center gap-4 opacity-30 z-20 pointer-events-none">
          <div className="w-px h-12 bg-gradient-to-b from-white/90 to-transparent"></div>
          <span className="text-[10px] uppercase tracking-[0.25em] text-white/70 [writing-mode:vertical-rl] [text-orientation:mixed]">
            Scroll
          </span>
        </div>
      </section>

      {/* --- STORY / PHILOSOPHY --- */}
      <section className="story-section py-24 sm:py-32 md:py-64 px-4 sm:px-6 md:px-12 relative overflow-hidden">
        <div className="story-content max-w-4xl mx-auto text-center relative z-10">
          <h2 className="section-header text-4xl sm:text-5xl md:text-8xl font-montserrat font-black uppercase mb-8 sm:mb-12 leading-none">
            WHY WE <span className="italic font-playfair lowercase text-sun-gold">exist</span>
          </h2>

          <p className="section-header text-lg sm:text-xl md:text-4xl font-playfair text-white/70 leading-relaxed italic max-w-[20ch] sm:max-w-none mx-auto">
            "The internet is full of noise. We build things that actually feel something.
            Not just websites — digital time capsules that stay."
          </p>

          <div className="stats-container section-header mt-10 sm:mt-16 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5 md:gap-8">
            {[
              { label: "Moments Created", value: "12K+" },
              { label: "Countries Reached", value: "85+" },
              { label: "Design Awards", value: "14" },
              { label: "Lines of Love", value: "∞" }
            ].map((stat, i) => (
              <div key={i} className="stat-item flex flex-col items-center p-4 sm:p-6 md:p-8 bg-white/3 backdrop-blur-md border border-white/10 rounded-2xl hover:bg-white/5 transition-colors">
                <span className="text-sun-gold font-montserrat font-black text-xl sm:text-2xl md:text-4xl mb-1">{stat.value}</span>
                <span className="text-white/30 text-[10px] uppercase tracking-widest font-bold">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- PROCESS --- */}
      <section id="process-section" ref={processSectionRef} className="process-section relative pt-20 sm:pt-24 pb-24 sm:pb-32 md:pb-64 bg-[#0a0a12] overflow-hidden">

        {/* Central Story Line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/10 -translate-x-1/2 hidden md:block">
          <div className="process-glow-line absolute top-0 left-0 w-full bg-gradient-to-b from-sun-gold via-pink-500 to-transparent h-0 shadow-[0_0_20px_rgba(255,215,0,0.3)]"></div>
        </div>

        {/* THE PROCESS Heading Overlay - Left corner, above images */}
        <div className="absolute left-4 sm:left-6 md:left-12 top-8 sm:top-12 md:top-8 pointer-events-none z-30">
          <h2 className="text-3xl sm:text-4xl md:text-8xl font-black font-montserrat uppercase leading-none opacity-100 text-left">
            THE<br /><span className="text-transparent" style={{ WebkitTextStroke: '1px var(--sun-gold)' }}>PROCESS</span>
          </h2>
        </div>

        <div ref={processContainerRef} className="process-container space-y-20 sm:space-y-24 md:space-y-[200px] relative z-10 pt-28 sm:pt-36 md:pt-64">
          {stages.map((stage, i) => (
            <div key={i} className="process-item relative">
              <div className={`flex flex-col ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-start justify-end gap-8 sm:gap-10 md:gap-32 max-w-7xl mx-auto px-4 sm:px-6 md:px-12`}>

                {/* Image Side */}
                <div className={`process-image-container w-full md:w-2/5 max-w-none sm:max-w-sm relative aspect-[4/3] overflow-hidden group rounded-2xl border border-white/5 ${i === 1 ? 'md:translate-x-14 lg:translate-x-20' : ''}`}>
                  <img
                    src={stage.image}
                    alt={stage.title}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 scale-110 transition-all duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a12] via-transparent to-transparent opacity-60"></div>
                </div>

                {/* Content Side */}
                <div className={`process-content-wrapper w-full md:w-1/2 space-y-4 sm:space-y-6 md:ml-auto md:pl-12 ${i % 2 !== 0 ? 'md:-ml-12 lg:-ml-20' : ''}`}>
                  <div className="relative">
                    <span className="text-6xl sm:text-7xl md:text-[10rem] font-montserrat font-black text-white/5 absolute -top-8 sm:-top-10 md:-top-12 -left-2 sm:-left-4 md:-left-8 pointer-events-none">{stage.number}</span>
                    <div className="relative z-10">
                      <p className="text-sun-gold font-montserrat font-black uppercase tracking-[0.25em] text-xs mb-3 italic opacity-80">
                        {stage.subtitle}
                      </p>
                      <h3 className="max-w-[12ch] sm:max-w-none text-3xl sm:text-4xl md:text-6xl font-montserrat font-black uppercase tracking-tighter leading-[0.9] break-normal">
                        {stage.title}
                      </h3>
                    </div>
                  </div>
                  <p className="text-lg sm:text-xl md:text-2xl text-white/60 font-playfair leading-relaxed max-w-lg">
                    {stage.description}
                  </p>
                  <div className="h-px w-24 bg-sun-gold"></div>
                </div>

                {/* Node on central line */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-[#0a0a12] border-2 border-sun-gold rounded-full z-20 hidden md:block shadow-[0_0_15px_rgba(255,215,0,0.5)]"></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- TEAM --- */}
      <section className="py-24 sm:py-32 md:py-64 px-4 sm:px-6 md:px-12 bg-gradient-to-r from-transparent via-white/5 to-transparent relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 md:mb-24 gap-6 sm:gap-8">
            <div>
              <h2 className="section-header text-4xl sm:text-5xl md:text-9xl font-black font-montserrat uppercase leading-none">
                Meet the <span className="text-sun-gold italic font-playfair normal-case">Makers</span>
              </h2>
              <p className="section-header text-white/40 text-lg sm:text-2xl font-playfair italic mt-3 sm:mt-4">
                Founding Brothers.
              </p>
            </div>
            <p className="section-header text-white/50 text-base sm:text-xl font-playfair max-w-md italic">
              Three friends, one mission: to make the digital world feel a little more human.
            </p>
          </div>

          <div className="team-grid grid md:grid-cols-3 gap-8 sm:gap-12 lg:gap-32">
            {team.map((member, i) => (
              <div key={i} className="group border-l-2 border-white/10 pl-5 sm:pl-8 py-8 sm:py-12 hover:border-sun-gold transition-all duration-500 sm:hover:pl-12">
                <p className="text-sun-gold uppercase tracking-[0.3em] text-[10px] font-black font-montserrat mb-4">
                  {member.role}
                </p>

                {/* mb-6 ekhane name ar bio er majhe gap toiri korbe */}
                <h4 className="text-3xl sm:text-4xl md:text-5xl font-montserrat font-black uppercase tracking-tight mb-6 sm:mb-[50px] leading-[1.1] sm:group-hover:translate-x-2 transition-transform duration-500 break-words md:whitespace-nowrap">
                  {member.name}
                </h4>

                {/* mb-8 ekhane bio ar icons er majhe gap toiri korbe */}
                <p className="text-white/50 text-base sm:text-lg font-playfair italic leading-relaxed mb-6 sm:mb-8 max-w-none sm:max-w-xs">
                  "{member.bio}"
                </p>

                <div className="flex gap-6">
                  <a href={member.github} target="_blank" rel="noopener noreferrer" className="magnetic-btn text-white/30 hover:text-white hover:bg-white/5 transition-all duration-300 flex items-center justify-center w-12 h-12 rounded-full border border-white/10 hover:border-sun-gold">
                    <i className="fab fa-github text-xl"></i>
                  </a>
                  <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="magnetic-btn text-white/30 hover:text-white hover:bg-white/5 transition-all duration-300 flex items-center justify-center w-12 h-12 rounded-full border border-white/10 hover:border-sun-gold">
                    <i className="fab fa-linkedin-in text-xl"></i>
                  </a>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* --- CTA --- */}
      <section className="py-24 sm:py-32 md:py-64 px-4 sm:px-6 md:px-12 text-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[32vw] sm:text-[25vw] font-black font-montserrat text-white/2 uppercase pointer-events-none select-none whitespace-nowrap">
          CREATE NOW
        </div>

        <div className="relative z-10">
          <h2 className="section-header text-4xl sm:text-5xl md:text-8xl font-montserrat font-black uppercase mb-8 sm:mb-12 max-w-5xl mx-auto leading-tight">
            READY TO MAKE A <span className="text-sun-gold">MOMENT?</span>
          </h2>
          <button
            onClick={() => navigateTo('categories')}
            className="section-header magnetic-btn relative overflow-hidden w-full sm:w-auto px-8 sm:px-12 py-4 sm:py-6 bg-white text-black font-montserrat font-black uppercase tracking-[0.2em] sm:tracking-widest text-sm sm:text-lg hover:text-white transition-colors duration-500 group"
          >
            <span className="relative z-10">Get Started</span>
            <div className="absolute inset-0 bg-sun-gold translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
