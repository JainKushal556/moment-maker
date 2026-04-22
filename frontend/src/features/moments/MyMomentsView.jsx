import React, { useState, useMemo, forwardRef, useContext } from 'react';
import {
  Trash2, Sparkles, ArrowUpRight, Heart,
  Palette, Clock, MessageCircle, ZapOff,
  ChevronRight, ChevronLeft, Gift, Music, Cake, Menu, LogOut
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ViewContext } from '../../context/NavContext';
import { templates } from '../../data/templates';
import Footer from '../../layout/Footer';

// --- Theme Config (Moment Maker Branding) ---
const VIBES = {
  CINEMATIC: { label: 'PURPLE / NOIR', color: '#d946ef', text: 'text-fuchsia-400' },
  BOLD: { label: 'ORANGE / VIVID', color: '#f97316', text: 'text-orange-400' },
  MINIMAL: { label: 'GREEN / PURE', color: '#10b981', text: 'text-emerald-400' },
};

const MOCK_MOMENTS = [
  {
    id: '1',
    title: 'Birthday Magic',
    vibe: 'CINEMATIC',
    status: 'shared',
    isFavorite: true,
    sharedAt: Date.now() - (1000 * 60 * 60 * 48),
    expiresAt: Date.now() + (1000 * 60 * 60 * 24),
    color: '#a21caf',
    type: 'Moment Maker Original'
  },
  {
    id: '2',
    title: 'Surprise Gift',
    vibe: 'BOLD',
    status: 'draft',
    isFavorite: false,
    lastEdited: '14m ago',
    color: '#ea580c',
    type: 'Custom Wrapped'
  },
  {
    id: '3',
    title: 'Midnight Song',
    vibe: 'MINIMAL',
    status: 'favorite',
    isFavorite: true,
    color: '#059669',
    type: 'Boutique Template'
  },
  {
    id: '4',
    title: 'Celebration Echo',
    vibe: 'CINEMATIC',
    status: 'shared',
    isFavorite: false,
    sharedAt: Date.now() - (1000 * 60 * 60 * 73),
    expiresAt: Date.now() - (1000 * 60 * 60 * 1),
    color: '#7e22ce',
    type: 'Moment Maker Original'
  },
];

import MomentMagicCard from './MomentMagicCard';
import { useAuth } from '../../context/AuthContext';

