import React from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ArrowUpRight, Trash2, Sparkles, Heart, Share2, Pencil, RotateCw } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import WishbitIcon from '../../components/icons/WishbitIcon';


const MomentMagicCard = ({ moment, onAction, isTemplate = false, isUnlocked = true, price = 100, onUnlock }) => {
  const { favorites, handleToggleFavorite } = useAuth()
  const isFavorite = isTemplate && favorites?.includes(moment.id)

  const imageUrl = moment.image || moment.img || (moment.category ? `/cards/${moment.category}.png` : '/cards/special.png');


  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["4deg", "-4deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-4deg", "4deg"]);

  const getValidityDetails = () => {
    if (isTemplate) return null;

    const baseTimeStr = moment.updatedAt || moment.savedAt;
    if (!baseTimeStr) return null;

    const baseTime = new Date(baseTimeStr);
    const now = new Date();
    const diffMs = now.getTime() - baseTime.getTime();
    const diffMinutes = diffMs / (1000 * 60);
    const minutesLeft = 5 - diffMinutes;

    const sessionsCount = moment.viewerSessions?.length || 0;

    const isTimeExpired = minutesLeft <= 0;
    const isSessionExpired = moment.status === 'shared' && sessionsCount >= 4;
    const isExpired = isTimeExpired || isSessionExpired;

    let timeText = '';
    if (isTimeExpired) {
      timeText = 'Expired';
    } else {
      const secondsLeft = Math.floor(minutesLeft * 60);
      if (secondsLeft > 60) {
        timeText = `${Math.floor(minutesLeft)}m left`;
      } else {
        timeText = `${secondsLeft}s left`;
      }
    }

    return { isExpired, timeText, sessionsCount };
  };

  const validity = getValidityDetails();

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const touchStartPos = React.useRef({ x: 0, y: 0 });
  const lastActionTime = React.useRef(0);

  const handleTouchStart = (e) => {
    touchStartPos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  const handleTouchEnd = (e) => {
    if (e.target.closest('button')) return; 
    
    const now = Date.now();
    if (now - lastActionTime.current < 500) return; // Prevent double trigger
    
    const touchEndPos = { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY };
    const distance = Math.hypot(touchEndPos.x - touchStartPos.current.x, touchEndPos.y - touchStartPos.current.y);
    
    if (distance < 10) {
      lastActionTime.current = now;
      const rect = e.currentTarget.getBoundingClientRect();
      if (onAction) onAction('click', moment.id, rect);
    }
  };

  const handleCardClick = (e) => {
    const now = Date.now();
    if (now - lastActionTime.current < 500) return; // Prevent double trigger (ghost click)
    lastActionTime.current = now;

    const rect = e.currentTarget.getBoundingClientRect();
    if (onAction) onAction('click', moment.id, rect);
  };

  return (
    <motion.div
      layout
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      onClick={handleCardClick}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="relative group w-full lg:max-w-[420px] aspect-16/11 perspective-1000 mx-auto cursor-pointer"
    >
      <div className="absolute inset-0 rounded-[2.5rem] bg-linear-to-r from-fuchsia-500/20 via-transparent to-orange-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

      <div className="relative h-full w-full overflow-hidden rounded-[2.5rem] bg-black border border-white/10 shadow-2xl flex flex-col" style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', transform: 'translateZ(0)' }}>
        <div className="relative h-full w-full overflow-hidden rounded-[2.5rem] bg-black" style={{ isolation: 'isolate' }}>
          <img
            src={imageUrl}
            alt={moment.title}
            className="w-full h-full object-cover transition-transform duration-2000 group-hover:scale-110 scale-[1.02] transform-gpu"
            style={{ transform: 'translateZ(0)' }}
            onError={(e) => {
              e.target.src = moment.category ? `/cards/${moment.category}.png` : "/cards/special.png"
            }}
          />
          <div className="absolute inset-x-[-2px] bottom-[-2px] top-1/3 bg-gradient-to-t from-black via-black/90 to-transparent z-10" style={{ transform: 'translateZ(0)' }} />

          {/* Buttons moved from here */}

          {/* Mobile View: Floating Action Buttons */}
          {!isTemplate && (
            <>
              {/* TOP LEFT: Reactivate or Edit */}
              {/* TOP LEFT: Reactivate or Edit */}
              <div className="md:hidden absolute z-50" style={{ top: '24px', left: '24px' }}>
                {validity?.isExpired ? (
                  <button
                    onClick={(e) => { e.stopPropagation(); if (onAction) onAction('reactivate', moment.id); }}
                    className="w-11 h-11 rounded-full bg-black/40 backdrop-blur-md text-white border border-white/40 flex items-center justify-center active:scale-95 cursor-pointer shadow-lg"
                  >
                    <RotateCw size={20} strokeWidth={2.5} />
                  </button>
                ) : (
                  <button
                    onClick={(e) => { e.stopPropagation(); if (onAction) onAction('enter', moment.id); }}
                    className="w-11 h-11 rounded-full bg-black/40 backdrop-blur-md text-white border border-white/40 flex items-center justify-center active:scale-95 cursor-pointer shadow-lg"
                  >
                    <Pencil size={20} strokeWidth={2.5} />
                  </button>
                )}
              </div>

              {/* TOP RIGHT: Share */}
              {!validity?.isExpired && moment.status === 'shared' && (
                <div className="md:hidden absolute z-50" style={{ top: '24px', right: '24px' }}>
                  <button
                    onClick={(e) => { e.stopPropagation(); if (onAction) onAction('share', moment.id); }}
                    className="w-11 h-11 rounded-full bg-black/40 backdrop-blur-md text-white border border-white/40 flex items-center justify-center active:scale-95 cursor-pointer shadow-lg"
                  >
                    <Share2 size={20} />
                  </button>
                </div>
              )}

              {/* BOTTOM RIGHT: Delete */}
              <div className="md:hidden absolute z-50" style={{ bottom: '24px', right: '24px' }}>
                <button
                  onClick={(e) => { e.stopPropagation(); if (onAction) onAction('delete', moment.id); }}
                  className="w-11 h-11 rounded-full bg-black/40 backdrop-blur-md text-white/80 border border-white/40 flex items-center justify-center active:scale-95 cursor-pointer shadow-lg"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </>
          )}
        </div>

        <div
          className="absolute bottom-0 left-0 right-0 z-20 flex flex-col justify-center bg-transparent border-t-0"
          style={{ paddingLeft: '24px', paddingRight: '24px', paddingTop: '20px', paddingBottom: '24px' }}
        >
          <div className="flex items-center justify-between gap-8">
            <div className="space-y-2 overflow-hidden flex-1 min-w-0 group-hover:opacity-0 transition-opacity duration-300">
              <div className="flex items-center gap-2">
                <h3 className={`text-xl md:text-2xl font-black tracking-tight text-white group-hover:text-fuchsia-400 transition-colors duration-300 block truncate whitespace-nowrap`}>
                  {moment.title}
                </h3>
                {!isTemplate && moment.status && (
                  <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded border ${moment.status === 'draft'
                      ? 'bg-orange-500/10 border-orange-500/20 text-orange-400'
                      : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                    } uppercase tracking-tighter`}>
                    {moment.status}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3 opacity-80 antialiased">
                {!isTemplate && validity && (
                  <>
                    <span className={`text-[10px] font-mono uppercase tracking-widest inline-block truncate whitespace-nowrap ${validity.isExpired ? 'text-red-400' : 'text-fuchsia-400'}`}>
                      {validity.timeText}
                    </span>
                    {moment.status === 'shared' && (
                      <>
                        <span className="w-1 h-1 rounded-full bg-white/20"></span>
                        <span className="text-[10px] font-mono text-white/60 uppercase tracking-widest inline-block truncate whitespace-nowrap">
                          {validity.sessionsCount}/4 Views
                        </span>
                      </>
                    )}
                    <span className="w-1 h-1 rounded-full bg-white/20"></span>
                  </>
                )}
                <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest inline-block truncate whitespace-nowrap">
                  {moment.category?.replace(/-/g, ' ') || 'Moment Crafter Original'}
                </span>
              </div>
            </div>

          </div>

          <div className="absolute inset-0 bg-transparent flex items-center justify-center gap-6 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0 z-40">
            {validity?.isExpired ? (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); if (onAction) onAction('reactivate', moment.id); }}
                  className="rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] bg-white text-black hover:bg-fuchsia-600 hover:text-white shadow-2xl transition-all active:scale-95 cursor-pointer flex items-center gap-2 whitespace-nowrap"
                  style={{ padding: '14px 32px' }}
                >
                  Reactivate <RotateCw size={16} strokeWidth={3} />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); if (onAction) onAction('delete', moment.id); }}
                  className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-white/20 hover:text-red-400 hover:bg-red-400/10 transition-all cursor-pointer"
                >
                  <Trash2 size={20} />
                </button>
              </>
            ) : (
              <>
                {isTemplate && !isUnlocked ? (
                  <button
                    onClick={(e) => { 
                      e.stopPropagation(); 
                      if (onUnlock) onUnlock(moment.id); 
                    }}
                    className="rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] bg-fuchsia-500 text-white hover:bg-fuchsia-600 shadow-[0_0_30px_rgba(217,70,239,0.4)] transition-all active:scale-95 cursor-pointer flex items-center gap-1.5 whitespace-nowrap"
                    style={{ height: '52px', padding: '0 28px' }}
                  >
                    {price === 0 ? 'Claim for 0' : `Unlock for ${price}`} 
                    <WishbitIcon size={32} className="drop-shadow-none -ml-1" />
                  </button>
                ) : (
                  <button
                    onClick={(e) => { 
                      e.stopPropagation(); 
                      const rect = e.currentTarget.closest('.perspective-1000')?.getBoundingClientRect();
                      if (onAction) onAction(isTemplate ? 'build' : 'enter', moment.id, rect); 
                    }}
                    className="rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] bg-white text-black hover:bg-fuchsia-600 hover:text-white shadow-2xl transition-all active:scale-95 cursor-pointer flex items-center gap-2 whitespace-nowrap"
                    style={{ padding: '14px 32px' }}
                  >
                    {isTemplate ? 'Build This' : moment.status === 'draft' ? 'Resume' : 'Edit'} <Pencil size={16} strokeWidth={3} />
                  </button>
                )}
                
                {!isTemplate && moment.status === 'shared' && (
                  <button
                    onClick={(e) => { e.stopPropagation(); if (onAction) onAction('share', moment.id); }}
                    className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-white/60 hover:text-fuchsia-400 hover:bg-fuchsia-400/10 transition-all cursor-pointer"
                  >
                    <Share2 size={20} />
                  </button>
                )}
                {!isTemplate && (
                  <button
                    onClick={(e) => { e.stopPropagation(); if (onAction) onAction('delete', moment.id); }}
                    className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-white/20 hover:text-red-400 hover:bg-red-400/10 transition-all cursor-pointer"
                  >
                    <Trash2 size={20} />
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        {isTemplate && !isUnlocked && (
          <div className="absolute inset-0 z-30 bg-black/40 backdrop-blur-[2px] flex items-center justify-center pointer-events-auto md:pointer-events-none md:group-hover:opacity-0 transition-opacity duration-300">
             <div className="flex flex-col items-center gap-5">
                <div className="w-16 h-16 rounded-full bg-black/60 border border-white/10 flex items-center justify-center text-white/60 shadow-2xl">
                   <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                   </svg>
                </div>
                
                {/* Mobile Unlock Button */}
                <button
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    if (onUnlock) onUnlock(moment.id); 
                  }}
                  className="md:hidden rounded-xl text-[9px] font-black uppercase tracking-[0.2em] bg-fuchsia-500 text-white shadow-[0_0_20px_rgba(217,70,239,0.3)] transition-all active:scale-95 cursor-pointer flex items-center gap-1.5 whitespace-nowrap"
                  style={{ height: '38px', padding: '0 16px' }}
                >
                  {price === 0 ? 'Claim for 0' : `Unlock for ${price}`} 
                  <WishbitIcon size={20} className="drop-shadow-none" />
                </button>
             </div>
          </div>
        )}

        {/* Floating Buttons (Top) - Moved here to be above Lock Overlay */}
        <div
          className="absolute flex justify-between items-start z-[60]"
          style={{ top: '20px', left: '24px', right: '24px' }}
        >
          <div className="flex flex-col gap-2">
            {moment.isPremium && (
              <span className="text-[8px] font-black tracking-widest px-2 py-1 rounded bg-fuchsia-500 text-white w-fit uppercase">
                Premium
              </span>
            )}
            {isTemplate && moment.averageRating > 0 && (
              <span className="text-[10px] font-bold px-2 py-1 rounded bg-black/60 backdrop-blur-md text-white border border-white/10 w-fit flex items-center gap-1 shadow-lg">
                ⭐ {moment.averageRating.toFixed(1)}
              </span>
            )}
          </div>

          {isTemplate && (
            <button
              onClick={(e) => { e.stopPropagation(); handleToggleFavorite(moment.id); }}
              className="w-8 h-8 rounded-full bg-black/30 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-black/50 transition-all z-50 shadow-md"
            >
              <Heart size={14} className={isFavorite ? "fill-fuchsia-500 text-fuchsia-500" : "text-white/80"} />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default MomentMagicCard;
