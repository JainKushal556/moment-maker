import React, { useState, useContext, useEffect, useRef } from 'react';
import { User, Settings, LogOut, Shield, Eye, EyeOff, Lock, CheckCircle2, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ViewContext } from '../../context/NavContext';
import { useAuth } from '../../context/AuthContext';
import Footer from '../../layout/Footer';
import PhotoUploadModal from './PhotoUploadModal';

export default function SettingsView() {
  const [currentView, navigateTo] = useContext(ViewContext);
  const { currentUser, logout, updateUserProfile, uploadProfilePicture, connectGoogle, disconnectGoogle, changeUserPassword } = useAuth();
  const [activeTab, setActiveTab] = useState('profile & account');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [newName, setNewName] = useState(currentUser?.displayName || '');
  const [isSaving, setIsSaving] = useState(false);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef(null);

  // Password change state
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [showPasswords, setShowPasswords] = useState({ current: false, new: false, confirm: false });
  const [pwdFeedback, setPwdFeedback] = useState({ message: '', type: '' }); // type: 'success' | 'error'
  const [connectFeedback, setConnectFeedback] = useState({ message: '', type: '' });

  const isPasswordUser = currentUser?.providerData?.some(p => p.providerId === 'password');

  const isNameChanged = newName !== (currentUser?.displayName || '');

  useEffect(() => {
    if (currentUser?.displayName) {
      setNewName(currentUser.displayName);
    }
  }, [currentUser?.displayName]);

  useEffect(() => {
    setConnectFeedback({ message: '', type: '' });
    setPwdFeedback({ message: '', type: '' });
  }, [activeTab]);

  useEffect(() => {
    if (connectFeedback.message) {
      const timer = setTimeout(() => setConnectFeedback({ message: '', type: '' }), 5000);
      return () => clearTimeout(timer);
    }
  }, [connectFeedback.message]);

  useEffect(() => {
    if (pwdFeedback.message) {
      const timer = setTimeout(() => setPwdFeedback({ message: '', type: '' }), 5000);
      return () => clearTimeout(timer);
    }
  }, [pwdFeedback.message]);

  const handleSaveName = async () => {
    if (!isNameChanged || isSaving) return;
    setIsSaving(true);
    try {
      await updateUserProfile({ displayName: newName });
    } catch (error) {
      console.error("Failed to update name:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePhotoSave = async (blob) => {
    try {
      await uploadProfilePicture(blob);
    } catch (error) {
      console.error("Photo upload failed:", error);
    }
  };

  const handleConnectGoogle = async () => {
    setConnectFeedback({ message: '', type: '' });
    try {
      setIsSaving(true);
      await connectGoogle();
      setConnectFeedback({ message: 'Google account connected successfully!', type: 'success' });
    } catch (error) {
      console.error("Failed to connect Google:", error);
      let msg = "Failed to connect Google account.";
      if (error.code === 'auth/credential-already-in-use') {
        msg = "This Google account is already linked to another profile.";
      }
      setConnectFeedback({ message: msg, type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDisconnectGoogle = async () => {
    setConnectFeedback({ message: '', type: '' });
    try {
      setIsSaving(true);
      await disconnectGoogle();
      setConnectFeedback({ message: 'Google account disconnected successfully!', type: 'success' });
    } catch (error) {
      console.error("Failed to disconnect Google:", error);
      setConnectFeedback({ message: 'Failed to disconnect Google account.', type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  const validatePassword = (pw) => {
    return {
      length: pw.length >= 6,
      letter: /[a-zA-Z]/.test(pw),
      digit: /\d/.test(pw),
      special: /[^a-zA-Z\d]/.test(pw)
    };
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPwdFeedback({ message: '', type: '' });
    
    const v = validatePassword(passwords.new);
    if (!v.length || !v.letter || !v.digit || !v.special) {
      setPwdFeedback({ message: 'Password does not meet requirements', type: 'error' });
      return;
    }
    if (passwords.new !== passwords.confirm) {
      setPwdFeedback({ message: 'Passwords do not match', type: 'error' });
      return;
    }

    try {
      setIsSaving(true);
      await changeUserPassword(passwords.current, passwords.new);
      setPwdFeedback({ message: 'Password changed successfully!', type: 'success' });
      setPasswords({ current: '', new: '', confirm: '' });
    } catch (error) {
      console.error("Password change failed:", error);
      let msg = "Failed to change password. Please check your current password.";
      if (error.code === 'auth/wrong-password') msg = "Incorrect current password.";
      setPwdFeedback({ message: msg, type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result);
        setIsPhotoModalOpen(true);
        // Reset input value so same file can be selected again
        e.target.value = '';
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (showProfileMenu) {
      const closeMenu = () => setShowProfileMenu(false);
      window.addEventListener('click', closeMenu);
      return () => window.removeEventListener('click', closeMenu);
    }
  }, [showProfileMenu]);

  const handleLogout = async () => {
    try {
      await logout();
      navigateTo('landing');
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (currentView !== 'settings') return null;

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-fuchsia-500/30 w-full relative z-50">
      {/* Background Effects */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.1] z-0"
        style={{ backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`, backgroundSize: '32px 32px' }}
      />
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-5%] left-[-5%] w-[60%] h-[40%] bg-fuchsia-600/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[10%] right-[-10%] w-[50%] h-[50%] bg-orange-600/5 blur-[120px] rounded-full" />
      </div>

      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-black/20 backdrop-blur-md border-b border-white/5 w-full h-12 flex items-center px-6 md:px-12">
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigateTo('moments')}
              className="group flex items-center gap-2 md:gap-3 text-white/40 hover:text-white transition-colors"
              aria-label="Back to my moments"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="group-hover:-translate-x-1 transition-transform">
                <polyline points="15 18 9 12 15 6" />
              </svg>
              <span className="text-[9px] md:text-[10px] font-mono uppercase tracking-[0.2em] md:tracking-[0.3em] font-bold whitespace-nowrap">BACK TO MY MOMENTS</span>
            </button>
          </div>

          <div className="flex items-center gap-2 md:gap-6">
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
                      className="fixed inset-0 z-[100] cursor-default bg-black/20 backdrop-blur-[2px]"
                    />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      className="absolute right-0 mt-3 w-44 md:w-48 bg-zinc-950/90 backdrop-blur-2xl border border-white/10 rounded-2xl p-2 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.7)] z-[110] overflow-hidden"
                    >
                      <button
                        onClick={() => setShowProfileMenu(false)}
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

      {/* Main Content */}
      <main className="w-full max-w-[1600px] mx-auto px-6 md:px-12 pt-16 md:pt-24 pb-12 md:pb-24 relative z-10">
        <header className="mb-4 md:mb-8 space-y-8 md:space-y-20">
          <div className="flex items-end justify-between gap-4 md:gap-12">
            <h1 className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-[0.85] text-white">
              Quick<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-br from-fuchsia-500 via-pink-400 to-orange-400">Settings.</span>
            </h1>

            <div className="border-l border-white/10 pl-4 md:pl-6 py-1 max-w-[150px] sm:max-w-xl mb-1 md:mb-6">
              <p className="text-white/40 text-[9px] sm:text-sm md:text-base font-medium leading-tight sm:leading-relaxed">
                Manage your preferences and secure your account.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap justify-center sm:justify-end gap-4 md:gap-8 w-full pb-2">
            {['profile & account', 'privacy & security'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-[10px] md:text-[11px] font-black uppercase tracking-[0.25em] relative pt-4 pb-1 transition-all ${activeTab === tab ? 'text-white' : 'text-white/30 hover:text-white/60'}`}
              >
                {tab}
                {activeTab === tab && (
                  <motion.div
                    layoutId="settingstab"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-fuchsia-500 shadow-[0_0_15px_#d946ef]"
                  />
                )}
              </button>
            ))}
          </div>
        </header>

        {/* Tab Content Area */}
        <div className="min-h-[60vh] flex items-start justify-center pt-8 md:pt-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-4xl"
            >
              <div className="md:px-4">

                
                {activeTab === 'profile & account' && (
                  <div className="space-y-10 mt-6">
                    <div className="space-y-4">
                      <h3 className="text-[11px] md:text-xs font-bold text-white/60 uppercase tracking-[0.2em]">Avatar</h3>
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        className="hidden" 
                        accept="image/*" 
                        onChange={handleFileChange} 
                      />
                      <div 
                        onClick={() => fileInputRef.current?.click()}
                        className="relative inline-block group cursor-pointer"
                      >
                        {currentUser?.photoURL ? (
                          <img 
                            src={currentUser.photoURL} 
                            alt="Profile" 
                            className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover border border-white/10 group-hover:border-white/30 transition-colors" 
                          />
                        ) : (
                          <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 group-hover:text-white group-hover:border-white/30 transition-all">
                            <User size={32} />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-white">Edit</span>
                        </div>
                      </div>
                    </div>

                    {/* Name Section */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between max-w-md">
                        <h3 className="text-[11px] md:text-xs font-bold text-white/60 uppercase tracking-[0.2em]">Name</h3>
                        <AnimatePresence>
                          {isNameChanged && (
                            <motion.div 
                              initial={{ opacity: 0, x: 10 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: 10 }}
                              className="flex gap-4"
                            >
                              <button 
                                onClick={handleSaveName}
                                disabled={isSaving}
                                className="text-[10px] md:text-xs font-black uppercase tracking-widest text-fuchsia-400 hover:text-fuchsia-300 disabled:opacity-50 transition-colors"
                              >
                                {isSaving ? 'Saving...' : 'Save'}
                              </button>
                              <button 
                                onClick={() => setNewName(currentUser?.displayName || '')}
                                disabled={isSaving}
                                className="text-[10px] md:text-xs font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors"
                              >
                                Cancel
                              </button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                      <input 
                        type="text" 
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        className="w-full max-w-md bg-white/5 border border-white/10 rounded-xl px-5 py-3.5 text-white md:text-lg focus:outline-none focus:border-fuchsia-500/50 focus:bg-white/10 transition-all placeholder-white/30"
                        placeholder="Enter your name"
                      />
                    </div>

                    {/* Email Section */}
                    <div className="space-y-4">
                      <h3 className="text-[11px] md:text-xs font-bold text-white/60 uppercase tracking-[0.2em]">Email</h3>
                      <div className="px-1">
                        <p className="text-white md:text-lg font-medium opacity-90">{currentUser?.email || 'Not connected'}</p>
                      </div>
                    </div>

                    <div className="h-px w-full bg-white/5 my-8" />

                    {/* Connected Accounts Section */}
                    <div className="space-y-6">
                      <div className="space-y-4">
                        <h3 className="text-[11px] md:text-xs font-bold text-white/60 uppercase tracking-[0.2em]">Connected accounts</h3>
                        <p className="text-white/40 text-xs md:text-sm">Manage the social media accounts connected to your profile for easy login.</p>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4">
                        <div className="flex items-center gap-3 sm:w-1/3">
                          <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                          </svg>
                          <span className="text-white font-bold md:text-lg">Google</span>
                        </div>
                        
                        <div className="hidden sm:flex justify-center sm:w-1/3">
                          {currentUser?.providerData?.some(p => p.providerId === 'google.com') ? (
                            <span className="text-white/60 text-[10px] md:text-xs font-bold uppercase tracking-[0.2em]">Connected</span>
                          ) : (
                            <span className="text-white/40 text-[10px] md:text-xs font-bold uppercase tracking-[0.2em]">Not connected</span>
                          )}
                        </div>
                        
                        <div className="flex items-center justify-between sm:justify-end w-full sm:w-1/3">
                          <div className="sm:hidden">
                            {currentUser?.providerData?.some(p => p.providerId === 'google.com') ? (
                              <span className="text-white/60 text-[10px] md:text-xs font-bold uppercase tracking-[0.2em]">Connected</span>
                            ) : (
                              <span className="text-white/40 text-[10px] md:text-xs font-bold uppercase tracking-[0.2em]">Not connected</span>
                            )}
                          </div>
                          
                          {currentUser?.providerData?.some(p => p.providerId === 'google.com') ? (
                            <button 
                              onClick={handleDisconnectGoogle}
                              disabled={isSaving || !isPasswordUser}
                              className={`rounded-xl px-5 py-2.5 text-[10px] md:text-xs font-black uppercase tracking-widest transition-all ${
                                isPasswordUser 
                                  ? 'bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 active:scale-95' 
                                  : 'bg-white/5 border border-white/5 opacity-50 cursor-not-allowed text-white/40'
                              }`}
                            >
                              {isSaving ? '...' : 'Disconnect'}
                            </button>
                          ) : (
                            <button 
                              onClick={handleConnectGoogle}
                              disabled={isSaving}
                              className="bg-white/5 hover:bg-white/10 border border-white/10 transition-colors rounded-xl px-5 py-2.5 text-white hover:text-white text-[10px] md:text-xs font-black uppercase tracking-widest disabled:opacity-50"
                            >
                              {isSaving ? '...' : 'Connect'}
                            </button>
                          )}
                        </div>
                      </div>

                      {currentUser?.providerData?.some(p => p.providerId === 'google.com') && (
                        <div>
                          <p className="text-white/50 text-sm md:text-[15px] leading-relaxed max-w-3xl">
                            <strong className="text-white/80 font-bold">Note:</strong> 
                            {isPasswordUser 
                              ? " Google Authentication is currently linked as a primary sign-in method. You may safely disconnect it since an alternative password is set."
                              : " To ensure uninterrupted access to your account, Google Authentication cannot be disconnected until a password is established in the Privacy & Security tab."}
                          </p>
                        </div>
                      )}

                      <AnimatePresence>
                        {connectFeedback.message && (
                          <motion.div 
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className={`flex items-center gap-4 p-5 rounded-2xl border backdrop-blur-xl max-w-2xl shadow-2xl relative overflow-hidden ${
                              connectFeedback.type === 'success' 
                                ? 'bg-emerald-500/5 border-emerald-500/20 shadow-emerald-500/5' 
                                : 'bg-red-500/5 border-red-500/20 shadow-red-500/5'
                            }`}
                          >
                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                              connectFeedback.type === 'success' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                            }`}>
                              {connectFeedback.type === 'success' ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
                            </div>
                            <div className="space-y-1">
                              <p className={`text-[10px] font-mono font-black uppercase tracking-[0.2em] ${
                                connectFeedback.type === 'success' ? 'text-emerald-400' : 'text-red-400'
                              }`}>
                                {connectFeedback.type === 'success' ? 'Success' : 'Alert'}
                              </p>
                              <p className="text-xs md:text-sm text-white/70 font-medium leading-relaxed">
                                {connectFeedback.message}
                              </p>
                            </div>

                            {/* Progress Bar */}
                            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/5 overflow-hidden">
                              <motion.div 
                                initial={{ width: '100%' }}
                                animate={{ width: 0 }}
                                transition={{ duration: 5, ease: 'linear' }}
                                className={`h-full ${connectFeedback.type === 'success' ? 'bg-emerald-500/40' : 'bg-red-500/40'}`}
                              />
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                )}

                {activeTab === 'privacy & security' && (
                  <div className="space-y-8 mt-6">
                    {!isPasswordUser ? (
                      <div className="relative py-12 md:py-20 flex flex-col items-center text-center">
                        {/* Decorative Background Elements */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-fuchsia-500/10 blur-[120px] rounded-full -z-10 pointer-events-none" />
                        
                        <motion.div 
                          initial={{ scale: 0.9, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="relative mb-12"
                        >
                          <div className="w-24 h-24 md:w-32 md:h-32 rounded-[2.5rem] bg-zinc-950 border border-white/10 flex items-center justify-center text-fuchsia-500 shadow-[0_20px_50px_rgba(217,70,239,0.15)] relative z-10 overflow-hidden">
                            <Shield size={48} className="relative z-10" />
                            {/* Inner Glow */}
                            <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-500/10 to-transparent" />
                          </div>
                          {/* Orbital Rings */}
                          <div className="absolute inset-0 rounded-[2.5rem] border border-fuchsia-500/20 animate-[ping_3s_linear_infinite] scale-125" />
                          <div className="absolute inset-0 rounded-[2.5rem] border border-fuchsia-500/10 animate-[ping_4s_linear_infinite] scale-150" />
                        </motion.div>

                        <div className="max-w-xl space-y-6">
                          <h3 className="text-3xl md:text-5xl font-black tracking-tighter text-white leading-tight">
                            Secured via <br/>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 via-pink-400 to-orange-400">Google Authentication.</span>
                          </h3>
                          <p className="text-white/40 text-sm md:text-lg font-medium leading-relaxed max-w-md mx-auto">
                            Your account is protected by industry-leading security. Password and recovery settings are managed through your Google account.
                          </p>
                          
                          <div className="pt-8">
                            <button 
                              onClick={() => window.open('https://myaccount.google.com/security', '_blank')}
                              className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold text-[10px] md:text-xs uppercase tracking-[0.3em] hover:bg-white/10 hover:border-white/20 transition-all active:scale-95 shadow-2xl"
                            >
                              <span>Manage Security</span>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="group-hover:translate-x-1 transition-transform">
                                <path d="M5 12h14M12 5l7 7-7 7" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-10">
                        <div className="space-y-4">
                          <h3 className="text-[11px] md:text-xs font-bold text-white/60 uppercase tracking-[0.2em]">Update Password</h3>
                          <p className="text-white/40 text-xs md:text-sm">Change your password to maintain account security.</p>
                        </div>

                        <form onSubmit={handlePasswordChange} className="space-y-8 max-w-2xl">
                          {/* Current Password - Full Width Row */}
                          <div className="space-y-3">
                            <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] px-1">Current Password</label>
                            <div className="relative group">
                              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/10 group-focus-within:text-fuchsia-500 transition-colors">
                                <Lock size={18} />
                              </div>
                              <input 
                                type={showPasswords.current ? "text" : "password"}
                                value={passwords.current}
                                onChange={(e) => setPasswords({...passwords, current: e.target.value})}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-12 py-4 text-white md:text-lg focus:outline-none focus:border-fuchsia-500/50 focus:bg-white/10 transition-all placeholder-white/10"
                                placeholder="Enter current password"
                                required
                              />
                              <button 
                                type="button"
                                onClick={() => setShowPasswords({...showPasswords, current: !showPasswords.current})}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors"
                              >
                                {showPasswords.current ? <EyeOff size={18} /> : <Eye size={18} />}
                              </button>
                            </div>
                          </div>

                          {/* New and Confirm - Side by Side Row */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-3">
                              <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] px-1">New Password</label>
                              <div className="relative group">
                                <input 
                                  type={showPasswords.new ? "text" : "password"}
                                  value={passwords.new}
                                  onChange={(e) => setPasswords({...passwords, new: e.target.value})}
                                  className={`w-full bg-white/5 border rounded-2xl px-5 py-4 text-white md:text-lg focus:outline-none focus:bg-white/10 transition-all placeholder-white/10 ${
                                    passwords.new && passwords.confirm && passwords.new !== passwords.confirm 
                                    ? 'border-red-500/50' 
                                    : 'border-white/10 focus:border-fuchsia-500/50'
                                  }`}
                                  placeholder="Enter new password"
                                  required
                                />
                                <button 
                                  type="button"
                                  onClick={() => setShowPasswords({...showPasswords, new: !showPasswords.new})}
                                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors"
                                >
                                  {showPasswords.new ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                              </div>
                            </div>

                            <div className="space-y-3">
                              <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] px-1">Confirm New Password</label>
                              <div className="relative group">
                                <input 
                                  type={showPasswords.confirm ? "text" : "password"}
                                  value={passwords.confirm}
                                  onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
                                  className={`w-full bg-white/5 border rounded-2xl px-5 py-4 text-white md:text-lg focus:outline-none focus:bg-white/10 transition-all placeholder-white/10 ${
                                    passwords.new && passwords.confirm && passwords.new !== passwords.confirm 
                                    ? 'border-red-500/50' 
                                    : 'border-white/10 focus:border-fuchsia-500/50'
                                  }`}
                                  placeholder="Re-enter new password"
                                  required
                                />
                                <button 
                                  type="button"
                                  onClick={() => setShowPasswords({...showPasswords, confirm: !showPasswords.confirm})}
                                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors"
                                >
                                  {showPasswords.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Dynamic Warnings Row */}
                          {passwords.new && (
                            <div className="flex flex-wrap gap-x-6 gap-y-3 min-h-[20px]">
                              {[
                                { label: '6+ Characters', valid: validatePassword(passwords.new).length },
                                { label: 'Missing Letter', valid: validatePassword(passwords.new).letter },
                                { label: 'Missing Digit', valid: validatePassword(passwords.new).digit },
                                { label: 'Special Char', valid: validatePassword(passwords.new).special },
                              ].filter(req => !req.valid).map((req, i) => (
                                <motion.div 
                                  key={i}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  className="flex items-center gap-2 text-red-400"
                                >
                                  <XCircle size={12} />
                                  <span className="text-[10px] font-black uppercase tracking-widest">{req.label}</span>
                                </motion.div>
                              ))}
                              {passwords.new && passwords.confirm && passwords.new !== passwords.confirm && (
                                <motion.div 
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  className="flex items-center gap-2 text-red-400"
                                >
                                  <XCircle size={12} />
                                  <span className="text-[10px] font-black uppercase tracking-widest">Passwords do not match</span>
                                </motion.div>
                              )}
                            </div>
                          )}

                          <div className="h-px w-full bg-white/5" />

                          <div className="flex flex-col gap-4">
                            {pwdFeedback.message && (
                              <motion.div 
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className={`flex items-center gap-4 p-5 rounded-2xl border backdrop-blur-xl relative overflow-hidden shadow-2xl ${
                                  pwdFeedback.type === 'success' 
                                    ? 'bg-emerald-500/5 border-emerald-500/20 shadow-emerald-500/5' 
                                    : 'bg-red-500/5 border-red-500/20 shadow-red-500/5'
                                }`}
                              >
                                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                                  pwdFeedback.type === 'success' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                                }`}>
                                  {pwdFeedback.type === 'success' ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
                                </div>
                                <div className="space-y-1">
                                  <p className={`text-[10px] font-mono font-black uppercase tracking-[0.2em] ${
                                    pwdFeedback.type === 'success' ? 'text-emerald-400' : 'text-red-400'
                                  }`}>
                                    {pwdFeedback.type === 'success' ? 'Success' : 'Alert'}
                                  </p>
                                  <p className="text-xs md:text-sm text-white/70 font-medium leading-relaxed">
                                    {pwdFeedback.message}
                                  </p>
                                </div>

                                {/* Progress Bar */}
                                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/5 overflow-hidden">
                                  <motion.div 
                                    initial={{ width: '100%' }}
                                    animate={{ width: 0 }}
                                    transition={{ duration: 5, ease: 'linear' }}
                                    className={`h-full ${pwdFeedback.type === 'success' ? 'bg-emerald-500/40' : 'bg-red-500/40'}`}
                                  />
                                </div>
                              </motion.div>
                            )}
                            
                            <button 
                              type="submit"
                              disabled={isSaving || !passwords.current || !passwords.new || passwords.new !== passwords.confirm || !validatePassword(passwords.new).length || !validatePassword(passwords.new).letter || !validatePassword(passwords.new).digit || !validatePassword(passwords.new).special}
                              className="w-full md:w-fit px-10 py-4 rounded-2xl bg-gradient-to-r from-fuchsia-600 to-pink-600 text-white font-black text-xs md:text-sm uppercase tracking-widest hover:from-fuchsia-500 hover:to-pink-500 transition-all active:scale-95 disabled:opacity-30 disabled:scale-100 disabled:grayscale shadow-[0_10px_30px_rgba(217,70,239,0.2)]"
                            >
                              {isSaving ? 'Processing...' : 'Change Password'}
                            </button>
                          </div>
                        </form>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
        
        <div style={{ height: '200px' }} />
      </main>

      <Footer />

      <PhotoUploadModal 
        isOpen={isPhotoModalOpen}
        image={selectedImage}
        onClose={() => {
          setIsPhotoModalOpen(false);
          setSelectedImage(null);
        }}
        onSave={handlePhotoSave}
      />
    </div>
  );
}
