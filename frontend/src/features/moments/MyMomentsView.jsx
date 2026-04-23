import React, { useState, useMemo, forwardRef, useContext, useEffect } from 'react';
import {
  Trash2, Sparkles, ArrowUpRight,
  ChevronRight, Menu, LogOut, AlertTriangle
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
  const [deleteTarget, setDeleteTarget] = useState(null); // State for confirmation modal

  useEffect(() => {
    if (currentUser) {
        getMoments()
            .then(data => {
                if (data && Array.isArray(data)) {
                    // Enrich with template category and fixed image
                    const enriched = data.map(m => {
                        const template = templates.find(t => t.id === m.templateId);
                        return {
                            ...m,
                            category: template ? template.category : 'Moment Maker Original',
                            image: template ? template.img : null // Use the fixed template image
                        };
                    });
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
        setDeleteTarget(id); // Show confirmation modal instead of deleting immediately
        return;
    }
    
    if (type === 'confirm_delete') {
        const idToDelete = deleteTarget;
        setDeleteTarget(null);
        
        // Optimistic delete
        setMoments(m => m.filter(x => x.id !== idToDelete));
        // Real delete
        const moment = moments.find(m => m.id === idToDelete);
        if (moment) {
            import('../../services/api').then(api => api.deleteMoment(idToDelete)).catch(console.error);
        }
        return;
    }
    
    if (type === 'reactivate') {
        import('../../services/api').then(api => api.reactivateMoment(id)).then((updatedMoment) => {
            setMoments(m => m.map(x => x.id === id ? { ...x, ...updatedMoment } : x));
        }).catch(console.error);
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
              <motion.div 
                layout
                initial="hidden"
                animate="show"
                variants={{
                  show: {
                    transition: {
                      staggerChildren: 0.05
                    }
                  }
                }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 w-full"
              >
                {filteredMoments.map((moment) => (
                  <motion.div
                    key={moment.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    transition={{ 
                      type: "spring",
                      stiffness: 300,
                      damping: 30,
                      opacity: { duration: 0.2 }
                    }}
                  >
                    <MomentMagicCard 
                      moment={moment} 
                      isTemplate={moment.isTemplate}
                      onAction={handleAction} 
                    />
                  </motion.div>
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
      </main>
      
      <Footer />

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteTarget && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeleteTarget(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-[400px] bg-zinc-950/90 backdrop-blur-2xl border border-white/10 rounded-[3rem] overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)] p-8 md:p-12 space-y-10"
            >
              <div className="flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-red-500/20 blur-2xl rounded-full animate-pulse" />
                  <div className="relative w-16 h-16 rounded-2xl bg-linear-to-br from-red-500/20 to-red-600/5 border border-red-500/30 flex items-center justify-center text-red-500 shadow-inner">
                    <AlertTriangle size={28} strokeWidth={2.5} />
                  </div>
                </div>
              </div>
              
              <div className="text-center space-y-5">
                <h3 className="text-3xl md:text-4xl font-black tracking-tighter text-white uppercase italic leading-none">
                  Wait a <span className="text-red-500">second!</span>
                </h3>
                <div className="space-y-1">
                  <p className="text-white/70 text-sm font-semibold tracking-wide">
                    This action is <span className="text-white font-black underline decoration-red-500/50 decoration-2 underline-offset-4">PERMANENT</span>.
                  </p>
                  <p className="text-white/40 text-[11px] font-medium leading-relaxed max-w-[280px] mx-auto text-center">
                    Your precious moment will be <span className="text-white/60 italic">gone forever</span>. <br/> Are you absolutely sure?
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setDeleteTarget(null)}
                  className="flex-1 py-5 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] transition-all active:scale-[0.98]"
                >
                  No, Keep it
                </button>
                <button
                  onClick={() => handleAction('confirm_delete', deleteTarget)}
                  className="flex-1 group relative py-5 bg-red-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:bg-red-500 active:scale-[0.98] shadow-[0_10px_20px_-5px_rgba(220,38,38,0.4)] overflow-hidden"
                >
                  <span className="relative z-10">Delete</span>
                  <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="fixed inset-0 pointer-events-none z-100 bg-white opacity-[0.015] mix-blend-overlay" />
    </div>
  );
}
