import React, { useContext, useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, Copy, CheckCircle2, Wallet, Users, Trophy, Send, User, Settings, LogOut, Share2, ChevronRight, Loader2, Lock, LayoutGrid } from 'lucide-react';
import WishbitIcon from '../../components/icons/WishbitIcon';
import AnimatedBalance from '../../components/ui/AnimatedBalance';
import { useAuth } from '../../context/AuthContext';
import { ViewContext } from '../../context/NavContext';
import { useWallet } from '../../context/WalletContext';
import giftboxImg from '../../assets/giftbox.png';
import Footer from '../../layout/Footer';

export default function ReferalView() {
  const [currentView, navigateTo] = useContext(ViewContext);
  const { currentUser, logout } = useAuth();
  const { balance, referrals, claimWishbits: claimWishbitsGlobal, claimedTotal, pendingTotal, referralCode, bonusAmounts, claiming, refreshWallet: refreshWalletGlobal } = useWallet();
  
  const [activeTab, setActiveTab] = useState('refer');
  const [copied, setCopied] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const referralLink = `${window.location.origin}/join?ref=${referralCode}`;

  const menuRef = useRef(null);

  useEffect(() => {
    refreshWalletGlobal();
  }, [refreshWalletGlobal, activeTab]);

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

  if (currentView !== 'refer') return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const claimWishbits = async (id) => {
    await claimWishbitsGlobal(id);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-fuchsia-500/30 w-full relative z-50">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.07] z-0"
        style={{ backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`, backgroundSize: '32px 32px' }}
      />
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[50%] bg-fuchsia-600/8 blur-[140px] rounded-full" />
        <div className="absolute bottom-[5%] right-[-10%] w-[60%] h-[60%] bg-orange-600/6 blur-[140px] rounded-full" />
        <div className="absolute top-[40%] left-[30%] w-[40%] h-[30%] bg-pink-600/4 blur-[100px] rounded-full" />
      </div>

      <nav className="sticky top-0 z-50 bg-black/20 backdrop-blur-md border-b border-white/5 w-full h-12 flex items-center px-6 md:px-12">
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigateTo('moments')} className="group flex items-center gap-2 text-white/40 hover:text-white transition-colors">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="group-hover:-translate-x-1 transition-transform">
                <polyline points="15 18 9 12 15 6" />
              </svg>
              <span className="text-[9px] md:text-[10px] font-mono uppercase tracking-[0.3em] font-bold whitespace-nowrap">My Moments</span>
            </button>
          </div>

          <div className="flex items-center gap-3 md:gap-6">
            {currentUser && (
              <button 
                onClick={() => navigateTo('wallet')}
                className="active:scale-95 transition-transform"
              >
                <AnimatedBalance 
                  value={balance} 
                  iconSize={32} 
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
                        onClick={() => setShowProfileMenu(false)}
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
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </nav>

      <main className="w-full max-w-[1600px] mx-auto px-6 md:px-12 pt-16 md:pt-24 pb-24 relative z-10">
        <header className="mb-10 md:mb-12 text-left relative flex flex-col md:flex-row md:items-start justify-between gap-12">
          <div className="relative w-full md:max-w-4xl z-10">
            <h1 className="text-[2rem] sm:text-4xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-[0.85] text-white">
              <span className="whitespace-nowrap">Refer & Earn</span><br />
              <span className="text-transparent bg-clip-text bg-linear-to-br from-fuchsia-500 via-pink-400 to-orange-400">Wishbits.</span>
            </h1>
            
            <p className="mt-8 text-sm md:text-lg text-white/50 max-w-xl font-medium leading-relaxed">
              Share your link with friends. When they join, you both get wishbits.
            </p>

            <div className="grid grid-cols-2 gap-3 md:gap-4 mt-8 max-w-xl">
              <div className="flex items-center gap-3 px-4 py-3 md:px-6 md:py-4 rounded-2xl bg-fuchsia-500/[0.03] border border-fuchsia-500/10 backdrop-blur-sm">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-fuchsia-500/10 flex items-center justify-center text-fuchsia-400 shrink-0">
                  <Gift size={18} className="md:w-5 md:h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[9px] md:text-[10px] font-bold text-white/40 uppercase tracking-widest truncate">You get</p>
                  <p className="text-xs md:text-base font-black text-fuchsia-400 truncate">{bonusAmounts?.referral || 50} wishbits</p>
                </div>
              </div>

              <div className="flex items-center gap-3 px-4 py-3 md:px-6 md:py-4 rounded-2xl bg-pink-500/[0.03] border border-pink-500/10 backdrop-blur-sm">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-pink-500/10 flex items-center justify-center text-pink-400 shrink-0">
                  <Users size={18} className="md:w-5 md:h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[9px] md:text-[10px] font-bold text-white/40 uppercase tracking-widest truncate">They get</p>
                  <p className="text-xs md:text-base font-black text-pink-400 truncate">{bonusAmounts?.refSignup || 30} wishbits</p>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute top-[-20px] right-[10px] md:relative md:top-auto md:right-auto w-64 h-64 md:w-full md:max-w-[500px] md:h-[400px] pointer-events-none select-none shrink-0 md:mr-20 lg:mr-32">
             <div className="absolute inset-0 scale-[0.45] md:scale-100 origin-top-right md:origin-right">
                <div className="relative w-full h-full flex items-center justify-center">
                  
                  {/* Main Gift Box PNG */}
                  <motion.div 
                    animate={{ y: [0, -25, 0], rotate: [10, 20, 10] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    className="relative z-50 w-64 h-64 md:w-80 md:h-80"
                  >
                    {/* Inner Light Glow */}
                    <motion.div 
                      animate={{ 
                        scale: [0.8, 1.2, 0.8],
                        opacity: [0.5, 0.8, 0.5]
                      }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute inset-0 m-auto w-32 h-32 md:w-48 md:h-48 bg-fuchsia-500/40 rounded-full blur-[60px] md:blur-[100px] mix-blend-screen z-[-1]"
                    />
                    <motion.div 
                      animate={{ 
                        scale: [1, 1.5, 1],
                        opacity: [0.3, 0.6, 0.3]
                      }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                      className="absolute inset-0 m-auto w-40 h-40 md:w-60 md:h-60 bg-orange-400/30 rounded-full blur-[80px] md:blur-[120px] mix-blend-screen z-[-2]"
                    />

                    <img 
                      src={giftboxImg} 
                      alt="Rewards" 
                      className="w-full h-full object-contain drop-shadow-[0_20px_50px_rgba(217,70,239,0.4)] relative z-10"
                    />
                  </motion.div>

                  {/* LEFT Avatar (Referrer) */}
                  <motion.div 
                    animate={{ x: [-10, 0, -10], y: [0, -20, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute left-[10%] md:left-[5%] top-[20%] z-60"
                  >
                    <div className="w-16 h-16 md:w-24 md:h-24 rounded-full bg-white/5 border-2 border-fuchsia-500/30 backdrop-blur-xl p-1 shadow-2xl overflow-hidden group">
                      <div className="w-full h-full rounded-full bg-linear-to-br from-fuchsia-500/20 to-transparent flex items-center justify-center text-fuchsia-400">
                        <User size={40} />
                      </div>
                    </div>
                  </motion.div>

                  {/* RIGHT Avatar (New Friend) */}
                  <motion.div 
                    animate={{ x: [10, 0, 10], y: [0, 20, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute right-[10%] md:right-[5%] bottom-[20%] z-60"
                  >
                    <div className="w-14 h-14 md:w-20 md:h-20 rounded-full bg-white/5 border-2 border-orange-500/30 backdrop-blur-xl p-1 shadow-2xl overflow-hidden">
                      <div className="w-full h-full rounded-full bg-linear-to-br from-orange-500/20 to-transparent flex items-center justify-center text-orange-400">
                        <Users size={32} />
                      </div>
                    </div>
                  </motion.div>

                  {/* Wishbits Floating In-Between */}
                  <motion.div 
                    animate={{ 
                      y: [0, 30, 0], 
                      rotate: [-20, -10, -20],
                      scale: [0.7, 0.9, 0.7]
                    }}
                    transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                    className="absolute left-[15%] bottom-[15%] z-40"
                  >
                    <WishbitIcon size={80} className="drop-shadow-[0_0_30px_rgba(217,70,239,0.3)] opacity-60" />
                  </motion.div>

                  <motion.div 
                    animate={{ 
                      y: [0, -40, 0], 
                      rotate: [20, 30, 20],
                      scale: [0.8, 1, 0.8]
                    }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                    className="absolute right-[15%] top-[10%] z-40"
                  >
                    <WishbitIcon size={100} className="drop-shadow-[0_0_40px_rgba(217,70,239,0.4)] opacity-70" />
                  </motion.div>
                  {/* Floating Particles/Sparkles */}
                  {[...Array(12)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{ 
                        scale: [0.8, 1.4, 0.8],
                        opacity: [0.1, 0.7, 0.1],
                        y: [0, -40, 0],
                        x: [0, (i % 2 === 0 ? 15 : -15), 0]
                      }}
                      transition={{ 
                        duration: 3 + (i % 4), 
                        repeat: Infinity, 
                        ease: "easeInOut",
                        delay: i * 0.4 
                      }}
                      className={`absolute rounded-full blur-[1px] shadow-[0_0_10px_currentColor] ${
                        i % 3 === 0 ? 'bg-fuchsia-400 text-fuchsia-400' : 
                        i % 3 === 1 ? 'bg-orange-300 text-orange-300' : 
                        'bg-white text-white'
                      }`}
                      style={{
                        width: i % 4 === 0 ? '4px' : '2px',
                        height: i % 4 === 0 ? '4px' : '2px',
                        top: `${10 + (i * 7) % 80}%`,
                        left: `${10 + (i * 13) % 80}%`,
                        zIndex: 30
                      }}
                    />
                  ))}

                  {/* Realistic Energy Ribbon/Trail between avatars */}
                  <svg className="absolute inset-0 w-full h-full z-20 pointer-events-none overflow-visible" viewBox="0 0 500 400">
                    <defs>
                      <linearGradient id="energyGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#d946ef" stopOpacity="0" />
                        <stop offset="20%" stopColor="#d946ef" stopOpacity="0.8" />
                        <stop offset="50%" stopColor="#fb923c" stopOpacity="1" />
                        <stop offset="80%" stopColor="#d946ef" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#d946ef" stopOpacity="0" />
                      </linearGradient>
                      <filter id="glow">
                        <feGaussianBlur stdDeviation="3" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                      </filter>
                    </defs>

                    <motion.path
                      d="M 80,100 C 150,50 350,300 420,250"
                      fill="none"
                      stroke="url(#energyGradient)"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeDasharray="10 30"
                      filter="url(#glow)"
                      animate={{ strokeDashoffset: [0, -200] }}
                      transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                      className="opacity-40"
                    />

                    <motion.path
                      d="M 80,100 C 150,50 350,300 420,250"
                      fill="none"
                      stroke="white"
                      strokeWidth="1"
                      strokeLinecap="round"
                      strokeDasharray="1 100"
                      animate={{ strokeDashoffset: [0, -500] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                      className="opacity-60"
                    />
                  </svg>
                </div>
             </div>
          </div>
        </header>

        <div className="flex justify-end gap-8 mt-10 md:mt-0 mb-10">
            {['refer', 'rewards'].map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`pb-1 text-[10px] md:text-[11px] font-black uppercase tracking-[0.3em] relative transition-colors ${activeTab === tab ? 'text-white' : 'text-white/30 hover:text-white/60'}`}
              >
                {tab}
                {activeTab === tab && (
                  <motion.div 
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-fuchsia-500 shadow-[0_0_15px_#d946ef]"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            ))}
        </div>

        {activeTab === 'refer' ? (
          <div className="space-y-6 md:space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
              <div className="lg:col-span-12">
                <div className="py-20 flex flex-col items-center text-center">
                  {/* Redesigned Referral Section (Microsoft Rewards Style) */}
                  <h3 className="text-3xl md:text-5xl font-black text-white mb-10 tracking-tight leading-tight max-w-xl">
                    Refer your friends to <span className="text-transparent bg-clip-text bg-linear-to-br from-fuchsia-500 via-pink-400 to-orange-400">Moment Crafter</span>
                  </h3>
                  
                  <div className="w-full max-w-3xl space-y-6">
                    <div className="relative group">
                      <input 
                        readOnly 
                        value={referralLink}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-5 text-sm md:text-base font-medium text-white/50 focus:outline-none transition-all group-hover:border-white/20"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <button 
                        onClick={handleCopy}
                        className={`flex items-center justify-center gap-3 px-8 py-5 rounded-xl text-sm md:text-base font-bold transition-all active:scale-95 ${
                          copied ? 'bg-emerald-500 text-white' : 'bg-[#e0e7ff] text-black hover:bg-white'
                        }`}
                      >
                        {copied ? <CheckCircle2 size={20} /> : <Copy size={20} />}
                        {copied ? 'Copied' : 'Copy link'}
                      </button>
                      
                      <button 
                        className="flex items-center justify-center gap-3 px-8 py-5 rounded-xl border-2 border-white/20 bg-transparent text-white text-sm md:text-base font-bold transition-all hover:bg-white/5 active:scale-95"
                        onClick={() => {
                          if (navigator.share) {
                            navigator.share({
                              title: 'Join Moment Maker',
                              text: 'Create magical moments with me!',
                              url: referralLink,
                            });
                          }
                        }}
                      >
                        <Share2 size={20} />
                        Share
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* REWARDS TAB CONTENT */
          <div className="space-y-12">
            {/* 1. STATS CARDS (Now at top) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-3 gap-4"
            >
              {[
                { label: 'Friends Invited', value: referrals?.length || 0, color: 'text-white' },
                { label: 'Wishbits Earned', value: claimedTotal || 0, color: 'text-fuchsia-400', icon: true },
                { label: 'Wishbits Pending', value: pendingTotal || 0, color: (pendingTotal || 0) > 0 ? 'text-orange-400' : 'text-white/20', icon: true },
              ].map((stat) => (
                <div key={stat.label} className="p-5 md:p-6 rounded-2xl bg-white/3 border border-white/8 text-center group">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <p className={`text-2xl md:text-3xl font-black ${stat.color}`}>{stat.value}</p>
                    {stat.icon && <WishbitIcon size={28} className={`${stat.color} drop-shadow-[0_0_12px_currentColor]`} />}
                  </div>
                  <p className="text-[10px] md:text-[12px] font-bold uppercase tracking-widest text-white/30">{stat.label}</p>
                </div>
              ))}
            </motion.div>

                    {/* 2. REFERRAL JOURNEY (Friends List) */}
            <div className="space-y-8 bg-transparent">
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-fuchsia-500/10 flex items-center justify-center text-fuchsia-400 border border-fuchsia-500/20 shadow-[0_0_20px_rgba(217,70,239,0.1)]">
                    <Users size={20} />
                  </div>
                  <div>
                    <h2 className="text-sm font-black text-white tracking-[0.2em] uppercase">Referral Journey</h2>
                    <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mt-0.5">Track your progress and rewards</p>
                  </div>
                </div>
              </div>
              
              <div className="relative group/journey bg-transparent">
                <div className="flex overflow-x-auto py-12 gap-10 no-scrollbar snap-x scroll-px-4 bg-transparent">
                  {[
                    ...(referrals || []),
                    { id: 'ghost', displayName: 'Invite Friend', initial: '+', status: 'ghost' }
                  ].map((ref, i, arr) => (
                    <div key={ref.id} className="flex snap-start first:pl-4 last:pr-4">
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1, type: "spring", stiffness: 300, damping: 20 }}
                        className="flex flex-col items-center gap-5 min-w-[120px] group/item"
                        onClick={ref.status === 'ghost' ? () => setActiveTab('refer') : undefined}
                        style={ref.status === 'ghost' ? { cursor: 'pointer' } : {}}
                      >
                        {/* Avatar Container */}
                        <div className="relative group/avatar">
                          {/* Outer Glow for Claimable/Claimed */}
                          <div className={`absolute inset-0 blur-2xl rounded-full transition-all duration-500 scale-125 ${
                            ref.status === 'claimed' ? 'bg-fuchsia-500/10 opacity-100' : 
                            ref.friendClaimed ? 'bg-fuchsia-500/20 opacity-100 animate-pulse' : 
                            'opacity-0'
                          }`} />

                          <div className={`w-20 h-20 md:w-24 md:h-24 rounded-full border-2 transition-all duration-500 relative z-10 p-1 backdrop-blur-xl shadow-2xl flex items-center justify-center ${
                            ref.status === 'claimed' 
                              ? 'bg-white/5 border-fuchsia-500/60 shadow-[0_0_30px_rgba(217,70,239,0.3)]' 
                              : ref.status === 'ghost'
                              ? 'bg-zinc-950/40 border-dashed border-white/10 text-white/20 hover:border-fuchsia-500/40 hover:bg-fuchsia-500/5'
                              : 'bg-white/5 border-white/10 group-hover/item:border-white/20'
                          }`}>
                            <div className={`w-full h-full rounded-full flex items-center justify-center transition-colors duration-300 ${
                              ref.status === 'claimed' 
                                ? 'bg-linear-to-br from-fuchsia-500/30 to-transparent text-fuchsia-400' 
                                : ref.status === 'ghost'
                                ? 'bg-transparent text-white/20 group-hover/item:text-fuchsia-400'
                                : 'bg-linear-to-br from-white/5 to-transparent text-white/20 group-hover/item:from-white/10'
                            }`}>
                              {ref.status === 'ghost' ? (
                                <span className="text-3xl font-light">+</span>
                              ) : (
                                <User size={32} className="md:w-10 md:h-10" />
                              )}
                            </div>

                            {/* Badge */}
                            {ref.status === 'claimed' && (
                              <div className="absolute -top-1 -right-1 w-7 h-7 bg-emerald-500 rounded-full border-4 border-[#050505] flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.4)]">
                                <CheckCircle2 size={12} className="text-white" strokeWidth={4} />
                              </div>
                            )}
                            
                            {ref.friendClaimed && ref.status !== 'claimed' && (
                              <div className="absolute -top-1 -right-1 w-7 h-7 bg-fuchsia-500 rounded-full border-4 border-[#050505] flex items-center justify-center shadow-[0_0_15px_rgba(217,70,239,0.4)] animate-bounce">
                                <Gift size={12} className="text-white" strokeWidth={3} />
                              </div>
                            )}

                            {/* Connection Line (Increased width to bridge gap between cards) */}
                            {i < arr.length - 1 && (
                              <div className="absolute top-1/2 left-full w-20 md:w-24 h-[1px] -translate-y-1/2 z-[-1] pointer-events-none">
                                <div className={`w-full h-full relative ${
                                  ref.status === 'claimed' ? 'bg-fuchsia-500/30' : 'bg-white/5'
                                }`}>
                                  {ref.status === 'claimed' && (
                                    <motion.div 
                                      initial={{ x: -20, opacity: 0 }}
                                      animate={{ x: 20, opacity: 1 }}
                                      transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                                      className="absolute top-0 left-0 w-4 h-full bg-linear-to-r from-transparent via-fuchsia-400 to-transparent blur-[1px]"
                                    />
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="text-center space-y-1">
                          <p className="text-[11px] font-black text-white/80 tracking-tight group-hover/item:text-white transition-colors truncate max-w-[100px] mx-auto">
                            {ref.displayName}
                          </p>
                          
                          <div className="flex flex-col items-center gap-3">
                            <p className={`text-[9px] font-black uppercase tracking-[0.15em] ${
                              ref.status === 'claimed' ? 'text-emerald-400' 
                              : ref.status === 'ghost' ? 'text-white/30 group-hover/item:text-fuchsia-400'
                              : ref.friendClaimed ? 'text-fuchsia-400'
                              : 'text-white/20'
                            }`}>
                              {ref.status === 'claimed' ? 'Claimed' : ref.status === 'ghost' ? 'Invite' : 'Pending'}
                            </p>

                            {ref.status === 'pending' && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (!claiming[ref.id] && ref.friendClaimed) claimWishbits(ref.id);
                                }}
                                disabled={claiming[ref.id] || !ref.friendClaimed}
                                className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all duration-300 flex items-center gap-1.5 min-w-[80px] justify-center ${
                                  !ref.friendClaimed
                                  ? 'bg-white/5 text-white/20 border border-white/5 cursor-not-allowed'
                                  : claiming[ref.id]
                                  ? 'bg-fuchsia-500/20 text-fuchsia-400 border border-fuchsia-500/30 cursor-wait'
                                  : 'bg-fuchsia-500 text-white hover:bg-fuchsia-400 hover:scale-105 active:scale-95 shadow-[0_5px_15px_rgba(217,70,239,0.3)]'
                                }`}
                              >
                                {claiming[ref.id] ? (
                                  <Loader2 size={10} className="animate-spin" />
                                ) : !ref.friendClaimed ? (
                                  <><Lock size={10} /> Locked</>
                                ) : (
                                  'Claim'
                                )}
                              </button>
                            )}

                            {!ref.friendClaimed && ref.status === 'pending' && (
                              <p className="text-[8px] font-bold text-fuchsia-400/40 uppercase tracking-tight leading-tight">
                                Waiting for friend
                              </p>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 3. REFERRAL BONUSES (Milestones) */}
            <div className="w-full pt-4">
              <div className="flex items-center gap-3 mb-12">
                <div className="w-12 h-12 rounded-xl bg-pink-500/10 flex items-center justify-center text-pink-400">
                  <Trophy size={24} />
                </div>
                <h2 className="text-xl font-bold text-white tracking-tight">Referral Bonuses</h2>
              </div>

              <div className="relative pt-16 pb-12 overflow-x-auto no-scrollbar">
                <div className="relative min-w-[600px] md:min-w-full lg:max-w-5xl lg:mx-auto px-4 md:px-10">
                  <div className="absolute top-1/2 left-4 right-4 md:left-10 md:right-10 h-[2px] bg-white/5 -translate-y-1/2" />
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(((referrals?.length || 0) / 50) * 100, 100)}%` }}
                    className="absolute top-1/2 left-4 md:left-10 h-[2px] bg-linear-to-r from-fuchsia-600 via-pink-500 to-orange-400 -translate-y-1/2 shadow-[0_0_20px_#d946ef] origin-left"
                    style={{ maxWidth: 'calc(100% - 2rem)' }}
                  />
                  <div className="relative flex justify-between">
                    {[
                      { count: 1, label: 'First Friend', reward: '50 Wishbits', color: 'fuchsia' },
                      { count: 5, label: '5 Friends', reward: '250 Wishbits', color: 'orange' },
                      { count: 10, label: '10 Friends', reward: '600 Wishbits', color: 'pink' },
                      { count: 25, label: '25 Friends', reward: '1,750 Wishbits', color: 'red' },
                      { count: 50, label: '50 Friends', reward: '4,000 Wishbits', color: 'fuchsia' },
                    ].map((m, idx) => {
                      const isReached = (referrals?.length || 0) >= m.count;
                      const colorClasses = {
                        fuchsia: isReached 
                          ? 'border-fuchsia-500/60 text-fuchsia-400 shadow-[0_0_20px_rgba(217,70,239,0.4)]' 
                          : 'border-fuchsia-500/20 text-fuchsia-500/40 group-hover:border-fuchsia-500/40 group-hover:text-fuchsia-400 group-hover:shadow-[0_0_15px_rgba(217,70,239,0.15)]',
                        orange: isReached 
                          ? 'border-orange-500/60 text-orange-400 shadow-[0_0_20px_rgba(249,115,22,0.4)]' 
                          : 'border-orange-500/20 text-orange-500/40 group-hover:border-orange-500/40 group-hover:text-orange-400 group-hover:shadow-[0_0_15px_rgba(249,115,22,0.15)]',
                        pink: isReached 
                          ? 'border-pink-500/60 text-pink-400 shadow-[0_0_20px_rgba(236,72,153,0.4)]' 
                          : 'border-pink-500/20 text-pink-500/40 group-hover:border-pink-500/40 group-hover:text-pink-400 group-hover:shadow-[0_0_15px_rgba(236,72,153,0.15)]',
                        red: isReached 
                          ? 'border-red-500/60 text-red-400 shadow-[0_0_20px_rgba(239,68,68,0.4)]' 
                          : 'border-red-500/20 text-red-500/40 group-hover:border-red-500/40 group-hover:text-red-400 group-hover:shadow-[0_0_15px_rgba(239,68,68,0.15)]',
                      };
                      return (
                        <div key={idx} className="flex flex-col items-center gap-4 relative group">
                          <div className={`absolute -top-12 whitespace-nowrap text-[11px] font-black uppercase tracking-widest transition-all ${isReached ? 'text-white' : 'text-white/40 group-hover:text-white/70'}`}>
                            {m.label}
                          </div>
                          
                          {/* Glow Background Effect */}
                          {isReached ? (
                            <motion.div 
                              initial={{ scale: 0.8, opacity: 0 }}
                              animate={{ scale: 1.4, opacity: [0.1, 0.3, 0.1] }}
                              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                              className={`absolute inset-0 rounded-full blur-xl -z-10 ${
                                m.color === 'fuchsia' ? 'bg-fuchsia-500' : 
                                m.color === 'orange' ? 'bg-orange-500' :
                                m.color === 'pink' ? 'bg-pink-500' : 'bg-red-500'
                              }`}
                            />
                          ) : (
                            /* Subtle Hover Glow for Unreached */
                            <div className={`absolute inset-0 rounded-full blur-lg opacity-0 group-hover:opacity-10 transition-opacity -z-10 ${
                              m.color === 'fuchsia' ? 'bg-fuchsia-500' : 
                              m.color === 'orange' ? 'bg-orange-500' :
                              m.color === 'pink' ? 'bg-pink-500' : 'bg-red-500'
                            }`} />
                          )}
  
                          <div className={`w-20 h-20 rounded-full border-2 bg-zinc-950/50 backdrop-blur-sm flex items-center justify-center transition-all z-10 ${
                            isReached 
                              ? `${colorClasses[m.color]} scale-110` 
                              : `${colorClasses[m.color]}`
                          }`}>
                            <Gift 
                              size={34} 
                              className={`transition-all ${
                                isReached 
                                  ? 'animate-bounce drop-shadow-[0_0_10px_currentColor]' 
                                  : 'drop-shadow-[0_0_5px_currentColor] group-hover:scale-110'
                              }`} 
                            />
                          </div>
                          <div className={`absolute -bottom-10 whitespace-nowrap text-[12px] font-black transition-all flex items-center gap-1 ${isReached ? 'text-pink-400' : 'text-white/10'}`}>
                            {m.reward.split(' ')[0]}
                            <WishbitIcon size={24} className={isReached ? 'opacity-100' : 'opacity-20'} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