export default function MyMomentsView() {
  const [currentView, navigateTo, , setSelectedTemplate, , , transitionRef, , , editingMomentId, setEditingMomentId] = useContext(ViewContext);
  const { currentUser, logout, openAuthModal, loading } = useAuth();
  const [moments, setMoments] = useState(MOCK_MOMENTS);
  const [filter, setFilter] = useState('all');

  const filteredMoments = useMemo(() => {
    if (filter === 'all') return moments;
    if (filter === 'favorites') return moments.filter(m => m.isFavorite);
    if (filter === 'drafts') return moments.filter(m => m.status === 'draft');
    return moments.filter(m => m.status === filter);
  }, [moments, filter]);

  const handleAction = (type, id) => {
    if (type === 'delete') setMoments(m => m.filter(x => x.id !== id));
    if (type === 'toggleFavorite') setMoments(m => m.map(x => x.id === id ? { ...x, isFavorite: !x.isFavorite } : x));
    
    if (type === 'enter' || type === 'click') {
      const moment = moments.find(m => m.id === id);
      if (moment) {
        // Find matching template or fallback to first one for demo
        const template = templates.find(t => t.id === moment.templateId) || templates[0];
        setEditingMomentId(id);
        setSelectedTemplate(template);
        navigateTo('editor');
      }
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigateTo('categories');
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (currentView !== 'moments') return null;

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-fuchsia-500/30 overflow-x-hidden w-full relative z-50">
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.1] z-0"
        style={{ backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`, backgroundSize: '32px 32px' }}
      />

      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-5%] left-[-5%] w-[60%] h-[40%] bg-fuchsia-600/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[10%] right-[-10%] w-[50%] h-[50%] bg-orange-600/5 blur-[120px] rounded-full" />
      </div>

      <nav className="sticky top-0 z-50 bg-black/20 backdrop-blur-md border-b border-white/5 h-12 flex items-center px-8 md:px-16">
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center gap-4 md:gap-16">
            <div className="flex items-center gap-3 md:gap-4">
              <button
                onClick={() => navigateTo('categories')}
                className="group flex items-center gap-3 text-white/40 hover:text-white transition-colors"
                aria-label="Back to categories"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="group-hover:-translate-x-1 transition-transform">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
                <span className="text-[10px] font-mono uppercase tracking-[0.3em] font-bold">BACK TO MOMENTS</span>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3 md:gap-6">
            <button 
                onClick={handleLogout} 
                className="group flex items-center gap-2 text-white/40 hover:text-white transition-all"
            >
                <LogOut size={14} className="group-hover:translate-x-0.5 transition-transform" />
                <span className="text-[10px] font-mono font-bold uppercase tracking-[0.3em]">LOGOUT</span>
            </button>
            <button className="xl:hidden text-white/40 p-2" aria-label="Open menu">
              <Menu size={24} />
            </button>
          </div>
        </div>
      </nav>

      <main 
        className="w-full pb-12 md:pb-24 relative z-10"
        style={{ maxWidth: '1600px', margin: '0 auto', paddingLeft: '32px', paddingRight: '32px', paddingTop: '96px' }}
      >
        <header className="mb-24 md:mb-40 space-y-12 md:space-y-20">
          <div className="space-y-6 md:space-y-8">
            <h1 className="text-6xl md:text-8xl lg:text-[11rem] font-black tracking-tighter leading-[0.85] text-white">
              My<br />
              <span className="text-transparent bg-clip-text bg-linear-to-br from-fuchsia-500 via-pink-400 to-orange-400">Moments.</span>
            </h1>
            
            <div className="border-l-2 border-white/5 pl-6 py-1 max-w-xl">
              <p className="text-white/40 text-sm md:text-base font-medium leading-relaxed">
                Your shared wishes and saved designs, preserved in your digital studio. 
                Craft memories, not just messages.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap justify-end gap-4 md:gap-8 w-full pb-2">
            {['all', 'drafts', 'shared', 'favorites'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`text-[10px] md:text-[11px] font-black uppercase tracking-[0.25em] relative py-4 transition-all ${
                  filter === f ? 'text-white' : 'text-white/30 hover:text-white/60'
                }`}
              >
                {f}
                {filter === f && (
                  <motion.div
                    layoutId="respnav"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-fuchsia-500 shadow-[0_0_15px_#d946ef]"
                  />
                )}
              </button>
            ))}
          </div>
        </header>

        <div style={{ height: '60px' }} className="hidden md:block" />
        <div style={{ height: '30px' }} className="md:hidden" />

        <div>
          <AnimatePresence mode="popLayout">
            {filteredMoments.length > 0 ? (
              <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
                {filteredMoments.map((moment) => (
                  <MomentMagicCard key={moment.id} moment={moment} onAction={handleAction} />
                ))}
              </motion.div>
            ) : (
            <div className="py-32 md:py-56 text-center space-y-6 md:space-y-10 max-w-2xl mx-auto">
              <h3 className="text-4xl md:text-7xl font-black text-white/10 tracking-tighter italic">Empty Canvas.</h3>
              <p className="text-[10px] md:text-sm font-bold uppercase tracking-[0.4em] text-white/10">
                Explore templates to start crafting.
              </p>
              <button onClick={() => setCurrentView('categories')} className="text-xs font-black uppercase tracking-widest text-fuchsia-400 hover:text-white transition-all flex items-center gap-2 mx-auto">
                Categories <ChevronRight size={14} />
              </button>
            </div>
          )}
          </AnimatePresence>
        </div>
        <div style={{ height: '200px' }} />
        <Footer />
      </main>

      <div className="fixed inset-0 pointer-events-none z-100 bg-white opacity-[0.015] mix-blend-overlay" />
    </div>
  );
}
