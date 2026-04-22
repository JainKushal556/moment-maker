import React, { useState, useMemo, forwardRef, useContext, useEffect } from 'react';
import {
  Trash2, Sparkles, ArrowUpRight,
  ChevronRight, Menu, LogOut
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ViewContext } from '../../context/NavContext';
import { templates } from '../../data/templates';
import Footer from '../../layout/Footer';



import MomentMagicCard from './MomentMagicCard';
import { useAuth } from '../../context/AuthContext';
import { getMoments } from '../../services/api';

export default function MyMomentsView() {
  const [currentView, navigateTo, , setSelectedTemplate, , setTemplateCustomization, transitionRef, , , editingMomentId, setEditingMomentId] = useContext(ViewContext);
  const { currentUser, logout, openAuthModal, loading, favorites } = useAuth();
  const [moments, setMoments] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (currentUser) {
        getMoments()
            .then(data => {
                if (data && Array.isArray(data)) {
                    // Use the title directly from the database
                    const enriched = data.map(m => ({
                        ...m,
                        type: m.title || 'Moment Maker Original'
                    }));
                    setMoments(enriched);
                }
            })
            .catch(err => console.error("Error fetching moments:", err));
    }
  }, [currentUser]);

  const filteredMoments = useMemo(() => {
    if (filter === 'favorites') {
      return templates
        .filter(t => favorites?.includes(t.id))
        .map(t => ({
          ...t,
          isTemplate: true,
          image: t.img,
          vibe: t.tag || 'CINEMATIC',
          status: 'favorite'
        }));
    }
    if (filter === 'all') return moments;
    if (filter === 'drafts') return moments.filter(m => m.status === 'draft');
    return moments.filter(m => m.status === filter);
  }, [moments, filter, favorites]);

  const handleAction = (type, id) => {
    if (type === 'delete') {
        // Optimistic delete
        setMoments(m => m.filter(x => x.id !== id));
        // Real delete
        const moment = moments.find(m => m.id === id);
        if (moment) {
            import('../../services/api').then(api => api.deleteMoment(id)).catch(console.error);
        }
    }
    
    if (type === 'enter' || type === 'click' || type === 'build') {
      // If it's a template (from favorites tab)
      if (id && templates.find(t => t.id === id)) {
          const template = templates.find(t => t.id === id);
          setSelectedTemplate(template);
          navigateTo('editor');
          return;
      }
      
      const moment = moments.find(m => m.id === id);
      if (moment) {
        // 1. Sync customization data from database to context
        if (moment.customization) {
            setTemplateCustomization(prev => ({
                ...prev,
                [moment.templateId]: moment.customization
            }));
        }

        // 2. Prepare editor state
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
      navigateTo('landing');
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

        <div className="min-h-[60vh] flex items-center justify-center">
          <AnimatePresence mode="popLayout">
            {filteredMoments.length > 0 ? (
              <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
                {filteredMoments.map((moment) => (
                  <MomentMagicCard 
                    key={moment.id} 
                    moment={moment} 
                    isTemplate={moment.isTemplate}
                    onAction={handleAction} 
                  />
                ))}
              </motion.div>
            ) : (
            <div className="w-full text-center space-y-8 md:space-y-12 max-w-2xl mx-auto flex flex-col items-center">
              <div className="flex justify-center">
                <div className="w-20 h-20 md:w-28 md:h-28 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/20">
                  <Sparkles size={40} strokeWidth={1} className="animate-pulse" />
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-4xl md:text-6xl font-black text-white tracking-tighter italic">
                    {filter === 'favorites' ? 'No favorites yet.' : 
                     filter === 'drafts' ? 'No drafts yet.' : 
                     filter === 'shared' ? 'No shared moments.' : 
                     'No moments yet.'}
                </h3>
                <p className="text-xs md:text-sm font-medium text-white/30 max-w-sm mx-auto leading-relaxed">
                  {filter === 'all' 
                    ? "You haven't crafted any moments yet. Pick a template and start building your first digital memory."
                    : filter === 'favorites'
                    ? "Keep your most precious memories close. Like or star your favorite moments and they will appear here."
                    : filter === 'drafts'
                    ? "You don't have any unfinished moments. Start building a new moment and save it as a draft."
                    : "You haven't shared any moments yet. Finish a draft and share it with someone special to see it here."
                  }
                </p>
              </div>
              <button 
                onClick={() => navigateTo('categories')} 
                className="group relative px-16 md:px-24 py-5 md:py-6 bg-linear-to-r from-fuchsia-600 to-orange-500 text-white rounded-full text-sm md:text-base font-black uppercase tracking-wider hover:scale-105 transition-all duration-300 mx-auto inline-flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(217,70,239,0.3)] hover:shadow-[0_0_40px_rgba(217,70,239,0.6)] cursor-pointer whitespace-nowrap"
              >
                {filter === 'all' ? 'Create Your First Moment' : 'Explore Templates'} 
                <ArrowUpRight size={16} strokeWidth={3} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
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
