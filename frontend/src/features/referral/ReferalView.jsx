import React, { useContext, useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, Copy, CheckCircle2, Wallet, Users, Trophy, Send, Sparkles, User, Settings, LogOut, Share2, ChevronRight } from 'lucide-react';
import WishbitIcon from '../../components/icons/WishbitIcon';
import { useAuth } from '../../context/AuthContext';
import { ViewContext } from '../../context/NavContext';
import { useWallet } from '../../context/WalletContext';
import giftboxImg from '../../assets/giftbox.png';
import Footer from '../../layout/Footer';

export default function ReferalView() {
  const [currentView, navigateTo] = useContext(ViewContext);
  const { currentUser, logout } = useAuth();
  const { balance, referrals, claimWishbits: claimWishbitsGlobal, claimedTotal, pendingTotal, referralCode } = useWallet();
  
  const [activeTab, setActiveTab] = useState('refer');
  const [copied, setCopied] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [toast, setToast] = useState(null);

  const referralLink = `${window.location.origin}/ref/${referralCode}`;

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

  if (currentView !== 'refer') return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const claimWishbits = (id) => {
    claimWishbitsGlobal(id);
    setToast('🎉 50 Wishbits added to your Wallet!');
    setTimeout(() => setToast(null), 3000);
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
              <span className="text-[9px] md:text-[10px] font-mono uppercase tracking-[0.3em] font-bold whitespace-nowrap">Back to Moments</span>
            </button>
          </div>

          <div className="flex items-center gap-3 md:gap-6">
            {currentUser && (
              <button 
                onClick={() => navigateTo('wallet')}
                className="flex items-center gap-0 py-1 transition-all select-none group active:scale-95"
              >
                <WishbitIcon size={32} className="drop-shadow-none group-hover:scale-110 transition-transform" />
                <span className="text-base md:text-lg font-black tracking-tighter text-white">
                  {(balance || 0).toLocaleString()}
                </span>
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
                className={`pb-4 text-[10px] md:text-[11px] font-black uppercase tracking-[0.3em] relative transition-colors ${activeTab === tab ? 'text-white' : 'text-white/30 hover:text-white/60'}`}
              >
                {tab}
                {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-fuchsia-500 shadow-[0_0_15px_#d946ef]" />}
              </button>
            ))}
        </div>

        {activeTab === 'refer' ? (
          <div className="space-y-6 md:space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
              <div className="lg:col-span-8">
                <div className="h-full rounded-[2.5rem] bg-[#0d0d0f] border border-white/5 shadow-2xl overflow-hidden">
                  <div className="p-6 md:p-10 flex flex-col h-full">
                    <div className="flex items-center gap-3 mb-8">
                      <div className="w-10 h-10 rounded-xl bg-fuchsia-500/10 flex items-center justify-center text-fuchsia-400">
                        <Users size={20} />
                      </div>
                      <h2 className="text-xl font-bold text-white tracking-tight">Your Referral Summary</h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="p-7 rounded-[2rem] bg-fuchsia-500/[0.03] border border-fuchsia-500/10 hover:border-fuchsia-500/20 transition-all group relative overflow-hidden"
                      >
                        <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-white/30 mb-5">You Earned</p>
                        <div className="flex items-center gap-4">
                          <span className="text-4xl md:text-5xl font-black text-white leading-none tracking-tighter">{claimedTotal || 0}</span>
                          <div className="flex items-center gap-2">
                            <WishbitIcon size={24} className="group-hover:scale-110 transition-transform" />
                            <span className="text-sm font-bold text-fuchsia-400/80">Wishbits</span>
                          </div>
                        </div>
                      </motion.div>
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="p-7 rounded-[2rem] bg-orange-500/[0.03] border border-orange-500/10 hover:border-orange-500/20 transition-all group relative overflow-hidden"
                      >
                        <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-white/30 mb-5">Friends Joined</p>
                        <div className="flex items-center gap-4">
                          <span className="text-4xl md:text-5xl font-black text-white leading-none tracking-tighter">{referrals?.length || 0}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-400">
                              <Users size={12} />
                            </div>
                            <span className="text-sm font-bold text-orange-400/80">Friends</span>
                          </div>
                        </div>
                      </motion.div>
                    </div>

                    <div className="mt-auto space-y-4">
                      <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-white/30">Your Referral Link</p>
                      <div className="flex flex-col sm:flex-row items-stretch gap-3">
                        <div className="flex-1 relative">
                          <input 
                            readOnly 
                            value={referralLink}
                            className="w-full bg-[#161618] border border-white/5 rounded-2xl px-5 py-4 text-xs font-mono text-white/50 focus:outline-none transition-all hover:border-white/10"
                          />
                        </div>
                        <button 
                          onClick={handleCopy}
                          className="px-8 py-4 rounded-2xl bg-linear-to-r from-fuchsia-600 to-orange-500 text-white text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-lg shadow-fuchsia-500/20 hover:brightness-110 active:scale-95 transition-all"
                        >
                          {copied ? <CheckCircle2 size={16} /> : <Copy size={16} />}
                          {copied ? 'Copied!' : 'Copy Link'}
                        </button>
                      </div>

                      <div className="pt-6">
                        <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-white/20 mb-5">Share directly</p>
                        <div className="flex flex-wrap gap-4 items-center">
                          <button className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center transition-all hover:scale-110 active:scale-95 text-white hover:bg-white/5">
                            <Share2 size={20} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-4">
                <div className="h-full rounded-[2.5rem] bg-[#0d0d0f] border border-white/5 shadow-2xl">
                  <div className="p-8 md:p-10 flex flex-col h-full">
                    <div className="flex items-center gap-3 mb-10">
                      <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-400">
                        <Sparkles size={20} />
                      </div>
                      <h2 className="text-xl font-bold text-white tracking-tight">How it works</h2>
                    </div>

                    <div className="relative space-y-12">
                      <div className="absolute left-6 top-8 bottom-8 w-[1px] bg-white/5" />
                      {[
                        { step: '01', title: 'Share your link', desc: 'Send your link to friends.', color: 'text-fuchsia-400 border-fuchsia-500/20' },
                        { step: '02', title: 'They sign up', desc: 'Your friend joins Moment Maker.', color: 'text-orange-400 border-orange-500/20' },
                        { step: '03', title: 'You both earn', desc: 'You get 50 wishbits, they get 30 — instantly.', color: 'text-pink-400 border-pink-500/20' }
                      ].map((s, idx) => (
                        <motion.div 
                          key={idx}
                          initial={{ opacity: 0, x: 20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: idx * 0.1 }}
                          className="relative flex items-start gap-6 group"
                        >
                          <div className={`w-12 h-12 shrink-0 rounded-full border bg-[#161618] flex items-center justify-center text-xs font-black z-10 transition-transform group-hover:scale-110 ${s.color}`}>
                            {s.step}
                          </div>
                          <div className="pt-1">
                            <h3 className="text-sm font-black text-white mb-1 group-hover:text-fuchsia-400 transition-colors">{s.title}</h3>
                            <p className="text-xs text-white/40 leading-relaxed max-w-[200px]">{s.desc}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-10">
            <div>
              <p className="text-[10px] font-mono font-bold uppercase tracking-[0.4em] text-white/30 mb-8">Your Referral Journey</p>

              <div className="overflow-x-auto pb-4 -mx-6 px-6">
                <div className="flex items-start gap-0 min-w-max">
                  {[
                    ...(referrals || []),
                    { id: 'ghost', name: null, initial: '+', date: null, status: 'ghost' },
                  ].map((ref, i, arr) => (
                    <div key={ref.id} className="flex items-start">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="flex flex-col items-center gap-3 w-36 md:w-44"
                        onClick={ref.status === 'ghost' ? () => setActiveTab('refer') : undefined}
                        style={ref.status === 'ghost' ? { cursor: 'pointer' } : {}}
                      >
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-black border-2 shrink-0 ${
                          ref.status === 'claimed'  ? 'bg-fuchsia-500/20 border-fuchsia-500/60 text-fuchsia-300'
                          : ref.status === 'pending' ? 'bg-orange-500/10 border-orange-500/30 text-orange-400'
                          : 'bg-white/5 border-dashed border-white/20 text-white/30'
                        }`}>
                          {ref.initial || '+'}
                        </div>

                        <div className={`p-4 rounded-2xl border text-center transition-all w-full ${
                          ref.status === 'claimed'  ? 'bg-fuchsia-500/[0.03] border-fuchsia-500/10'
                          : ref.status === 'pending' ? 'bg-orange-500/[0.03] border-orange-500/10'
                          : 'bg-white/[0.02] border-dashed border-white/10 opacity-60'
                        }`}>
                          <p className="text-[10px] font-black text-white mb-1 truncate px-2">{ref.name || 'Invite a friend'}</p>
                          <p className="text-[8px] font-mono text-white/30 uppercase tracking-wider">
                            {ref.status === 'ghost' ? 'earn 50 wishbits' : ref.date || 'Pending...'}
                          </p>

                          {ref.status === 'pending' && (
                            <div className="mt-3">
                              <button
                                onClick={() => claimWishbits(ref.id)}
                                className="px-4 py-2 bg-fuchsia-500 hover:bg-fuchsia-400 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all hover:scale-105 active:scale-95 shadow-[0_0_15px_rgba(217,70,239,0.5)]"
                              >
                                Claim
                              </button>
                            </div>
                          )}
                        </div>
                      </motion.div>

                      {i < arr.length - 1 && (
                        <div className="flex items-center mt-6 shrink-0">
                          <div className={`w-8 md:w-12 h-[2px] ${
                            ref.status === 'claimed' ? 'bg-linear-to-r from-fuchsia-500/40 to-fuchsia-500/20'
                            : 'bg-white/10'
                          }`} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              className="grid grid-cols-3 gap-4"
            >
              {[
                { label: 'Friends Invited', value: referrals?.length || 0, color: 'text-white' },
                { label: 'Wishbits Earned', value: claimedTotal || 0, color: 'text-fuchsia-400' },
                { label: 'Pending', value: pendingTotal || 0, color: (pendingTotal || 0) > 0 ? 'text-orange-400' : 'text-white/20' },
              ].map((stat) => (
                <div key={stat.label} className="p-5 md:p-6 rounded-2xl bg-white/3 border border-white/8 text-center">
                  <p className={`text-2xl md:text-3xl font-black ${stat.color}`}>{stat.value}</p>
                  <p className="text-[8px] md:text-[9px] font-bold uppercase tracking-widest text-white/30 mt-1">{stat.label}</p>
                </div>
              ))}
            </motion.div>

            {/* MILESTONE REWARDS - Now inside Rewards Tab */}
            <div className="mt-12 w-full rounded-[2.5rem] bg-[#0d0d0f] border border-white/5 shadow-2xl p-8 md:p-12">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-pink-500/10 flex items-center justify-center text-pink-400">
                    <Trophy size={20} />
                  </div>
                  <h2 className="text-xl font-bold text-white tracking-tight">Referral Rewards</h2>
                </div>
                <button className="flex items-center gap-2 text-white/30 hover:text-white transition-all text-[10px] font-black uppercase tracking-widest group">
                  View all rewards
                  <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              <div className="relative pt-10 pb-8 px-4 md:px-10">
                <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-white/5 -translate-y-1/2" />
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(((referrals?.length || 0) / 50) * 100, 100)}%` }}
                  className="absolute top-1/2 left-0 h-[2px] bg-linear-to-r from-fuchsia-600 via-pink-500 to-orange-400 -translate-y-1/2 shadow-[0_0_20px_#d946ef]"
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
                      fuchsia: isReached ? 'border-fuchsia-500/60 text-fuchsia-400' : 'border-white/5 text-white/10',
                      orange: isReached ? 'border-orange-500/60 text-orange-400' : 'border-white/5 text-white/10',
                      pink: isReached ? 'border-pink-500/60 text-pink-400' : 'border-white/5 text-white/10',
                      red: isReached ? 'border-red-500/60 text-red-400' : 'border-white/5 text-white/10',
                    };
                    return (
                      <div key={idx} className="flex flex-col items-center gap-4 relative group">
                        <div className={`absolute -top-12 whitespace-nowrap text-[9px] font-black uppercase tracking-widest transition-all ${isReached ? 'text-white' : 'text-white/20'}`}>
                          {m.label}
                        </div>
                        <div className={`w-12 h-12 rounded-full border-2 bg-zinc-950 flex items-center justify-center transition-all z-10 ${
                          isReached 
                            ? `${colorClasses[m.color]} shadow-[0_0_20px_rgba(217,70,239,0.3)] scale-110` 
                            : 'border-white/5 text-white/10 group-hover:border-white/20'
                        }`}>
                          <Gift size={20} className={isReached ? 'animate-bounce' : ''} />
                        </div>
                        <div className={`absolute -bottom-10 whitespace-nowrap text-[9px] font-bold transition-all ${isReached ? 'text-pink-400' : 'text-white/10'}`}>
                          {m.reward}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 px-6 py-3 bg-zinc-950 border border-white/10 rounded-full shadow-2xl flex items-center gap-3 z-[200]"
          >
            <div className="w-6 h-6 rounded-full bg-fuchsia-500 flex items-center justify-center text-white">
              <Sparkles size={12} />
            </div>
            <span className="text-xs font-bold text-white tracking-tight">{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
