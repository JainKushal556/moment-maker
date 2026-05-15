import React, { useContext, useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Zap, Crown, CreditCard, History, 
  ArrowUpRight, Wallet, LogOut, Settings, Gift,
  ArrowLeft, ChevronRight, ChevronLeft, User, Users, ShoppingBag,
  Check, Lock, X, ExternalLink, Copy, Info, Loader2
} from 'lucide-react';
import WishbitIcon from '../../components/icons/WishbitIcon';
import AnimatedBalance from '../../components/ui/AnimatedBalance';
import { useAuth } from '../../context/AuthContext';
import { ViewContext } from '../../context/NavContext';
import { useWallet } from '../../context/WalletContext';
import Footer from '../../layout/Footer';

export default function WalletView() {
  const [currentView, navigateTo] = useContext(ViewContext);
  const { currentUser, logout } = useAuth();
  const { balance, transactions, streakInfo, claimDaily, claimedOneTime, isReferred, hasSharedTemplate, claimOneTime, bonusAmounts, claiming } = useWallet();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [activeSection, setActiveSection] = useState('quests');
  const [selectedTx, setSelectedTx] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  if (currentView !== 'wallet') return null;

  const menuRef = useRef(null);

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

  const wishbitPacks = [
    { id: 1, amount: 25, price: '₹699', originalPrice: '₹999', discount: '30% OFF', label: 'Starter Wishbit', popular: false, color: 'fuchsia' },
    { id: 2, amount: 50, price: '₹1299', originalPrice: '₹1999', discount: '35% OFF', label: 'Pro Wishbit', popular: true, color: 'orange' },
    { id: 3, amount: 100, price: '₹2499', originalPrice: '₹3999', discount: '40% OFF', label: 'Wishbit Master', popular: false, color: 'blue' },
  ];

  const sections = [
    { id: 'quests', label: 'Quests', icon: <Sparkles size={16} /> },
    { id: 'history', label: 'History', icon: <History size={16} /> },
    { id: 'buy', label: 'Buy Wishbit', icon: <ShoppingBag size={16} /> },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-fuchsia-500/30 w-full relative z-50">
      {/* Background Effects */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.07] z-0"
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
              onClick={() => navigateTo('moments')}
              className="group flex items-center gap-2 text-white/40 hover:text-white transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="group-hover:-translate-x-1 transition-transform">
                <polyline points="15 18 9 12 15 6" />
              </svg>
              <span className="text-[9px] md:text-[10px] font-mono uppercase tracking-[0.3em] font-bold whitespace-nowrap">My Moments</span>
            </button>
          </div>

          <div className="flex items-center gap-3 md:gap-6">
            {/* CLEAN COIN BALANCE DISPLAY */}
            <div className="active:scale-95 transition-transform">
              <AnimatedBalance 
                value={balance} 
                iconSize={36} 
                textClassName="text-base md:text-xl"
              />
            </div>

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
                  <motion.div
                    ref={menuRef}
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    className="absolute right-0 mt-3 w-44 md:w-48 bg-zinc-950/90 backdrop-blur-2xl border border-white/10 rounded-xl p-2 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.7)] z-[110] overflow-hidden"
                  >
                      <button
                        onClick={() => {
                          setShowProfileMenu(false);
                          setActiveSection('quests');
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 md:px-4 md:py-3 text-white/60 hover:text-white hover:bg-white/5 rounded-xl transition-all text-left group"
                      >
                        <Sparkles size={14} className="group-hover:scale-110 transition-transform" />
                        <span className="text-[9px] md:text-[10px] font-mono font-bold uppercase tracking-widest">Quests</span>
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
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2.5 md:px-4 md:py-3 text-red-500/60 hover:text-red-400 hover:bg-red-500/5 rounded-xl transition-all text-left group"
                      >
                        <LogOut size={14} className="group-hover:translate-x-1 transition-transform" />
                        <span className="text-[9px] md:text-[10px] font-mono font-bold uppercase tracking-widest">Logout</span>
                      </button>
                    </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </nav>

      <main className="w-full max-w-[1600px] mx-auto px-6 md:px-12 pt-16 md:pt-24 pb-24 relative z-10">
        <header className="mb-12 md:mb-20 text-left relative flex flex-col md:flex-row md:items-end justify-between gap-12">
          <div className="relative w-full md:max-w-2xl z-10">
            <h1 className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-none text-white relative text-left">
              My<br />
              <span className="text-transparent bg-clip-text bg-linear-to-br from-fuchsia-500 via-pink-400 to-orange-400">Wishbits.</span>
            </h1>
            <p className="mt-8 text-sm md:text-base text-white/40 w-full md:max-w-xl font-medium leading-relaxed md:leading-loose mx-0 relative text-left">
              Get wishbits to unlock premium cinematic templates, high-quality exports, and exclusive emotional storytelling assets.
            </p>
          </div>
          
          {/* Rich Clustered Decorative Wishbit Gems - Absolute on mobile to free up space for text */}
          <div className="absolute top-[-50px] right-[-20px] md:relative md:top-auto md:right-auto w-64 h-64 md:w-full md:max-w-[500px] md:h-[300px] pointer-events-none select-none shrink-0 md:mr-20 lg:mr-32">
             <div className="absolute inset-0 scale-[0.55] md:scale-100 origin-top-right md:origin-right">
                {/* Main Cluster */}
                <div className="relative w-full h-full">
                  {/* Foreground Gems */}
                  <motion.div 
                    animate={{ y: [0, -15, 0], rotate: [15, 22, 15] }}
                    transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-[-10%] right-[10%] md:right-[25%] z-50"
                  >
                    <WishbitIcon size={210} className="drop-shadow-[0_0_60px_rgba(217,70,239,0.5)]" />
                  </motion.div>

                  <motion.div 
                    animate={{ y: [0, 10, 0], rotate: [-12, -8, -12] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                    className="absolute top-[35%] right-[35%] md:right-[42%] z-50"
                  >
                    <WishbitIcon size={150} className="drop-shadow-[0_0_40px_rgba(251,146,60,0.5)]" />
                  </motion.div>

                  <motion.div 
                    animate={{ y: [0, -10, 0], rotate: [35, 45, 35] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute top-[55%] right-[15%] md:right-[22%] z-50"
                  >
                    <WishbitIcon size={130} className="drop-shadow-[0_0_30px_rgba(217,70,239,0.4)]" />
                  </motion.div>

                  {/* Midground Gems */}
                  <motion.div 
                    animate={{ y: [0, 15, 0], rotate: [-45, -35, -45] }}
                    transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
                    className="absolute top-[15%] right-[45%] md:right-[55%] z-30 opacity-80"
                  >
                    <WishbitIcon size={120} />
                  </motion.div>

                  <motion.div 
                    animate={{ y: [0, -12, 0], rotate: [90, 100, 90] }}
                    transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
                    className="absolute top-[45%] right-[10%] z-30 opacity-70"
                  >
                    <WishbitIcon size={110} />
                  </motion.div>

                  <motion.div 
                    animate={{ y: [0, 8, 0], rotate: [0, 10, 0] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1.8 }}
                    className="absolute top-[0%] right-[40%] z-30 opacity-90"
                  >
                    <WishbitIcon size={90} />
                  </motion.div>

                  {/* Background Gems */}
                  <motion.div 
                    animate={{ y: [0, -20, 0], rotate: [60, 75, 60] }}
                    transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2.5 }}
                    className="absolute top-[25%] right-[68%] z-10 blur-[2px] opacity-40"
                  >
                    <WishbitIcon size={140} />
                  </motion.div>

                  <motion.div 
                    animate={{ y: [0, 25, 0], rotate: [-20, -5, -20] }}
                    transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
                    className="absolute top-[60%] right-[55%] z-10 blur-[3px] opacity-30"
                  >
                    <WishbitIcon size={100} />
                  </motion.div>

                  <motion.div 
                    animate={{ y: [0, -15, 0], rotate: [120, 140, 120] }}
                    transition={{ duration: 13, repeat: Infinity, ease: "easeInOut", delay: 3 }}
                    className="absolute top-[10%] right-[15%] z-10 blur-[1px] opacity-50"
                  >
                    <WishbitIcon size={115} />
                  </motion.div>

                  {/* Micro Gems/Accents */}
                  <motion.div 
                    animate={{ y: [0, 30, 0], rotate: [180, 200, 180] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-[75%] right-[40%] z-40 opacity-90"
                  >
                    <WishbitIcon size={60} />
                  </motion.div>

                  <motion.div 
                    animate={{ y: [0, -25, 0], rotate: [-90, -70, -90] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                    className="absolute top-[5%] right-[75%] z-20 opacity-40"
                  >
                    <WishbitIcon size={70} />
                  </motion.div>

                  {/* Additional Atmospheric Glows */}
                  <div className="absolute top-[20%] right-[30%] w-96 h-96 bg-fuchsia-600/15 blur-[130px] rounded-full" />
                  <div className="absolute top-[50%] right-[45%] w-72 h-72 bg-orange-600/10 blur-[110px] rounded-full" />

                  {/* Many Animated Sparkles */}
                  {[...Array(15)].map((_, i) => (
                    <motion.div 
                      key={i}
                      animate={{ 
                        opacity: [0, 1, 0],
                        scale: [0.3, 1.4, 0.3],
                        y: [0, -50, 0],
                        x: [0, (i % 2 === 0 ? 15 : -15), 0]
                      }}
                      transition={{ 
                        duration: 3 + (i % 4), 
                        repeat: Infinity, 
                        ease: "easeInOut", 
                        delay: i * 0.3 
                      }}
                      className="absolute bg-white rounded-full shadow-[0_0_15px_white]"
                      style={{ 
                        width: 1 + (i % 3), 
                        height: 1 + (i % 3),
                        top: `${10 + (i * 6)}%`,
                        right: `${15 + (i * 5)}%`
                      }}
                    />
                  ))}
               </div>
             </div>
          </div>
        </header>

        {/* Premium Section Navigation - Matching MyMomentsView style */}
        <div className="mb-12 flex flex-nowrap items-center justify-center md:justify-end gap-6 md:gap-12 w-full overflow-x-auto no-scrollbar pb-2">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`text-[9px] md:text-[11px] font-black uppercase tracking-[0.25em] relative pt-4 pb-4 transition-all flex items-center gap-2 group shrink-0 ${
                activeSection === section.id ? 'text-white' : 'text-white/30 hover:text-white/60'
              }`}
            >
              <span className="transition-transform group-hover:scale-110">{section.icon}</span>
              <span>{section.label}</span>
              {activeSection === section.id && (
                <motion.div
                  layoutId="walletNav"
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-fuchsia-500 shadow-[0_0_15px_#d946ef]"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-16">
          <div className="lg:col-span-12">
            <AnimatePresence mode="wait">
              {activeSection === 'quests' && (
                <motion.div
                  key="quests"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-16"
                >
                  <div className="lg:col-span-8 space-y-12">
                    {/* Current Balance Card - Slimmer for Quest view */}
                    <div className="relative p-[1px] rounded-2xl bg-linear-to-br from-white/10 to-transparent overflow-hidden">
                      <div className="relative group">
                        <div className="absolute -inset-1 bg-linear-to-r from-fuchsia-600/20 to-orange-600/20 rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition duration-500"></div>
                        <div className="relative bg-[#0D0D0D]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-4 md:p-6 overflow-hidden">
                          <div className="relative z-10 flex flex-row items-center justify-between gap-4 md:gap-6">
                            <div className="flex flex-col gap-0.5">
                              <span className="text-[8px] md:text-xs font-bold tracking-[0.2em] text-white/30 uppercase block">
                                Available Wishbits
                              </span>
                                <AnimatedBalance 
                                  value={balance} 
                                  iconSize={48} 
                                  textClassName="text-3xl md:text-6xl"
                                />
                            </div>
                            <div className="flex justify-end md:justify-start shrink-0">
                              <button 
                                onClick={() => setActiveSection('buy')}
                                className="px-5 py-2.5 md:px-6 md:py-3 rounded-full bg-white text-black text-[9px] md:text-[10px] font-black uppercase tracking-widest hover:bg-fuchsia-500 hover:text-white transition-all active:scale-95 shadow-lg shadow-white/5 flex items-center gap-2"
                              >
                                Buy More <WishbitIcon size={16} className="scale-[1.6] origin-center ml-1" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Starter Quests */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl md:text-2xl font-black text-white tracking-tight flex items-center gap-3">
                                <Gift className="text-fuchsia-400" size={24} />
                                Starter Quests
                            </h3>
                            <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">One-time Rewards</span>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Welcome Bonus Card */}
                            <div className={`p-5 rounded-2xl border transition-all duration-500 flex items-center justify-between group relative overflow-hidden ${
                                claimedOneTime.includes('WELCOME_BONUS') 
                                ? 'bg-emerald-500/5 border-emerald-500/20' 
                                : 'bg-white/5 border-white/10 hover:border-white/20'
                            }`}>
                                <div className="flex items-center gap-4 relative z-10">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                                        claimedOneTime.includes('WELCOME_BONUS') ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/5 text-white/40'
                                    }`}>
                                        <Sparkles size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">Join Bonus</p>
                                        <h4 className="text-sm font-black text-white">Welcome Gift</h4>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 relative z-10">
                                    <div className="text-right">
                                        <span className={`text-base font-black flex items-center gap-2 justify-end ${
                                            claimedOneTime.includes('WELCOME_BONUS') ? 'text-emerald-400' : 'text-white'
                                        }`}>
                                            +{bonusAmounts.welcome} <WishbitIcon size={16} />
                                        </span>
                                    </div>
                                    <button 
                                        onClick={() => !claimedOneTime.includes('WELCOME_BONUS') && !claiming['WELCOME_BONUS'] && claimOneTime('WELCOME_BONUS')}
                                        disabled={claimedOneTime.includes('WELCOME_BONUS') || claiming['WELCOME_BONUS']}
                                        className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${
                                            claimedOneTime.includes('WELCOME_BONUS')
                                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                            : claiming['WELCOME_BONUS']
                                            ? 'bg-white/5 text-white/20 cursor-wait'
                                            : 'bg-white text-black hover:bg-fuchsia-500 hover:text-white shadow-lg'
                                        }`}
                                    >
                                        {claimedOneTime.includes('WELCOME_BONUS') ? <Check size={14} /> : 
                                         claiming['WELCOME_BONUS'] ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}><Loader2 size={14} /></motion.div> : 
                                         'Claim'}
                                    </button>
                                </div>
                                {claimedOneTime.includes('WELCOME_BONUS') && (
                                    <div className="absolute inset-0 bg-radial from-emerald-500/5 to-transparent opacity-60" />
                                )}
                            </div>

                            {/* Referral Bonus Card */}
                            {isReferred && (
                                <div className={`p-5 rounded-2xl border transition-all duration-500 flex items-center justify-between group relative overflow-hidden ${
                                    claimedOneTime.includes('REFERRAL_SIGNUP') 
                                    ? 'bg-emerald-500/5 border-emerald-500/20' 
                                    : 'bg-white/5 border-white/10 hover:border-white/20'
                                }`}>
                                    <div className="flex items-center gap-4 relative z-10">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                                            claimedOneTime.includes('REFERRAL_SIGNUP') ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/5 text-white/40'
                                        }`}>
                                            <Users size={20} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">Referral Link</p>
                                            <h4 className="text-sm font-black text-white">Friend's Invite</h4>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 relative z-10">
                                        <div className="text-right">
                                            <span className={`text-base font-black flex items-center gap-2 justify-end ${
                                                claimedOneTime.includes('REFERRAL_SIGNUP') ? 'text-emerald-400' : 'text-white'
                                            }`}>
                                                +{bonusAmounts.refSignup} <WishbitIcon size={16} />
                                            </span>
                                        </div>
                                        <div className="flex flex-col items-end gap-2">
                                            <button 
                                                onClick={() => !claimedOneTime.includes('REFERRAL_SIGNUP') && !claiming['REFERRAL_SIGNUP'] && hasSharedTemplate && claimOneTime('REFERRAL_SIGNUP')}
                                                disabled={claimedOneTime.includes('REFERRAL_SIGNUP') || claiming['REFERRAL_SIGNUP'] || !hasSharedTemplate}
                                                className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${
                                                    claimedOneTime.includes('REFERRAL_SIGNUP')
                                                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                                    : !hasSharedTemplate
                                                    ? 'bg-white/5 text-white/20 cursor-not-allowed border border-white/5'
                                                    : claiming['REFERRAL_SIGNUP']
                                                    ? 'bg-white/5 text-white/20 cursor-wait'
                                                    : 'bg-white text-black hover:bg-fuchsia-500 hover:text-white shadow-lg'
                                                }`}
                                            >
                                                {claimedOneTime.includes('REFERRAL_SIGNUP') ? <Check size={14} /> : 
                                                 !hasSharedTemplate ? <div className="flex items-center gap-2"><Lock size={10} /> Locked</div> :
                                                 claiming['REFERRAL_SIGNUP'] ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}><Loader2 size={14} /></motion.div> : 
                                                 'Claim'}
                                            </button>
                                            {!hasSharedTemplate && !claimedOneTime.includes('REFERRAL_SIGNUP') && (
                                                <p className="text-[8px] font-bold text-fuchsia-400/60 uppercase tracking-tighter">Share a template to unlock</p>
                                            )}
                                        </div>
                                    </div>
                                    {claimedOneTime.includes('REFERRAL_SIGNUP') && (
                                        <div className="absolute inset-0 bg-radial from-emerald-500/5 to-transparent opacity-60" />
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Daily Streak Section */}
                    <div className="space-y-8">
                        <div className="flex flex-row items-center justify-between gap-4">
                            <div>
                                <h3 className="text-lg md:text-2xl font-black text-white tracking-tight flex items-center gap-2 md:gap-3">
                                    <Zap className="text-sun-gold w-5 h-5 md:w-6 md:h-6" size={24} />
                                    7-Day Login Streak
                                </h3>
                                <p className="text-[9px] md:text-[11px] text-white/40 font-medium mt-1">Don't miss a day to get the 2x Day 7 bonus!</p>
                            </div>
                            <div className="bg-white/5 border border-white/10 rounded-2xl md:rounded-3xl p-2.5 md:px-6 md:py-4 backdrop-blur-sm">
                                <div className="flex flex-col items-end md:items-start gap-0.5 md:gap-1">
                                    <p className="text-[7px] md:text-[10px] font-bold text-white/40 uppercase tracking-widest">Daily streak</p>
                                    <div className="flex items-center gap-1.5 md:gap-3">
                                        <div className="relative">
                                            <Zap size={18} className="md:w-7 md:h-7 text-orange-500 fill-orange-500 drop-shadow-[0_0_15px_rgba(249,115,22,0.4)]" />
                                            <div className="absolute inset-0 bg-orange-600 blur-xl opacity-20" />
                                        </div>
                                        <h4 className="text-xl md:text-4xl font-black text-white tracking-tighter">
                                            {streakInfo.count} <span className="text-xs md:text-2xl text-white/60 tracking-tighter">day</span>
                                        </h4>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex overflow-x-auto pb-4 no-scrollbar gap-3 md:grid md:grid-cols-7">
                            {[1, 2, 3, 4, 5, 6, 7].map((day) => {
                                const today = new Date().toISOString().split('T')[0];
                                const isClaimedToday = streakInfo.lastClaim === today;
                                
                                // Color Map for each day
                                const dayColors = {
                                    1: 'from-blue-500/20',
                                    2: 'from-indigo-500/20',
                                    3: 'from-fuchsia-500/20',
                                    4: 'from-pink-500/20',
                                    5: 'from-rose-500/20',
                                    6: 'from-orange-500/20',
                                    7: 'from-sun-gold/20'
                                };

                                const dayBorderColors = {
                                    1: 'border-blue-500/20',
                                    2: 'border-indigo-500/20',
                                    3: 'border-fuchsia-500/20',
                                    4: 'border-pink-500/20',
                                    5: 'border-rose-500/20',
                                    6: 'border-orange-500/20',
                                    7: 'border-sun-gold/30'
                                };

                                const isClaimed = streakInfo.claimedDays.includes(day);
                                const isReached = day <= streakInfo.count;
                                
                                // Determine state
                                const isCompleted = isClaimed;
                                const isCurrent = isReached && !isClaimed;
                                const isLocked = !isReached;
                                
                                // Special rule for Day 2 and 5 (Deferred)
                                const isDeferred = [2, 5].includes(day);
                                const isBonusDay = day === 7;
                                const canClaimToday = !isDeferred || streakInfo.count > day;

                                return (
                                    <div 
                                        key={day}
                                        className={`relative p-3 md:p-5 rounded-2xl border transition-all duration-500 flex flex-col items-center justify-center gap-2 md:gap-3 group overflow-hidden shrink-0 w-28 md:w-auto ${
                                            isCompleted ? 'bg-emerald-500/5 border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.1)]' :
                                            isCurrent && canClaimToday ? 'bg-white/10 border-fuchsia-500/50 shadow-[0_0_40px_rgba(217,70,239,0.15)]' :
                                            isCurrent && !canClaimToday ? 'bg-orange-500/5 border-orange-500/30' :
                                            `bg-white/[0.03] ${dayBorderColors[day]}`
                                        }`}
                                    >
                                        {/* Background Aura Effects */}
                                        <div className={`absolute inset-0 bg-radial ${dayColors[day]} to-transparent opacity-30`} />
                                        
                                        {isCompleted && (
                                            <div className="absolute inset-0 bg-radial from-emerald-500/10 to-transparent opacity-60" />
                                        )}
                                        {isCurrent && canClaimToday && (
                                            <div className="absolute inset-0 bg-radial from-fuchsia-500/20 to-transparent animate-pulse opacity-60" />
                                        )}
                                        {isCurrent && !canClaimToday && (
                                            <div className="absolute inset-0 bg-radial from-orange-500/10 to-transparent opacity-40" />
                                        )}

                                        <span className={`text-[8px] md:text-[9px] font-black uppercase tracking-widest relative z-10 ${
                                            isCompleted ? 'text-emerald-400' :
                                            isCurrent && canClaimToday ? 'text-fuchsia-400 animate-pulse' : 
                                            isCurrent && !canClaimToday ? 'text-orange-400' :
                                            'text-white/30'
                                        }`}>Day {day}</span>
                                        
                                        <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center transition-all duration-500 relative z-10 ${
                                            isCompleted ? 'text-emerald-400 bg-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.3)]' :
                                            isCurrent && canClaimToday ? 'text-fuchsia-400 bg-fuchsia-500/20 shadow-[0_0_20px_rgba(217,70,239,0.4)]' :
                                            isCurrent && !canClaimToday ? 'text-orange-400 bg-orange-500/10' :
                                            'text-white/5 bg-white/5 border border-white/5'
                                        } ${isCurrent && canClaimToday ? 'scale-110' : ''}`}>
                                            {isCompleted ? <Check size={20} className="md:w-6 md:h-6" strokeWidth={3} /> :
                                             isCurrent && !canClaimToday ? <Lock size={18} className="animate-pulse" /> :
                                             isBonusDay ? <Crown size={20} className={isCurrent && canClaimToday ? 'text-sun-gold animate-bounce' : 'text-sun-gold/20'} /> :
                                             <WishbitIcon size={24} className={isCurrent && canClaimToday ? 'drop-shadow-[0_0_15px_rgba(217,70,239,0.6)]' : 'opacity-[0.15]'} />}
                                        </div>

                                        <div className="flex items-center gap-1.5 md:gap-2 relative z-10">
                                            <span className={`text-sm md:text-base font-black tracking-tighter ${
                                                isCompleted ? 'text-emerald-400' :
                                                isCurrent && canClaimToday ? 'text-white' : 
                                                'text-white/20'
                                            }`}>
                                                {isBonusDay ? (streakInfo.dailyBonus * 2) : streakInfo.dailyBonus}
                                            </span>
                                            <WishbitIcon size={14} className={isCompleted ? 'drop-shadow-[0_0_5px_rgba(52,211,153,0.5)]' : isCurrent && canClaimToday ? 'drop-shadow-[0_0_8px_rgba(217,70,239,0.5)]' : 'opacity-[0.2]'} />
                                        </div>

                                        {isCurrent && (
                                            <motion.button
                                                whileHover={{ scale: canClaimToday && !claiming[`daily-${day}`] ? 1.05 : 1 }}
                                                whileTap={{ scale: canClaimToday && !claiming[`daily-${day}`] ? 0.95 : 1 }}
                                                onClick={() => canClaimToday && !claiming[`daily-${day}`] && claimDaily(day)}
                                                disabled={!canClaimToday || claiming[`daily-${day}`]}
                                                className={`w-full py-2 md:py-2.5 rounded-lg text-[8px] md:text-[9px] font-black uppercase tracking-widest transition-all relative z-10 ${
                                                    !canClaimToday 
                                                    ? 'bg-white/5 text-white/20 cursor-not-allowed border border-white/5' 
                                                    : claiming[`daily-${day}`]
                                                    ? 'bg-white/10 text-white/40 cursor-wait'
                                                    : 'bg-white text-black hover:bg-fuchsia-500 hover:text-white shadow-xl shadow-fuchsia-500/20'
                                                }`}
                                            >
                                                {claiming[`daily-${day}`] ? (
                                                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="flex justify-center">
                                                        <Loader2 size={12} />
                                                    </motion.div>
                                                ) : !canClaimToday ? 'Pending' : 'Claim'}
                                            </motion.button>
                                        )}

                                        {isCurrent && !canClaimToday && (
                                            <p className="absolute bottom-1.5 md:bottom-2 left-0 right-0 text-center text-[7px] font-black text-fuchsia-400/60 uppercase tracking-[0.1em] z-10">
                                                Locked
                                            </p>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                  </div>

                  <div className="lg:col-span-4">
                    <div className="p-8 rounded-2xl bg-linear-to-br from-fuchsia-600/10 to-transparent border border-white/10 space-y-8">
                      <div className="space-y-6">
                        <h4 className="text-lg font-black tracking-tight text-white flex items-center gap-3">
                          <Crown className="text-sun-gold" size={24} />
                          Pro Tips
                        </h4>
                        <div className="space-y-5">
                          {[
                            { title: "Daily Login", desc: "Keep your streak alive to get 2x bonus every 7 days." },
                            { title: "Refer Friends", desc: "Get 500 Wishbits for every friend who joins." },
                            { title: "Limited Events", desc: "Watch out for golden quests that give 100+ bits." }
                          ].map((tip, i) => (
                            <div key={i} className="space-y-1.5">
                              <p className="text-[11px] font-black text-white/80 uppercase tracking-wider">{tip.title}</p>
                              <p className="text-[11px] text-white/40 leading-relaxed font-medium">{tip.desc}</p>
                            </div>
                          ))}
                        </div>
                        
                        <div className="pt-4">
                          <button 
                            onClick={() => navigateTo('refer')}
                            className="w-full py-4 rounded-2xl bg-fuchsia-500/10 border border-fuchsia-500/20 text-[10px] font-black uppercase tracking-[0.2em] text-fuchsia-400 hover:bg-fuchsia-500 hover:text-white transition-all group"
                          >
                            Invite Friends
                            <ArrowUpRight size={14} className="inline ml-2 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeSection === 'history' && (
                <motion.div
                  key="history"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-8 w-full"
                >
                  {/* Premium History Header */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2">
                    <div className="flex items-center gap-4 md:gap-5">
                      <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-fuchsia-400 shadow-inner">
                        <History size={24} className="md:w-7 md:h-7" />
                      </div>
                      <div>
                        <h3 className="text-lg md:text-2xl font-black text-white tracking-tight">Transaction History</h3>
                        <p className="text-[10px] md:text-sm text-white/30 font-medium uppercase tracking-widest">Recent activity</p>
                      </div>
                    </div>
                  </div>

                    {/* Modern Banking-style Transaction Table */}
                    <div className="w-full bg-[#050505] rounded-3xl border border-white/5 overflow-hidden">
                      {/* Table Header - Visible on Desktop */}
                      <div className="hidden md:grid grid-cols-12 gap-4 px-8 py-5 border-b border-white/5 bg-white/[0.02]">
                        <div className="col-span-9 text-[10px] font-black uppercase tracking-[0.2em] text-white/20">Transaction</div>
                        <div className="col-span-3 text-[10px] font-black uppercase tracking-[0.2em] text-white/20 text-right">Wishbits</div>
                      </div>

                      <div className="divide-y divide-white/5">
                        {(transactions || [])
                          .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                          .map((tx) => (
                          <div 
                            key={tx.id} 
                            className="flex items-center justify-between gap-3 px-4 py-3 md:px-8 md:py-6 hover:bg-white/[0.03] transition-all group cursor-pointer w-full"
                            onClick={() => setSelectedTx(tx)}
                          >
                            {/* Transaction Detail */}
                            <div 
                              className="flex items-center gap-3 md:gap-5 group/row min-w-0"
                            >
                              <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center shrink-0 ${
                                tx.type === 'CREDIT' 
                                  ? 'bg-green-500/10 text-green-400' 
                                  : 'bg-fuchsia-500/10 text-fuchsia-400'
                              }`}>
                                {tx.category === 'TEMPLATE_PURCHASE' ? <ShoppingBag size={18} className="md:w-5 md:h-5" /> : 
                                 tx.category === 'REFERRAL_REWARD' ? <Gift size={18} className="md:w-5 md:h-5" /> : 
                                 tx.category === 'STREAK_REWARD' ? <Crown size={18} className="md:w-5 md:h-5" /> :
                                 <CreditCard size={18} className="md:w-5 md:h-5" />}
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                  <p className="text-xs md:text-base font-bold text-white group-hover/row:text-fuchsia-400 transition-colors tracking-tight truncate capitalize">
                                    {(tx.category?.replace(/_/g, ' ') || '').toLowerCase()}
                                  </p>
                                  <ChevronRight size={10} className="hidden md:block text-fuchsia-500/40 group-hover/row:translate-x-1 transition-transform" />
                                </div>
                                <p className="text-[8px] md:text-[10px] font-bold text-white/20 uppercase tracking-[0.15em] mt-0.5 md:mt-1">
                                  {tx.timestamp ? (
                                    new Date(tx.timestamp).toLocaleString('en-GB', {
                                      day: '2-digit',
                                      month: 'short',
                                      year: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit',
                                      hour12: true
                                    }).replace(',', ' •').toUpperCase()
                                  ) : tx.date}
                                </p>
                              </div>
                            </div>

                            {/* Amount Only */}
                            <div className="shrink-0">
                              <div className="flex items-center gap-2 md:gap-4">
                                <span className={`text-sm md:text-xl font-black ${tx.type === 'CREDIT' ? 'text-green-400' : 'text-white'}`}>
                                  {tx.type === 'CREDIT' ? '+' : '-'}{tx.amount}
                                </span>
                                <WishbitIcon size={16} className="md:w-5 md:h-5 opacity-80" />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Pagination Controls */}
                      {transactions?.length > itemsPerPage && (
                        <div className="px-8 py-6 flex items-center justify-between border-t border-white/5 bg-white/[0.01]">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]">Page</span>
                            <span className="text-sm font-black text-white">{currentPage}</span>
                            <span className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]">of {Math.ceil((transactions?.length || 0) / itemsPerPage)}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                              disabled={currentPage === 1}
                              className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white transition-all hover:bg-white/10 disabled:opacity-20 disabled:cursor-not-allowed border border-white/5"
                            >
                              <ChevronLeft size={18} />
                            </button>
                            <button
                              onClick={() => setCurrentPage(prev => Math.min(Math.ceil((transactions?.length || 0) / itemsPerPage), prev + 1))}
                              disabled={currentPage === Math.ceil((transactions?.length || 0) / itemsPerPage)}
                              className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white transition-all hover:bg-white/10 disabled:opacity-20 disabled:cursor-not-allowed border border-white/5"
                            >
                              <ChevronRight size={18} />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                </motion.div>
              )}

              {activeSection === 'buy' && (
                <motion.div
                  key="buy"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-12"
                >
                  <div className="space-y-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                      <div>
                        <h3 className="text-2xl font-black text-white">Select Wishbit Pack</h3>
                        <p className="text-white/40 text-sm mt-1">Choose the best plan to power your creativity.</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
                      {wishbitPacks.map((pack) => (
                        <motion.div
                          key={pack.id}
                          whileHover={{ y: -8, scale: 1.02 }}
                          className="relative p-[1px] rounded-2xl md:rounded-[32px] bg-linear-to-b from-fuchsia-500/40 to-orange-500/40 transition-all group shadow-2xl shadow-black/50"
                        >
                          <div className="h-full bg-[#0D0D0D] p-3 md:p-8 rounded-[15px] md:rounded-[31px] flex flex-col relative overflow-hidden">
                            {/* Visual Aura */}
                            <div className={`absolute top-0 right-0 w-24 md:w-32 h-24 md:h-32 blur-[40px] md:blur-[60px] rounded-full opacity-10 pointer-events-none bg-${pack.color}-500`} />
                            
                            <div className="flex items-center justify-center gap-2 md:gap-6 mb-6 md:mb-10 mt-2 md:mt-4">
                              <span className="text-3xl md:text-7xl font-black text-white tracking-tighter">{pack.amount}</span>
                              <div className="relative scale-75 md:scale-100">
                                <WishbitIcon size={40} className="md:w-[64px] md:h-[64px] drop-shadow-[0_0_20px_rgba(217,70,239,0.3)] relative z-10" />
                                <div className="absolute -top-3 -right-3 rotate-12 opacity-60">
                                  <WishbitIcon size={16} />
                                </div>
                                <div className="absolute -bottom-1 -left-3 -rotate-12 opacity-60">
                                  <WishbitIcon size={16} />
                                </div>
                              </div>
                            </div>

                            {/* Price Bar */}
                            <div className="mt-auto bg-white/[0.03] border border-white/5 rounded-xl md:rounded-2xl p-2.5 md:p-4 flex flex-row items-center justify-between gap-2 group-hover:bg-white/[0.06] transition-colors">
                              <div className="flex flex-col gap-0.5 md:gap-3">
                                <span className="text-sm md:text-xl font-black text-fuchsia-400">{pack.price}</span>
                                <span className="text-[8px] md:text-xs font-bold text-white/20 line-through tracking-tight">{pack.originalPrice}</span>
                              </div>
                              <div className="px-2 py-1 md:px-3 md:py-1.5 rounded-lg md:rounded-xl border border-fuchsia-500/50 text-fuchsia-400 text-[7px] md:text-[9px] font-black uppercase tracking-wider w-fit shrink-0">
                                {pack.discount}
                              </div>
                            </div>
                            
                            {/* Overlay Click Area */}
                            <button className="absolute inset-0 z-20 cursor-pointer" aria-label={`Buy ${pack.amount} Wishbits`} />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <div className="p-10 rounded-2xl bg-linear-to-br from-white/5 to-transparent border border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="space-y-2 text-center md:text-left">
                      <h4 className="text-xl font-black text-white">Have a coupon code?</h4>
                      <p className="text-white/40 text-sm">Enter your code to get extra wishbits or discounts.</p>
                    </div>
                    <div className="flex w-full md:w-auto gap-3">
                      <input 
                        type="text" 
                        placeholder="ENTER CODE" 
                        className="bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-xs font-bold tracking-widest text-white placeholder:text-white/20 focus:outline-hidden focus:border-fuchsia-500/50 transition-colors w-full md:w-64"
                      />
                      <button className="bg-white text-black px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-fuchsia-500 hover:text-white transition-all active:scale-95">Apply</button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      <Footer />

      {/* Transaction Detail Modal */}
      <AnimatePresence>
        {selectedTx && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedTx(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-sm bg-[#0D0D0D] border border-white/10 rounded-2xl overflow-hidden shadow-2xl shadow-black"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-4 border-b border-white/5">
                <div className="flex items-center gap-3">
                   <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      selectedTx.type === 'CREDIT' ? 'bg-green-500/10 text-green-400' : 'bg-fuchsia-500/10 text-fuchsia-400'
                    }`}>
                      {selectedTx.category === 'TEMPLATE_PURCHASE' ? <ShoppingBag size={16} /> : 
                       selectedTx.category === 'REFERRAL_REWARD' ? <Gift size={16} /> : 
                       selectedTx.category === 'STREAK_REWARD' ? <Crown size={16} /> :
                       <CreditCard size={16} />}
                   </div>
                   <div>
                     <h4 className="text-sm font-black text-white tracking-tight capitalize">
                       {(selectedTx.category?.replace(/_/g, ' ') || '').toLowerCase()}
                     </h4>
                     <p className="text-[8px] font-bold text-white/20 uppercase tracking-[0.2em]">Transaction Details</p>
                   </div>
                </div>
                <button 
                  onClick={() => setSelectedTx(null)}
                  className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-6">
                <div className="text-center py-2">
                  <div className="flex items-center justify-center gap-2">
                    <span className={`text-3xl font-black tracking-tighter ${selectedTx.type === 'CREDIT' ? 'text-green-400' : 'text-white'}`}>
                      {selectedTx.type === 'CREDIT' ? '+' : '-'}{selectedTx.amount}
                    </span>
                    <WishbitIcon size={28} className="drop-shadow-[0_0_15px_rgba(217,70,239,0.3)]" />
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-y-4 gap-x-6 border-t border-white/5 pt-6">
                  <div className="space-y-0.5">
                    <p className="text-[8px] font-bold text-white/20 uppercase tracking-widest">Status</p>
                    <div className="flex items-center gap-1.5">
                       <div className="w-1 h-1 rounded-full bg-green-500" />
                       <p className="text-xs font-bold text-green-400">Success</p>
                    </div>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[8px] font-bold text-white/20 uppercase tracking-widest">Date & Time</p>
                    <p className="text-xs font-bold text-white/80">
                      {selectedTx.timestamp ? (
                         new Date(selectedTx.timestamp).toLocaleString('en-GB', {
                           day: '2-digit',
                           month: 'short',
                           year: 'numeric',
                           hour: '2-digit',
                           minute: '2-digit',
                           hour12: true
                         }).replace(',', ' •')
                      ) : selectedTx.date}
                    </p>
                  </div>
                  <div className="col-span-2 space-y-0.5">
                    <p className="text-[8px] font-bold text-white/20 uppercase tracking-widest">Reference ID</p>
                    <div className="flex items-center justify-between group/id">
                      <p className="text-[10px] font-mono font-medium text-white/60 break-all">{selectedTx.txnId || selectedTx.id}</p>
                      <button className="text-white/20 hover:text-fuchsia-400 transition-colors p-1">
                        <Copy size={12} />
                      </button>
                    </div>
                  </div>
                  <div className="col-span-2 space-y-0.5">
                    <p className="text-[8px] font-bold text-white/20 uppercase tracking-widest">Description</p>
                    <p className="text-xs font-medium text-white/70 leading-relaxed">
                      {selectedTx.description || `Transaction for ${(selectedTx.category?.replace(/_/g, ' ') || '').toLowerCase()}`}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
