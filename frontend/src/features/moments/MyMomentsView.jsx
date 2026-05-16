import React, { useState, useMemo, forwardRef, useContext, useEffect, useRef } from 'react';
import {
  Trash2, Sparkles, ArrowUpRight, ChevronRight, Menu, LogOut, AlertTriangle, User, Settings,
  Wallet, CreditCard, Gift, MoreVertical, Plus, LayoutGrid
} from 'lucide-react';
import AnimatedBalance from '../../components/ui/AnimatedBalance';
import { motion, AnimatePresence } from 'framer-motion';
import { ViewContext } from '../../context/NavContext';
import { templates } from '../../data/templates';
import Footer from '../../layout/Footer';



import MomentMagicCard from './MomentMagicCard';
import { useAuth } from '../../context/AuthContext';
import { useWallet } from '../../context/WalletContext';
import CheckoutModal from '../../components/ui/CheckoutModal';
import { getMoments } from '../../services/api';

let cachedMoments = null;
let cachedUid = null;

export default function MyMomentsView() {
  const [currentView, navigateTo, , setSelectedTemplate, , setTemplateCustomization, transitionRef, sharedMomentId, setSharedMomentId, editingMomentId, setEditingMomentId, , setSelectedIntroId] = useContext(ViewContext);
  const { currentUser, logout, openAuthModal, loading, favorites } = useAuth();
  const { balance, unlockedTemplates, templatePrices, templateStats, unlock, refreshWallet, loading: walletLoading } = useWallet();
  const [moments, setMoments] = useState([]);
  const [filter, setFilter] = useState('all');
  const [deleteTarget, setDeleteTarget] = useState(null); // State for confirmation modal
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [unavailableTemplateName, setUnavailableTemplateName] = useState(null);
  const [checkoutTarget, setCheckoutTarget] = useState(null);
  const [isUnlocking, setIsUnlocking] = useState(false);


  useEffect(() => {
    if (currentUser) {
      const forceRefetch = sessionStorage.getItem('forceMomentsRefetch') === 'true';
      if (!forceRefetch && cachedMoments && cachedUid === currentUser.uid) {
        setMoments(cachedMoments);
        return;
      }

      getMoments()
        .then(data => {
          if (data && Array.isArray(data)) {
            // Enrich with template category and fixed image
            const enriched = data.map(m => {
              const template = templates.find(t => t.id === m.templateId);
              if (template) {
                return {
                  ...m,
                  category: template.category,
                  image: template.img
                };
              } else {
                // Fallback for deleted templates
                let category = 'Moment Crafter Original';
                let image = '/cards/special.png';
                
                if (m.templateId.includes('proposal')) {
                  category = 'proposal';
                  image = '/cards/proposal.png';
                } else if (m.templateId.includes('birthday')) {
                  category = 'birthday';
                  image = '/cards/birthday.png';
                } else if (m.templateId.includes('thank-you')) {
                  category = 'thank-you';
                  image = '/cards/thank-you.png';
                } else if (m.templateId.includes('friendship')) {
                  category = 'friendship';
                  image = '/cards/friendship.png';
                } else if (m.templateId.includes('miss-you')) {
                  category = 'miss-you';
                  image = '/cards/miss-you.png';
                } else if (m.templateId.includes('confession')) {
                  category = 'confession';
                  image = '/cards/confession.png';
                } else if (m.templateId.includes('celebration')) {
                  category = 'celebration';
                  image = '/cards/celebration.png';
                } else if (m.templateId.includes('sorry')) {
                  category = 'sorry';
                  image = '/cards/sorry.png';
                } else if (m.templateId.includes('romantic')) {
                  category = 'romantic';
                  image = '/cards/romantic.png';
                }
                
                return {
                  ...m,
                  category: category,
                  image: image
                };
              }
            });
            cachedMoments = enriched;
            cachedUid = currentUser.uid;
            sessionStorage.removeItem('forceMomentsRefetch');
            setMoments(enriched);
          }
        })
        .catch(err => console.error("Error fetching moments:", err));
    } else {
        cachedMoments = null;
        cachedUid = null;
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
          status: 'favorite',
          averageRating: templateStats[t.id]?.averageRating || 0,
          totalRatings: templateStats[t.id]?.totalRatings || 0
        }));
    }
    if (filter === 'all') return moments;
    if (filter === 'drafts') return moments.filter(m => m.status === 'draft');
    return moments.filter(m => m.status === filter);
  }, [moments, filter, favorites, templateStats]);

  const handleAction = async (type, id) => {
    if (type === 'share') {
      const moment = moments.find(m => m.id === id);
      if (moment) {
        const template = templates.find(t => t.id === moment.templateId);
        if (!template) {
          setUnavailableTemplateName(moment.title || "This template");
          return;
        }
        setSelectedTemplate(template);
      }
      setSharedMomentId(id);
      navigateTo('share');
      return;
    }
    if (type === 'delete') {
      setDeleteTarget(id); // Show confirmation modal instead of deleting immediately
      return;
    }

    if (type === 'confirm_delete') {
      const idToDelete = deleteTarget;
      setDeleteTarget(null);

      // Optimistic delete
      setMoments(m => {
          const newM = m.filter(x => x.id !== idToDelete);
          cachedMoments = newM;
          return newM;
      });
      // Real delete
      const moment = moments.find(m => m.id === idToDelete);
      if (moment) {
        import('../../services/api').then(api => api.deleteMoment(idToDelete)).catch(console.error);
      }
      return;
    }

    if (type === 'reactivate') {
      const moment = moments.find(m => m.id === id);
      if (moment) {
        const template = templates.find(t => t.id === moment.templateId);
        if (!template) {
          setUnavailableTemplateName(moment.title || "This template");
          return;
        }
      }
      import('../../services/api').then(api => api.reactivateMoment(id)).then((updatedMoment) => {
        setMoments(m => {
            const newM = m.map(x => x.id === id ? { ...x, ...updatedMoment } : x);
            cachedMoments = newM;
            return newM;
        });
      }).catch(console.error);
    }

    if (type === 'enter' || type === 'click' || type === 'build') {
      // If it's a template (from favorites tab)
      if (id && templates.find(t => t.id === id)) {
        const template = templates.find(t => t.id === id);
        setSelectedTemplate(template);
        setEditingMomentId(null);
        // Clear any existing customization state for this template so it starts fresh
        setTemplateCustomization(prev => {
          const newState = { ...prev };
          delete newState[template.id];
          return newState;
        });
        navigateTo('preview');
        return;
      }

      const moment = moments.find(m => m.id === id);
      if (moment) {
        const template = templates.find(t => t.id === moment.templateId);
        if (!template) {
          setUnavailableTemplateName(moment.title || "This template");
          return;
        }

        // 1. Sync customization data from database to context
        if (moment.customization) {
          setTemplateCustomization(prev => ({
            ...prev,
            [moment.templateId]: moment.customization
          }));
        }

        // 2. Prepare editor state
        setEditingMomentId(id);
        setSelectedTemplate(template);
        if (moment.introId) setSelectedIntroId(moment.introId);
        navigateTo('editor');
      }
    }

    if (type === 'unlock') {
      const t = templates.find(x => x.id === id);
      if (t) {
        setCheckoutTarget({
          ...t,
          price: templatePrices[id] || 0
        });
      }
    }
  };

  const handleConfirmUnlock = async () => {
    if (!checkoutTarget) return;
    setIsUnlocking(true);
    try {
      await unlock(checkoutTarget.id);
      setCheckoutTarget(null);
    } catch (error) {
      console.error("Purchase failed in MyMomentsView:", error);
    } finally {
      setIsUnlocking(false);
    }
  };

  const menuRef = useRef(null);

  useEffect(() => {
    refreshWallet();
  }, [refreshWallet]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };
    if (showProfileMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showProfileMenu]);

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
    <div className="min-h-screen bg-[#050505] text-white selection:bg-fuchsia-500/30 w-full relative z-50">
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
              onClick={() => navigateTo('categories')}
              className="group flex items-center gap-2 md:gap-3 text-white/40 hover:text-white transition-colors"
              aria-label="Back to categories"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="group-hover:-translate-x-1 transition-transform">
                <polyline points="15 18 9 12 15 6" />
              </svg>
              <span className="text-[9px] md:text-[10px] font-mono uppercase tracking-[0.2em] md:tracking-[0.3em] font-bold whitespace-nowrap">MOMENTS</span>
            </button>
          </div>

          <div className="flex items-center gap-2 md:gap-6">
            {currentUser && (
              <button 
                onClick={() => navigateTo('wallet')}
                className="active:scale-95 transition-transform"
              >
                <AnimatedBalance 
                  value={balance} 
                  iconSize={32} 
                  loading={walletLoading}
                />
              </button>
            )}
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowProfileMenu(!showProfileMenu);
                }}
                className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/20 transition-all active:scale-95 overflow-hidden"
              >
                {currentUser?.photoURL ? (
                  <img src={currentUser.photoURL} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User size={18} />
                )}
              </button>

              <AnimatePresence>
                {showProfileMenu && (
                  <>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setShowProfileMenu(false)}
                      className="fixed inset-0 z-[100] cursor-default bg-black/20 backdrop-blur-[2px]"
                    />
                    <motion.div
                      ref={menuRef}
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    className="absolute right-0 mt-3 w-44 md:w-48 bg-zinc-950/90 backdrop-blur-2xl border border-white/10 rounded-2xl p-2 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.7)] z-[110] overflow-hidden"
                  >
                      <button
                        onClick={() => {
                          setShowProfileMenu(false);
                          navigateTo('moments');
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 md:px-4 md:py-3 text-white/60 hover:text-white hover:bg-white/5 rounded-xl transition-all text-left group"
                      >
                        <LayoutGrid size={14} className="group-hover:scale-110 transition-transform" />
                        <span className="text-[9px] md:text-[10px] font-mono font-bold uppercase tracking-widest">My Moments</span>
                      </button>

                      <button
                        onClick={() => {
                          setShowProfileMenu(false);
                          navigateTo('wallet');
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 md:px-4 md:py-3 text-white/60 hover:text-white hover:bg-white/5 rounded-xl transition-all text-left group"
                      >
                        <Wallet size={14} className="group-hover:scale-110 transition-transform" />
                        <span className="text-[9px] md:text-[10px] font-mono font-bold uppercase tracking-widest">Wallet</span>
                      </button>

                      <button
                        onClick={() => {
                          setShowProfileMenu(false);
                          navigateTo('refer');
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 md:px-4 md:py-3 text-white/60 hover:text-white hover:bg-white/5 rounded-xl transition-all text-left group"
                      >
                        <Gift size={14} className="group-hover:scale-110 transition-transform" />
                        <span className="text-[9px] md:text-[10px] font-mono font-bold uppercase tracking-widest">Refer & Earn</span>
                      </button>

                      <button
                        onClick={() => {
                          setShowProfileMenu(false);
                          navigateTo('settings');
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 md:px-4 md:py-3 text-white/60 hover:text-white hover:bg-white/5 rounded-xl transition-all text-left group"
                      >
                        <Settings size={14} className="group-hover:rotate-45 transition-transform duration-300" />
                        <span className="text-[9px] md:text-[10px] font-mono font-bold uppercase tracking-widest">Settings</span>
                      </button>
                      
                      <div className="h-px bg-white/5 my-1 mx-2" />

                      <button
                        onClick={() => {
                          setShowProfileMenu(false);
                          handleLogout();
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 md:px-4 md:py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-all text-left group"
                      >
                        <LogOut size={14} className="group-hover:translate-x-0.5 transition-transform" />
                        <span className="text-[9px] md:text-[10px] font-mono font-bold uppercase tracking-widest">Logout</span>
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </nav>

      <main
        className="w-full max-w-[1600px] mx-auto px-6 md:px-12 pt-16 md:pt-24 pb-12 md:pb-24 relative z-10"
      >
        <header className="mb-4 md:mb-8 space-y-8 md:space-y-20">
          <div className="flex items-end justify-between gap-4 md:gap-12">
            <h1 className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-[0.85] text-white">
              My<br />
              <span className="text-transparent bg-clip-text bg-linear-to-br from-fuchsia-500 via-pink-400 to-orange-400">Moments.</span>
            </h1>

            <div className="border-l border-white/10 pl-4 md:pl-6 py-1 max-w-[150px] sm:max-w-xl mb-1 md:mb-6">
              <p className="text-white/40 text-[9px] sm:text-sm md:text-base font-medium leading-tight sm:leading-relaxed">
                Your shared wishes and saved designs, preserved in your digital studio.
                <br className="sm:hidden" /> Craft memories, not just messages.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap justify-center sm:justify-end gap-4 md:gap-8 w-full pb-2">
            {['all', 'drafts', 'shared', 'favorites'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`text-[10px] md:text-[11px] font-black uppercase tracking-[0.25em] relative pt-1 pb-1 transition-all ${filter === f ? 'text-white' : 'text-white/30 hover:text-white/60'
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


        <div className="min-h-[60vh] flex items-start justify-center pt-8 md:pt-12">
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
                      isUnlocked={moment.isTemplate ? unlockedTemplates?.includes(moment.id) : true}
                      price={moment.isTemplate ? (templatePrices[moment.id] || 0) : 0}
                      onUnlock={(id) => handleAction('unlock', id)}
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
                  className="group relative px-8 sm:px-16 md:px-24 py-5 md:py-6 bg-linear-to-r from-fuchsia-600 to-orange-500 text-white rounded-full text-[10px] sm:text-sm md:text-base font-black uppercase tracking-wider hover:scale-105 transition-all duration-300 mx-auto inline-flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(217,70,239,0.3)] hover:shadow-[0_0_40px_rgba(217,70,239,0.6)] cursor-pointer"
                >
                  <span className="whitespace-nowrap">{filter === 'all' ? 'Create Your First Moment' : 'Explore Templates'}</span>
                  <ArrowUpRight size={16} strokeWidth={3} className="shrink-0 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                </button>
              </div>
            )}
          </AnimatePresence>
        </div>
        <div style={{ height: '200px' }} />
      </main>

      <Footer />

      <CheckoutModal 
        isOpen={!!checkoutTarget}
        onClose={() => setCheckoutTarget(null)}
        template={checkoutTarget}
        userBalance={balance}
        isProcessing={isUnlocking}
        onConfirm={handleConfirmUnlock}
        onBuyWishbits={() => navigateTo('wallet')}
      />

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteTarget && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-6">
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
                    Your precious moment will be <span className="text-white/60 italic">gone forever</span>. <br /> Are you absolutely sure?
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

        {unavailableTemplateName && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setUnavailableTemplateName(null)}
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
                <h3 className="text-2xl md:text-3xl font-black tracking-tighter text-white uppercase italic leading-none">
                  Moment <span className="text-red-500">Unavailable</span>
                </h3>
                <div className="space-y-2">
                  <p className="text-white/40 text-[10px] font-medium leading-relaxed max-w-[280px] mx-auto text-center">
                    It is no longer available for editing, sharing, or reactivation. You can delete this.
                  </p>
                </div>
              </div>

              <div className="flex justify-center">
                <button
                  onClick={() => setUnavailableTemplateName(null)}
                  className="px-12 py-4 bg-white text-black hover:bg-fuchsia-600 hover:text-white rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] transition-all active:scale-[0.98] shadow-lg cursor-pointer"
                >
                  Got it
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
