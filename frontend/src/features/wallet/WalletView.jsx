import React, { useContext, useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Zap, Crown, CreditCard, History, 
  ArrowUpRight, Wallet, LogOut, Settings, Gift,
  ArrowLeft, ChevronRight, User, ShoppingBag
} from 'lucide-react';
import WishbitIcon from '../../components/icons/WishbitIcon';
import { useAuth } from '../../context/AuthContext';
import { ViewContext } from '../../context/NavContext';
import { useWallet } from '../../context/WalletContext';
import Footer from '../../layout/Footer';

export default function WalletView() {
  const [currentView, navigateTo] = useContext(ViewContext);
  const { currentUser, logout } = useAuth();
  const { balance, transactions } = useWallet();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [activeSection, setActiveSection] = useState('balance');

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
    { id: 1, amount: 500, price: '₹99', label: 'Starter Wishbit', icon: <Sparkles className="text-blue-400" />, popular: false },
    { id: 2, amount: 2000, price: '₹299', label: 'Pro Wishbit', icon: <Zap className="text-sun-gold" />, popular: true },
    { id: 3, amount: 5000, price: '₹599', label: 'Wishbit Master', icon: <Crown className="text-fuchsia-500" />, popular: false },
  ];

  const sections = [
    { id: 'balance', label: 'Balance', icon: <Wallet size={16} /> },
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
              <span className="text-[9px] md:text-[10px] font-mono uppercase tracking-[0.3em] font-bold whitespace-nowrap">Back to Moments</span>
            </button>
          </div>

          <div className="flex items-center gap-3 md:gap-6">
            {/* CLEAN COIN BALANCE DISPLAY */}
            <div className="flex items-center gap-0 py-1 transition-all select-none group active:scale-95">
              <WishbitIcon size={36} className="drop-shadow-none" />
              <span className="text-base md:text-xl font-black tracking-tighter text-white">
                {balance.toLocaleString()}
              </span>
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
                    className="absolute right-0 mt-3 w-44 md:w-48 bg-zinc-950/90 backdrop-blur-2xl border border-white/10 rounded-2xl p-2 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.7)] z-[110] overflow-hidden"
                  >
                      <button
                        onClick={() => {
                          setShowProfileMenu(false);
                          setActiveSection('balance');
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
              <span className="text-transparent bg-clip-text bg-linear-to-br from-fuchsia-500 via-pink-400 to-orange-400">Wishbit.</span>
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
        <div className="mb-12 flex flex-wrap justify-center md:justify-end gap-8 md:gap-12 w-full">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`text-[10px] md:text-[11px] font-black uppercase tracking-[0.25em] relative pt-4 pb-4 transition-all flex items-center gap-2 group ${
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
              {activeSection === 'balance' && (
                <motion.div
                  key="balance"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-16"
                >
                  <div className="lg:col-span-8 space-y-12">
                    {/* Current Balance Card */}
                    <div className="relative p-[1px] rounded-[3rem] bg-linear-to-br from-white/10 to-transparent overflow-hidden">
                      <div className="relative group">
                        <div className="absolute -inset-1 bg-linear-to-r from-fuchsia-600/20 to-orange-600/20 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition duration-500"></div>
                        <div className="relative bg-[#0D0D0D]/80 backdrop-blur-xl border border-white/5 rounded-3xl p-8 md:p-12 overflow-hidden">
                          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                            <div>
                              <span className="text-[10px] md:text-xs font-bold tracking-[0.2em] text-white/30 uppercase mb-4 block">
                                Available Wishbits
                              </span>
                              <div className="flex items-center gap-4 group">
                                <div>
                                  <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-white">
                                    {balance.toLocaleString()}
                                  </h2>
                                </div>

                                {/* Small Gem Cluster next to balance - Larger Size */}
                                <div className="relative w-24 h-24 md:w-28 md:h-28 shrink-0">
                                  <motion.div 
                                    animate={{ y: [0, -8, 0], rotate: [0, 5, 0] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                    className="absolute inset-0 z-30"
                                  >
                                    <WishbitIcon size={96} className="md:w-24 md:h-24 drop-shadow-[0_0_30px_rgba(217,70,239,0.5)]" />
                                  </motion.div>
                                  <motion.div 
                                    animate={{ y: [0, 8, 0], rotate: [0, -10, 0] }}
                                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                                    className="absolute top-1/4 -left-3 z-20 opacity-80"
                                  >
                                    <WishbitIcon size={64} className="md:w-16 md:h-16" />
                                  </motion.div>
                                  <motion.div 
                                    animate={{ y: [0, -5, 0], rotate: [0, 15, 0] }}
                                    transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                                    className="absolute bottom-1/4 -right-2 z-10 opacity-60"
                                  >
                                    <WishbitIcon size={48} className="md:w-12 md:h-12" />
                                  </motion.div>
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-3">
                              <div className="px-4 py-2 rounded-full bg-white/5 border border-white/10 flex items-center gap-2">
                                <Zap className="w-3 h-3 text-fuchsia-400" />
                                <span className="text-[10px] font-bold tracking-wider text-white/60 uppercase">Instant Delivery</span>
                              </div>
                            </div>
                          </div>
                          <div className="absolute top-1/2 right-[-5%] -translate-y-1/2 opacity-[0.03] pointer-events-none">
                            <WishbitIcon size={300} />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Quick Stats/Info in Balance Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div className="p-8 rounded-3xl bg-white/5 border border-white/5 space-y-4">
                          <div className="w-10 h-10 rounded-xl bg-fuchsia-500/10 flex items-center justify-center text-fuchsia-400">
                             <Sparkles size={20} />
                          </div>
                          <h4 className="text-lg font-black text-white">Unlock Templates</h4>
                          <p className="text-sm text-white/40 leading-relaxed">Use your Wishbits to unlock over 100+ premium cinematic templates for your moments.</p>
                       </div>
                       <div className="p-8 rounded-3xl bg-white/5 border border-white/5 space-y-4">
                          <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-400">
                             <CreditCard size={20} />
                          </div>
                          <h4 className="text-lg font-black text-white">Easy Top-up</h4>
                          <p className="text-sm text-white/40 leading-relaxed">Need more? You can top up your Wishbits anytime through our secure payment gateway.</p>
                       </div>
                    </div>
                  </div>

                  <div className="lg:col-span-4">
                    <div className="p-8 rounded-[2.5rem] bg-linear-to-br from-fuchsia-600/10 to-transparent border border-white/10 space-y-8">
                      <div className="space-y-4">
                        <h4 className="text-lg font-black tracking-tight text-white flex items-center gap-3">
                          <Sparkles className="text-fuchsia-400" size={24} />
                          Why get Wishbits?
                        </h4>
                        <div className="space-y-4 pt-4">
                          {[
                            "Unlock 100+ cinematic templates",
                            "Ultra-HD premium video exports",
                            "Priority processing speed",
                            "Custom background music access",
                            "Commercial usage rights"
                          ].map((item, i) => (
                            <div key={i} className="flex items-start gap-3">
                              <div className="w-5 h-5 rounded-full bg-fuchsia-500/20 flex items-center justify-center shrink-0 mt-0.5">
                                <WishbitIcon size={12} />
                              </div>
                              <p className="text-[11px] text-white/50 leading-relaxed font-medium">{item}</p>
                            </div>
                          ))}
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
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-fuchsia-400 shadow-inner">
                        <History size={28} />
                      </div>
                      <div>
                        <h3 className="text-2xl font-black text-white tracking-tight">Transaction History</h3>
                        <p className="text-sm text-white/30 font-medium">Your recent wishbit activity</p>
                      </div>
                    </div>
                    
                    <button className="px-6 py-3 rounded-full border border-fuchsia-500/20 text-fuchsia-400 text-[11px] font-black uppercase tracking-widest hover:bg-fuchsia-500/10 transition-all flex items-center gap-3 group active:scale-95">
                      View All Transactions
                      <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>

                  {/* List of Transactions */}
                  <div className="space-y-4">
                    {transactions.map((tx) => (
                      <div 
                        key={tx.id} 
                        className="flex items-center justify-between p-6 md:p-7 rounded-[2.5rem] bg-[#0A0A0A]/60 backdrop-blur-md border border-white/5 hover:border-white/10 transition-all group"
                      >
                        <div className="flex items-center gap-5">
                          {/* Icon mapping based on transaction type/label */}
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                            tx.type === 'credit' 
                              ? 'bg-green-500/10 text-green-400 border border-green-500/10' 
                              : 'bg-fuchsia-500/10 text-fuchsia-400 border border-fuchsia-500/10'
                          }`}>
                            {tx.label.toLowerCase().includes('purchased') ? <CreditCard size={20} /> : 
                             tx.label.toLowerCase().includes('reward') ? <Gift size={20} /> : 
                             <ShoppingBag size={20} />}
                          </div>
                          <div>
                            <p className="text-base font-bold text-white group-hover:text-fuchsia-400 transition-colors tracking-tight">{tx.label}</p>
                            <p className="text-[11px] font-bold text-white/20 uppercase tracking-[0.2em] mt-1">{tx.date}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-8 md:gap-16">
                          {/* Amount with Sign */}
                          <div className="flex items-center gap-2.5">
                            <span className={`text-xl font-black ${tx.type === 'credit' ? 'text-green-400' : 'text-white'}`}>
                              {tx.type === 'credit' ? '+' : '-'}{tx.amount}
                            </span>
                            <WishbitIcon size={32} className="drop-shadow-none" />
                          </div>

                          {/* Status Badge */}
                          <div className="hidden sm:block min-w-[100px] text-right">
                            <span className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest ${
                              tx.type === 'credit' 
                                ? 'bg-green-500/10 text-green-500 border border-green-500/10' 
                                : 'bg-fuchsia-500/10 text-fuchsia-500 border border-fuchsia-500/10'
                            }`}>
                              {tx.type === 'credit' ? 'Received' : 'Spent'}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-8 text-center">
                    <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/10">That's all for now ✨</p>
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
                      <div className="flex items-center gap-3 px-5 py-3 bg-white/5 rounded-2xl border border-white/10">
                        <WishbitIcon size={20} />
                        <div>
                          <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Current Balance</p>
                          <p className="text-sm font-black text-white">{balance.toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {wishbitPacks.map((pack) => (
                        <motion.div
                          key={pack.id}
                          whileHover={{ y: -8, scale: 1.02 }}
                          className={`relative p-[1px] rounded-[2.5rem] ${pack.popular ? 'bg-linear-to-b from-fuchsia-500 to-orange-500' : 'bg-white/10'} transition-all group shadow-2xl shadow-black/50`}
                        >
                          {pack.popular && (
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-linear-to-r from-fuchsia-500 to-orange-500 text-[8px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full z-20 shadow-xl shadow-fuchsia-500/20">
                              Recommended
                            </div>
                          )}
                          <div className="h-full bg-[#0D0D0D] p-8 md:p-10 rounded-[calc(2.5rem-1px)] flex flex-col items-center text-center relative overflow-hidden">
                            <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 blur-[60px] rounded-full opacity-10 pointer-events-none ${pack.popular ? 'bg-fuchsia-500' : 'bg-white/20'}`} />
                            
                            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-8 relative z-10 group-hover:bg-white/10 transition-all group-hover:scale-110">
                              <WishbitIcon size={32} />
                            </div>
                            <h4 className="text-xs font-bold text-white/30 uppercase tracking-[0.3em] mb-2 relative z-10">{pack.label}</h4>
                            <div className="flex items-baseline gap-2 mb-8 relative z-10">
                              <span className="text-4xl md:text-5xl font-black text-white tracking-tighter">{pack.amount}</span>
                              <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Wishbits</span>
                            </div>
                            <button className={`w-full py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all relative z-10 shadow-lg ${pack.popular ? 'bg-white text-black hover:bg-fuchsia-500 hover:text-white hover:scale-[1.02]' : 'bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 hover:text-white'}`}>
                              Buy for {pack.price}
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <div className="p-10 rounded-[3rem] bg-linear-to-br from-white/5 to-transparent border border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
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
    </div>
  );
}
