import React, { useState, useEffect, useMemo, forwardRef, useContext } from 'react';
import { 
  Plus, Search, Share2, Edit3, Trash2, Star, Copy, 
  Sparkles, Filter, ArrowUpRight, Heart,
  Palette, Clock, Zap, MessageCircle,
  ZapOff, Calendar, ChevronRight, ChevronLeft, Gift, Music, Cake, Menu
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ViewContext } from '../../context/NavContext';

// --- Theme Config (Moment Maker Branding) ---
const VIBES = {
  CINEMATIC: { label: 'PURPLE / NOIR', color: '#d946ef', accent: 'bg-fuchsia-500', text: 'text-fuchsia-400' },
  BOLD: { label: 'ORANGE / VIVID', color: '#f97316', accent: 'bg-orange-500', text: 'text-orange-400' },
  MINIMAL: { label: 'GREEN / PURE', color: '#10b981', accent: 'bg-emerald-500', text: 'text-emerald-400' },
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

// --- Components ---

const ExpiryComplication = ({ expiresAt }) => {
  const timeLeft = expiresAt - Date.now();
  const isExpired = timeLeft <= 0;
  
  if (isExpired) return (
    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400">
      <ZapOff size={10} />
      <span className="text-[9px] font-black tracking-widest uppercase">Expired</span>
    </div>
  );

  const hoursLeft = Math.floor(timeLeft / (1000 * 60 * 60));
  const progress = Math.max(0, (timeLeft / (1000 * 60 * 60 * 72)) * 100);

  return (
    <div className="flex items-center gap-2 md:gap-3 px-3 md:px-4 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
      <div className="relative w-3.5 h-3.5 md:w-4 md:h-4">
        <svg className="w-full h-full -rotate-90">
          <circle cx="50%" cy="50%" r="40%" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/5" />
          <circle 
            cx="50%" cy="50%" r="40%" fill="none" stroke="currentColor" strokeWidth="2" 
            strokeDasharray="100%" strokeDashoffset={`${100 - progress}%`}
            className="text-emerald-500" 
            strokeLinecap="round"
          />
        </svg>
      </div>
      <span className="text-[9px] md:text-[10px] font-bold tracking-widest uppercase whitespace-nowrap">{hoursLeft}H REMAINING</span>
    </div>
  );
};

const MomentCard = forwardRef(({ moment, onAction, ...props }, ref) => {
  const vibe = VIBES[moment.vibe] || VIBES.MINIMAL;
  const isExpired = moment.status === 'shared' && (moment.expiresAt - Date.now() <= 0);

  return (
    <motion.div
      {...props}
      ref={ref}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      whileHover={{ y: -8 }}
      className="relative group w-full aspect-[3/4.2] md:aspect-[3/4.4] overflow-hidden rounded-[2.5rem] md:rounded-[3rem] bg-zinc-900/40 border border-white/10 shadow-2xl backdrop-blur-md"
    >
      <div 
        className={`absolute inset-0 opacity-20 group-hover:opacity-50 transition-all duration-1000 group-hover:scale-110 blur-[60px] ${isExpired ? 'grayscale' : ''}`}
        style={{ background: `radial-gradient(circle at 50% 30%, ${moment.color}, transparent 80%)` }}
      />
      
      <div className="absolute inset-0 p-6 md:p-10 flex flex-col justify-between z-10">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
             <span className={`text-[9px] md:text-[10px] font-black tracking-[0.4em] ${vibe.text} uppercase block`}>{vibe.label}</span>
             <span className="text-[8px] font-mono text-white/30 uppercase tracking-widest">{moment.type}</span>
          </div>
          <button 
            onClick={(e) => { e.stopPropagation(); onAction('toggleFavorite', moment.id); }}
            className={`w-10 h-10 md:w-12 md:h-12 rounded-2xl flex items-center justify-center transition-all border ${
              moment.isFavorite ? 'bg-fuchsia-500 text-white border-fuchsia-400 shadow-lg shadow-fuchsia-500/30' : 'bg-white/5 text-white/20 border-white/10'
            }`}
          >
            <Heart size={16} fill={moment.isFavorite ? "currentColor" : "none"} />
          </button>
        </div>

        <div className="space-y-6 md:space-y-10">
          <div className="space-y-3 md:space-y-5">
            <h3 className={`text-2xl md:text-4xl font-bold tracking-tighter leading-tight text-white ${isExpired ? 'opacity-30' : ''}`}>
              {moment.title}
            </h3>
            
            <div className="min-h-[28px] md:min-h-[32px] flex items-center">
              {moment.status === 'shared' ? (
                <ExpiryComplication expiresAt={moment.expiresAt} />
              ) : (
                <div className="flex items-center gap-2 text-white/40">
                  <Clock size={12} />
                  <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em]">{moment.status === 'draft' ? `Draft: ${moment.lastEdited}` : 'Ready to Craft'}</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-3 pt-6 md:pt-8 border-t border-white/10">
             <button 
               disabled={isExpired}
               className={`flex-1 h-12 md:h-14 rounded-2xl text-[10px] md:text-[11px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                 isExpired 
                 ? 'bg-white/5 text-white/20 border border-white/5' 
                 : 'bg-white text-black hover:bg-fuchsia-600 hover:text-white shadow-lg active:scale-95'
               }`}
             >
               {isExpired ? 'Restore' : moment.status === 'favorite' ? 'Create' : 'Resume'} <ArrowUpRight size={16} />
             </button>
             <button onClick={() => onAction('delete', moment.id)} className="w-12 md:w-14 h-12 md:h-14 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-white/20 hover:text-red-400 hover:bg-red-400/5 transition-all">
                <Trash2 size={16} />
             </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

MomentCard.displayName = 'MomentCard';

export default function MyMomentsView() {
  const [currentView, setCurrentView] = useContext(ViewContext);
  const [moments, setMoments] = useState(MOCK_MOMENTS);
  const [filter, setFilter] = useState('all');

  const filteredMoments = useMemo(() => {
    if (filter === 'all') return moments;
    if (filter === 'favorites') return moments.filter(m => m.isFavorite);
    return moments.filter(m => m.status === filter);
  }, [moments, filter]);

  const handleAction = (type, id) => {
    if (type === 'delete') setMoments(m => m.filter(x => x.id !== id));
    if (type === 'toggleFavorite') setMoments(m => m.map(x => x.id === id ? {...x, isFavorite: !x.isFavorite} : x));
  };

  if (currentView !== 'moments') return null;

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-fuchsia-500/30 overflow-x-hidden w-full absolute top-0 left-0 z-50">
      
      {/* Pattern Background */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.1] z-0" 
        style={{ backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`, backgroundSize: '32px 32px' }} 
      />

      {/* Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-5%] left-[-5%] w-[60%] h-[40%] bg-fuchsia-600/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[10%] right-[-10%] w-[50%] h-[50%] bg-orange-600/5 blur-[120px] rounded-full" />
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-black/60 backdrop-blur-3xl border-b border-white/5">
        <div className="max-w-[1600px] mx-auto px-4 md:px-10 h-20 md:h-24 flex items-center justify-between">
          
          {/* Left - Back Button */}
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setCurrentView('categories')}
              className="flex items-center gap-2 px-3 py-2 text-white/50 hover:text-white hover:bg-white/5 rounded-xl transition-all"
            >
              <ChevronLeft size={20} />
              <span className="text-[11px] font-black uppercase tracking-widest hidden sm:block">Explore</span>
            </button>
            <div className="h-6 w-px bg-white/10 hidden sm:block" />
            <div className="flex items-center gap-2 font-black uppercase tracking-widest text-[#d946ef] text-sm md:text-base">
              <Sparkles size={16} className="inline mr-1" />
              Moment Maker
            </div>
          </div>

          {/* Right - Missing Links / Create */}
          <div className="flex items-center gap-6">
             <div className="hidden lg:flex items-center gap-6 mx-6 border-r border-white/10 pr-6 text-[10px] font-black tracking-widest uppercase text-white/40">
                <span className="hover:text-white cursor-pointer transition-colors">Archive</span>
                <span className="hover:text-white cursor-pointer transition-colors">Settings</span>
             </div>
             <button onClick={() => setCurrentView('categories')} className="bg-white text-black px-6 md:px-8 h-10 md:h-12 rounded-xl text-[10px] md:text-xs font-black uppercase tracking-widest hover:bg-fuchsia-500 hover:text-white transition-all active:scale-95">
                + New Moment
             </button>
          </div>
        </div>
      </nav>

      <main className="max-w-[1600px] mx-auto px-4 md:px-10 py-12 md:py-24 relative z-10">
        
        {/* Responsive Hero Header */}
        <header className="mb-20 lg:mb-40 flex flex-col lg:flex-row lg:items-end justify-between gap-10 md:gap-20">
          <div className="space-y-4 md:space-y-6">
             <h2 className="text-[10px] font-black tracking-[0.4em] text-white/20 uppercase">Personal Archive</h2>
             <h1 className="text-5xl md:text-8xl lg:text-[11rem] font-black tracking-tighter leading-[0.9] text-white">
                My<br/><span className="text-transparent bg-clip-text bg-gradient-to-br from-fuchsia-500 via-pink-400 to-orange-400">Moments.</span>
             </h1>
             <p className="text-white/40 text-base md:text-xl font-medium max-w-lg leading-relaxed">
                Your shared wishes and saved designs, preserved in your digital studio.
             </p>
          </div>

          <div className="flex flex-wrap gap-6 md:gap-12 pb-4 md:pb-6 border-b border-white/5 w-full lg:w-auto">
            {['all', 'drafts', 'shared', 'favorites'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`text-[10px] md:text-xs font-black uppercase tracking-[0.3em] relative py-2 transition-all ${
                  filter === f ? 'text-white' : 'text-white/15 hover:text-white/40'
                }`}
              >
                {f}
                {filter === f && (
                  <motion.div 
                    layoutId="respnav" 
                    className="absolute -bottom-[18px] md:-bottom-[25px] left-0 right-0 h-1 md:h-1.5 bg-fuchsia-500 shadow-[0_0_15px_#d946ef]" 
                  />
                )}
              </button>
            ))}
          </div>
        </header>

        {/* Gallery Grid - Responsive Columns */}
        <AnimatePresence mode="popLayout">
          {filteredMoments.length > 0 ? (
            <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-12">
              {filteredMoments.map((moment) => (
                <MomentCard key={moment.id} moment={moment} onAction={handleAction} />
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

        {/* Responsive Footer */}
        <footer className="mt-40 md:mt-72 pb-16 md:pb-24 border-t border-white/5 pt-12 md:pt-20 flex flex-col md:flex-row justify-between items-center gap-10 md:gap-16 opacity-30">
          <div className="space-y-4 md:space-y-6 text-center md:text-left">
            <h4 className="text-2xl md:text-4xl font-black uppercase tracking-tighter">Moment Maker.</h4>
            <p className="text-[9px] font-black tracking-[0.4em] uppercase">Premium Collective Archive // 2026</p>
          </div>
          <div className="flex gap-8 md:gap-16 text-[9px] font-black tracking-[0.4em] uppercase">
            <a href="#" className="hover:text-fuchsia-400 transition-colors">Privacy</a>
            <a href="#" className="hover:text-fuchsia-400 transition-colors">Support</a>
            <a href="#" className="hover:text-fuchsia-400 transition-colors">Community</a>
          </div>
        </footer>
      </main>

      {/* Grain Texture */}
      <div className="fixed inset-0 pointer-events-none z-[100] bg-white opacity-[0.015] mix-blend-overlay" />
    </div>
  );
}
