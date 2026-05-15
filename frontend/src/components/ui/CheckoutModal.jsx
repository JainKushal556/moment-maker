import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, ShoppingBag, ShieldCheck, Lock, Sparkles } from 'lucide-react';
import WishbitIcon from '../icons/WishbitIcon';

export default function CheckoutModal({ 
  isOpen, 
  onClose, 
  template, 
  userBalance, 
  onConfirm, 
  onBuyWishbits,
  isProcessing = false 
}) {
  const [agreed, setAgreed] = useState(false);

  // Reset agreement state whenever modal opens
  React.useEffect(() => {
    if (isOpen) {
      setAgreed(false);
    }
  }, [isOpen]);
  
  if (!isOpen || !template) return null;

  const canAfford = userBalance >= (template.price || 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Solid Card Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative w-full max-w-[400px] bg-[#0A0A0A] border border-white/[0.08] rounded-2xl overflow-hidden shadow-[0_40px_80px_-20px_rgba(0,0,0,1)]"
          >
            {/* Header */}
            <div className="p-5 flex items-center justify-between border-b border-white/[0.05]">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl border border-fuchsia-500/40 bg-fuchsia-500/5 flex items-center justify-center text-fuchsia-500">
                  <ShoppingBag size={20} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white leading-tight">Confirm Unlock</h3>
                  <p className="text-[10px] font-medium text-white/40">Complete your template purchase</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="w-9 h-9 rounded-lg bg-white/[0.05] border border-white/[0.05] flex items-center justify-center text-white/40 hover:text-white transition-all"
              >
                <X size={18} />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-6 space-y-6">
              {/* Template Info */}
              <div className="flex items-center justify-between">
                <div className="space-y-1 text-left">
                  <p className="text-[9px] font-bold text-white/30 uppercase tracking-[0.2em]">Selected Template</p>
                  <h2 className="text-xl font-black text-white tracking-tight capitalize leading-tight">{template.title}</h2>
                </div>
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-fuchsia-500/10 border border-fuchsia-500/20 text-fuchsia-400">
                  <Sparkles size={12} className="fill-fuchsia-400/20" />
                  <span className="text-[9px] font-black uppercase tracking-widest">{template.category}</span>
                </div>
              </div>

              {/* Cost & Balance Cards */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] flex flex-col items-center gap-2">
                  <p className="text-[9px] font-bold text-white/30 uppercase tracking-[0.2em]">Cost</p>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-black text-fuchsia-500">{template.price}</span>
                    <WishbitIcon size={28} />
                  </div>
                </div>
                <div className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                  canAfford ? 'bg-white/[0.02] border-white/[0.05]' : 'bg-red-500/5 border-red-500/20'
                }`}>
                  <p className="text-[9px] font-bold text-white/30 uppercase tracking-[0.2em]">Your Balance</p>
                  <div className="flex items-center gap-2">
                    <span className={`text-2xl font-black ${canAfford ? 'text-white' : 'text-red-500'}`}>
                      {userBalance}
                    </span>
                    <WishbitIcon size={28} className={canAfford ? "opacity-100" : "opacity-40 grayscale"} />
                  </div>
                </div>
              </div>

              {/* Confirmation Checkbox Box (Only show if can afford) */}
              {canAfford ? (
                <label className="flex items-center gap-4 p-4 rounded-xl border border-white/[0.05] bg-white/[0.01] hover:border-white/[0.1] transition-all cursor-pointer group">
                  <div className="relative">
                    <input 
                      type="checkbox" 
                      className="sr-only" 
                      checked={agreed}
                      onChange={(e) => setAgreed(e.target.checked)}
                    />
                    <div className={`w-7 h-7 rounded-lg border-2 flex items-center justify-center transition-all ${
                      agreed ? 'bg-fuchsia-600 border-fuchsia-600' : 'bg-transparent border-white/10 group-hover:border-white/20'
                    }`}>
                      {agreed && <Check size={16} className="text-white" strokeWidth={3} />}
                    </div>
                  </div>
                  <div className="space-y-0.5 text-left">
                    <p className="text-xs font-bold text-white">I confirm this purchase</p>
                    <p className="text-[9px] font-medium text-white/30">Wishbits will be deducted immediately</p>
                  </div>
                </label>
              ) : (
                <div className="p-4 rounded-xl border border-red-500/10 bg-red-500/5 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 shrink-0">
                    <ShieldCheck size={16} />
                  </div>
                  <div className="text-left">
                    <p className="text-[11px] font-bold text-red-400">Insufficient Balance</p>
                    <p className="text-[10px] font-medium text-red-400/50 leading-relaxed">You need {template.price - userBalance} more wishbits to unlock this template.</p>
                  </div>
                </div>
              )}

              {/* Secure Transaction Info (Only show if can afford) */}
              {canAfford && (
                <div className="flex items-center gap-3 px-1 py-0.5">
                  <div className="w-9 h-9 rounded-full bg-white/[0.03] border border-white/[0.05] flex items-center justify-center text-white/20">
                    <ShieldCheck size={18} />
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] font-bold text-white/60">Secure Transaction</p>
                    <p className="text-[9px] font-medium text-white/20">Your purchase is safe and secure.</p>
                  </div>
                </div>
              )}

              {/* Footer Actions */}
              <div className="flex gap-3 pt-1">
                <button 
                  onClick={onClose}
                  className="flex-1 px-4 py-3.5 rounded-xl bg-transparent border border-white/[0.08] text-white/80 text-[10px] font-bold uppercase tracking-widest hover:bg-white/[0.05] transition-all active:scale-95"
                >
                  Cancel
                </button>
                {canAfford ? (
                  <button 
                    disabled={!agreed || isProcessing}
                    onClick={onConfirm}
                    className={`flex-1 px-4 py-3.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-xl ${
                      agreed && !isProcessing
                      ? 'bg-fuchsia-700 text-white hover:bg-fuchsia-600 active:scale-95 shadow-fuchsia-900/20'
                      : 'bg-white/[0.05] text-white/20 cursor-not-allowed border border-white/[0.05]'
                    }`}
                  >
                    {isProcessing ? (
                      <div className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <Lock size={12} className="mb-0.5" />
                        <span>Unlock Now</span>
                      </>
                    )}
                  </button>
                ) : (
                  <button 
                    onClick={onBuyWishbits}
                    className="flex-1 px-4 py-3.5 rounded-xl bg-linear-to-r from-orange-500 to-fuchsia-600 text-white text-[10px] font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-lg"
                  >
                    Buy Wishbits
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
