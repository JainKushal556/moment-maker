import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Check, Play } from 'lucide-react';
import { intros } from '../../data/intros';

const IntroSelector = ({ selectedIntroId, onSelect, onContinue, senderName }) => {
    const [previewIntroId, setPreviewIntroId] = useState(null);

    const handleCardClick = (id) => {
        onSelect(id);
        setPreviewIntroId(id); // Automatically open preview on selection
    };

    const activePreview = intros.find(i => i.id === previewIntroId);
    const ActiveIntroComponent = activePreview?.component;

    return (
        <div className="intro-selector-wrapper">
            <div className="intro-selector-header">
                <h2 className="text-4xl font-black text-white mb-4 tracking-tighter">Choose an Intro</h2>
                <p className="text-gray-400 max-w-lg mx-auto">Select a cinematic entrance for your special moment. Click any card to preview it.</p>
            </div>

            <div className="intro-grid">
                {intros.map((intro, index) => (
                    <motion.div
                        key={intro.id}
                        className={`intro-card ${selectedIntroId === intro.id ? 'active' : ''}`}
                        onClick={() => handleCardClick(intro.id)}
                        whileHover={{ y: -8, scale: 1.02 }}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <div className="intro-thumb">
                            <img 
                                src={intro.thumbnail} 
                                alt={intro.title} 
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'flex';
                                }}
                            />
                            <div className="fallback-thumb" style={{ 
                                display: 'none',
                                background: `linear-gradient(${45 + index * 40}deg, #f472b6, #c084fc)`
                            }}>
                                <Sparkles size={32} color="white" opacity={0.5} />
                            </div>
                            
                            <div className="intro-overlay">
                                <div className="preview-indicator">
                                    <Play size={14} fill="currentColor" /> Click to Preview
                                </div>
                            </div>
                            
                            {selectedIntroId === intro.id && (
                                <div className="selected-badge">
                                    <Check size={16} strokeWidth={3} />
                                </div>
                            )}
                        </div>
                        <div className="intro-info">
                            <h3>{intro.title}</h3>
                            <p>{intro.description}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="intro-actions">
                <button 
                    className="continue-btn"
                    disabled={!selectedIntroId}
                    onClick={onContinue}
                >
                    Continue to Moment <Sparkles size={18} />
                </button>
            </div>

            {/* Live Preview Modal/Overlay */}
            <AnimatePresence>
                {previewIntroId && (
                    <motion.div 
                        className="fixed inset-0 z-[1000] bg-black flex items-center justify-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <div className="absolute top-8 right-8 z-[1100] flex items-center gap-4">
                            <span className="text-white/40 text-xs font-mono uppercase tracking-widest">Previewing: {activePreview?.title}</span>
                            <button 
                                onClick={() => setPreviewIntroId(null)}
                                className="text-white hover:text-white bg-white/10 hover:bg-pink-500 px-6 py-2 rounded-full transition-all font-bold text-sm border border-white/10 hover:border-pink-500/50"
                            >
                                ESC / Close
                            </button>
                        </div>
                        
                        <div className="w-full h-full">
                            {ActiveIntroComponent && (
                                <ActiveIntroComponent 
                                    senderName={senderName || "Someone Special"} 
                                    onFinish={() => setPreviewIntroId(null)} 
                                />
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <style jsx>{`
                .intro-selector-wrapper {
                    padding: 60px 20px;
                    max-width: 1300px;
                    margin: 0 auto;
                }
                .intro-selector-header {
                    margin-bottom: 60px;
                    text-align: center;
                }
                .intro-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
                    gap: 30px;
                    margin-bottom: 80px;
                }
                .intro-card {
                    background: rgba(255, 255, 255, 0.02);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    border-radius: 24px;
                    overflow: hidden;
                    cursor: pointer;
                    transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
                    position: relative;
                }
                .intro-card:hover {
                    border-color: rgba(255, 255, 255, 0.15);
                    background: rgba(255, 255, 255, 0.04);
                    box-shadow: 0 20px 40px rgba(0,0,0,0.4);
                }
                .intro-card.active {
                    border-color: #f472b6;
                    box-shadow: 0 0 30px rgba(244, 114, 182, 0.15);
                    background: rgba(244, 114, 182, 0.03);
                }
                .intro-thumb {
                    height: 200px;
                    position: relative;
                    overflow: hidden;
                    background: #111;
                }
                .intro-thumb img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    transition: transform 0.6s ease;
                }
                .fallback-thumb {
                    width: 100%;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .intro-card:hover .intro-thumb img {
                    transform: scale(1.05);
                }
                .intro-overlay {
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
                    display: flex;
                    align-items: flex-end;
                    justify-content: center;
                    padding-bottom: 20px;
                    opacity: 0;
                    transition: opacity 0.3s ease;
                }
                .intro-card:hover .intro-overlay {
                    opacity: 1;
                }
                .preview-indicator {
                    color: white;
                    font-size: 12px;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    background: rgba(255,255,255,0.1);
                    padding: 6px 15px;
                    border-radius: 50px;
                    backdrop-filter: blur(5px);
                }
                .selected-badge {
                    position: absolute;
                    top: 15px;
                    right: 15px;
                    background: #f472b6;
                    color: white;
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 5px 15px rgba(244, 114, 182, 0.4);
                    z-index: 10;
                }
                .intro-info {
                    padding: 24px;
                }
                .intro-info h3 {
                    color: white;
                    font-size: 20px;
                    font-weight: 700;
                    margin-bottom: 10px;
                    letter-spacing: -0.5px;
                }
                .intro-info p {
                    color: rgba(255, 255, 255, 0.4);
                    font-size: 14px;
                    line-height: 1.6;
                }
                .intro-actions {
                    display: flex;
                    justify-content: center;
                }
                .continue-btn {
                    background: linear-gradient(135deg, #f472b6 0%, #c084fc 100%);
                    color: white;
                    padding: 18px 50px;
                    border-radius: 50px;
                    font-size: 18px;
                    font-weight: 800;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    border: none;
                    cursor: pointer;
                    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    box-shadow: 0 10px 30px rgba(244, 114, 182, 0.3);
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }
                .continue-btn:hover:not(:disabled) {
                    transform: translateY(-3px) scale(1.02);
                    box-shadow: 0 20px 40px rgba(244, 114, 182, 0.4);
                }
                .continue-btn:disabled {
                    opacity: 0.2;
                    cursor: not-allowed;
                    filter: grayscale(1);
                }
            `}</style>
        </div>
    );
};

export default IntroSelector;
