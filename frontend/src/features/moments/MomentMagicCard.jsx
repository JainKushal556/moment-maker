import React, { useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Heart, Clock, ArrowUpRight, Trash2, ZapOff, Sparkles } from 'lucide-react';

// ১. এক্সপায়ারি টাইমার কম্পোনেন্ট
const ExpiryComplication = ({ expiresAt }) => {
  if (!expiresAt) return null;
  
  const timeLeft = expiresAt - Date.now();
  const isExpired = timeLeft <= 0;
  
  if (isExpired) return (
    <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-red-500/10 border border-red-500/20 text-red-400">
      <ZapOff size={12} />
      <span className="text-[10px] font-black uppercase italic tracking-tighter">Sesh</span>
    </div>
  );

  const hoursLeft = Math.floor(timeLeft / (1000 * 60 * 60));
  
  return (
    <div 
      className="flex items-center gap-2 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
      style={{ padding: '6px 12px' }}
    >
      <Clock size={12} className="animate-pulse" />
      <span className="text-[11px] font-black uppercase tracking-tighter">{hoursLeft}H Baki</span>
    </div>
  );
};

const VIBES = {
  CINEMATIC: { label: 'PURPLE / NOIR', color: '#d946ef', text: 'text-fuchsia-400' },
  BOLD: { label: 'ORANGE / VIVID', color: '#f97316', text: 'text-orange-400' },
  MINIMAL: { label: 'GREEN / PURE', color: '#10b981', text: 'text-emerald-400' },
};

const MomentMagicCard = ({ moment, onAction, isTemplate = false }) => {
  // Use moment.isFavorite if available, otherwise fallback to local state for demo/templates
  const [localFavorite, setLocalFavorite] = useState(moment.isFavorite || false);
  const isFavorite = moment.isFavorite !== undefined ? moment.isFavorite : localFavorite;

  const vibeInfo = VIBES[moment.vibe] || { label: 'STANDARD', text: 'text-white/40' };
  const imageUrl = moment.image || moment.img || 'https://images.unsplash.com/photo-1530103043960-ef38714abb15?q=80&w=1000&auto=format&fit=crop';

  // ৩ডি টিল্ট ইফেক্ট লজিক
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["4deg", "-4deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-4deg", "4deg"]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setLocalFavorite(!localFavorite);
    if (onAction) onAction('toggleFavorite', moment.id);
  };

  const handleCardClick = () => {
    if (onAction) onAction('click', moment.id);
  };

  return (
    <motion.div
      layout
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      onClick={handleCardClick}
      className="relative group w-full aspect-16/11 perspective-1000 mx-auto cursor-pointer"
    >
      <div className="absolute -inset-[1.5px] rounded-[2.5rem] bg-linear-to-r from-fuchsia-500/20 via-transparent to-orange-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-[1px]" />
      
      <div className="relative h-full w-full overflow-hidden rounded-[2.5rem] bg-zinc-950 border border-white/10 shadow-2xl flex flex-col">
        <div className="relative h-[72%] w-full overflow-hidden">
          <img 
            src={imageUrl} 
            alt={moment.title} 
            className="w-full h-full object-cover transition-transform duration-2000 group-hover:scale-105"
            onError={(e) => {
                e.target.src = "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80"
            }}
          />
          <div className="absolute inset-0 bg-linear-to-t from-zinc-950 via-zinc-950/20 to-transparent opacity-80" />
          
          <div 
            className="absolute flex justify-between items-start z-50"
            style={{ top: '20px', left: '24px', right: '24px' }}
          >
            <div className="flex flex-col gap-2">
                <span className={`text-[9px] font-black tracking-[0.4em] px-3 py-1.5 rounded-md bg-black/60 backdrop-blur-md border border-white/5 ${vibeInfo.text} uppercase`}>
                {vibeInfo.label}
                </span>
                {moment.isPremium && (
                    <span className="text-[8px] font-black tracking-widest px-2 py-1 rounded bg-fuchsia-500 text-white w-fit uppercase">
                        Premium
                    </span>
                )}
            </div>
            
            <motion.button 
              whileTap={{ scale: 0.7 }}
              whileHover={{ scale: 1.15 }}
              onClick={handleFavoriteClick}
              style={{ transform: "translateZ(35px)" }}
              className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all border backdrop-blur-xl cursor-pointer shadow-2xl ${
                isFavorite 
                ? 'bg-fuchsia-500 text-white border-fuchsia-400 shadow-[0_0_20px_rgba(217,70,239,0.5)]' 
                : 'bg-black/40 text-white/40 border-white/10 hover:border-white/30 hover:bg-black/60'
              }`}
            >
              <Heart 
                size={20} 
                fill={isFavorite ? "currentColor" : "none"} 
                className={isFavorite ? "animate-pulse" : ""} 
              />
            </motion.button>
          </div>
        </div>

        <div 
          className="relative z-10 flex flex-col flex-1 justify-center bg-zinc-950 border-t border-white/5"
          style={{ paddingLeft: '24px', paddingRight: '24px', paddingTop: '12px', paddingBottom: '12px' }}
        >
          <div className="flex items-center justify-between gap-8">
            <div className="space-y-2 overflow-hidden flex-1 min-w-0">
              <h3 className={`text-xl md:text-2xl font-black tracking-tight text-white group-hover:text-fuchsia-400 transition-colors duration-300 truncate`}>
                {moment.title}
              </h3>
              <div className="flex items-center gap-3 opacity-30 truncate">
                <span className="text-[10px] font-mono text-white uppercase tracking-widest truncate">
                    {moment.type || moment.category || 'Moment Maker Original'}
                </span>
              </div>
            </div>
            
            <div className="shrink-0">
              {isTemplate ? (
                  <div 
                    className="flex items-center gap-1.5 rounded-md bg-white/5 border border-white/10 text-white/40"
                    style={{ padding: '6px 12px' }}
                  >
                    <Sparkles size={12} />
                    <span className="text-[10px] font-black uppercase">Template</span>
                  </div>
              ) : (
                <ExpiryComplication expiresAt={moment.expiresAt} />
              )}
            </div>
          </div>

          <div className="absolute inset-0 bg-zinc-950/90 backdrop-blur-md flex items-center justify-center gap-6 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0 z-40">
             <button 
                onClick={(e) => { e.stopPropagation(); if (onAction) onAction(isTemplate ? 'build' : 'enter', moment.id); }}
                className="rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] bg-white text-black hover:bg-fuchsia-600 hover:text-white shadow-2xl transition-all active:scale-95 cursor-pointer flex items-center gap-2 whitespace-nowrap"
                style={{ padding: '14px 32px' }}
             >
               {isTemplate ? 'Build This' : 'Enter Experience'} <ArrowUpRight size={16} strokeWidth={3} />
             </button>
             {!isTemplate && (
                <button 
                onClick={(e) => { e.stopPropagation(); if (onAction) onAction('delete', moment.id); }}
                className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-white/20 hover:text-red-400 hover:bg-red-400/10 transition-all cursor-pointer"
                >
                    <Trash2 size={20} />
                </button>
             )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MomentMagicCard;
