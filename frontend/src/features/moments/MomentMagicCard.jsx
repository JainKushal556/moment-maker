import React from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ArrowUpRight, Trash2, Sparkles, Heart } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';


const MomentMagicCard = ({ moment, onAction, isTemplate = false }) => {
  const { favorites, handleToggleFavorite } = useAuth()
  const isFavorite = isTemplate && favorites?.includes(moment.id)
  
  const imageUrl = moment.image || moment.img || 'https://images.unsplash.com/photo-1530103043960-ef38714abb15?q=80&w=1000&auto=format&fit=crop';

  
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
      <div className="absolute inset-[-1.5px] rounded-[2.5rem] bg-linear-to-r from-fuchsia-500/20 via-transparent to-orange-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-[1px]" />
      
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
                {moment.isPremium && (
                    <span className="text-[8px] font-black tracking-widest px-2 py-1 rounded bg-fuchsia-500 text-white w-fit uppercase">
                        Premium
                    </span>
                )}
            </div>
            
            {isTemplate && (
              <button
                onClick={(e) => { e.stopPropagation(); handleToggleFavorite(moment.id); }}
                className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center hover:bg-black/60 transition-colors z-50"
              >
                <Heart size={14} className={isFavorite ? "fill-fuchsia-500 text-fuchsia-500" : "text-white/60"} />
              </button>
            )}
          </div>
        </div>

        <div 
          className="relative z-10 flex flex-col flex-1 justify-center bg-zinc-950 border-t border-white/5"
          style={{ paddingLeft: '24px', paddingRight: '24px', paddingTop: '12px', paddingBottom: '12px' }}
        >
          <div className="flex items-center justify-between gap-8">
            <div className="space-y-2 overflow-hidden flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className={`text-xl md:text-2xl font-black tracking-tight text-white group-hover:text-fuchsia-400 transition-colors duration-300 truncate`}>
                    {moment.title}
                </h3>
                <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded border ${
                    moment.status === 'draft' 
                    ? 'bg-orange-500/10 border-orange-500/20 text-orange-400' 
                    : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                } uppercase tracking-tighter`}>
                    {moment.status}
                </span>
              </div>
              <div className="flex items-center gap-3 opacity-80 truncate">
                {!isTemplate && validity && (
                  <>
                    <span className={`text-[10px] font-mono uppercase tracking-widest truncate ${validity.isExpired ? 'text-red-400' : 'text-fuchsia-400'}`}>
                      {validity.timeText}
                    </span>
                    {moment.status === 'shared' && (
                        <>
                            <span className="w-1 h-1 rounded-full bg-white/20"></span>
                            <span className="text-[10px] font-mono text-white/60 uppercase tracking-widest truncate">
                                {validity.sessionsCount}/4 Views
                            </span>
                        </>
                    )}
                    <span className="w-1 h-1 rounded-full bg-white/20"></span>
                  </>
                )}
                <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest truncate">
                    {moment.category || 'Moment Crafter Original'}
                </span>
              </div>
            </div>
            
          </div>

          <div className="absolute inset-0 bg-zinc-950/90 backdrop-blur-md flex items-center justify-center gap-6 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0 z-40">
             {validity?.isExpired ? (
                 <>
                   <button 
                      onClick={(e) => { e.stopPropagation(); if (onAction) onAction('reactivate', moment.id); }}
                      className="rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] bg-fuchsia-600 text-white hover:bg-fuchsia-500 shadow-2xl transition-all active:scale-95 cursor-pointer flex items-center gap-2 whitespace-nowrap"
                      style={{ padding: '14px 32px' }}
                   >
                     Reactivate <Sparkles size={16} strokeWidth={3} />
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
                     <button 
                        onClick={(e) => { e.stopPropagation(); if (onAction) onAction(isTemplate ? 'build' : 'enter', moment.id); }}
                        className="rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] bg-white text-black hover:bg-fuchsia-600 hover:text-white shadow-2xl transition-all active:scale-95 cursor-pointer flex items-center gap-2 whitespace-nowrap"
                        style={{ padding: '14px 32px' }}
                     >
                       {isTemplate ? 'Build This' : moment.status === 'draft' ? 'Resume' : 'Edit'} <ArrowUpRight size={16} strokeWidth={3} />
                     </button>
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
      </div>
    </motion.div>
  );
};

export default MomentMagicCard;
