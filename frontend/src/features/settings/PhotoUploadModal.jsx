import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload } from 'lucide-react';

export default function PhotoUploadModal({ isOpen, onClose, onSave, image }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleSave = async () => {
    if (!image || !croppedAreaPixels) return;
    try {
      setIsUploading(true);
      const croppedImageBlob = await getCroppedImg(image, croppedAreaPixels);
      await onSave(croppedImageBlob);
      onClose();
    } catch (e) {
      console.error("Cropping/Upload error:", e);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
        >
          <motion.div 
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="bg-[#0D0D0D]/90 border border-white/10 rounded-[2rem] md:rounded-[2.5rem] w-full max-w-[440px] overflow-hidden flex flex-col shadow-2xl backdrop-blur-xl"
          >
            {/* Header */}
            <div className="px-6 md:px-8 py-5 md:py-6 border-b border-white/5 flex items-center justify-between">
              <h2 className="text-lg md:text-xl font-black text-white tracking-tighter">Change Photo</h2>
              <button onClick={onClose} className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all group">
                <X size={16} className="group-hover:rotate-90 transition-transform duration-300" />
              </button>
            </div>

            {/* Content Area */}
            <div className="relative h-[340px] md:h-[380px] bg-black flex items-center justify-center">
              <style>{`
                .custom-crop-area {
                  border: 2px dotted rgba(255, 255, 255, 0.5) !important;
                  box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.6) !important;
                }
                .custom-crop-area::before {
                  content: '';
                  position: absolute;
                  top: -4px;
                  left: -4px;
                  right: -4px;
                  bottom: -4px;
                  border: 3px solid white;
                  -webkit-mask-image: 
                    linear-gradient(to right, white 15px, transparent 15px),
                    linear-gradient(to left, white 15px, transparent 15px),
                    linear-gradient(to bottom, white 15px, transparent 15px),
                    linear-gradient(to top, white 15px, transparent 15px);
                  mask-image: 
                    linear-gradient(to right, white 15px, transparent 15px),
                    linear-gradient(to left, white 15px, transparent 15px),
                    linear-gradient(to bottom, white 15px, transparent 15px),
                    linear-gradient(to top, white 15px, transparent 15px);
                  -webkit-mask-repeat: no-repeat;
                  mask-repeat: no-repeat;
                  -webkit-mask-position: left top, right top, left bottom, right bottom;
                  mask-position: left top, right top, left bottom, right bottom;
                  -webkit-mask-size: 15px 15px;
                  mask-size: 15px 15px;
                  pointer-events: none;
                }
              `}</style>
              {image && (
                <Cropper
                  image={image}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  cropShape="round"
                  showGrid={false}
                  onCropChange={setCrop}
                  onCropComplete={onCropComplete}
                  onZoomChange={setZoom}
                  classes={{
                    cropAreaClassName: 'custom-crop-area'
                  }}
                />
              )}
            </div>

            {/* Controls & Footer */}
            <div className="p-6 md:p-8 space-y-6 md:space-y-8">
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <span className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] text-white/40">Zoom Level</span>
                  <span className="text-[10px] md:text-xs font-bold text-fuchsia-400">{(zoom * 100).toFixed(0)}%</span>
                </div>
                <div className="relative flex items-center group">
                  <input 
                    type="range" 
                    min={1} 
                    max={3} 
                    step={0.01} 
                    value={zoom} 
                    onChange={(e) => setZoom(parseFloat(e.target.value))}
                    className="w-full h-1 bg-white/5 rounded-full appearance-none cursor-pointer accent-fuchsia-500 group-hover:bg-white/10 transition-colors"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 md:gap-4">
                <button 
                  onClick={onClose}
                  className="flex-1 sm:flex-none px-5 md:px-7 py-3 md:py-3.5 rounded-xl md:rounded-2xl border border-white/10 text-white/60 font-bold text-xs md:text-sm hover:bg-white/5 hover:text-white transition-all active:scale-95"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSave}
                  disabled={!image || isUploading}
                  className="flex-[2] sm:flex-none px-6 md:px-10 py-3 md:py-3.5 rounded-xl md:rounded-2xl bg-gradient-to-r from-fuchsia-600 to-pink-600 text-white font-black text-[10px] md:text-sm uppercase tracking-widest hover:from-fuchsia-500 hover:to-pink-500 transition-all active:scale-95 disabled:opacity-50 disabled:scale-100 shadow-[0_8px_25px_rgba(217,70,239,0.3)]"
                >
                  {isUploading ? '...' : 'Save'}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

async function getCroppedImg(imageSrc, pixelCrop) {
  const image = new Image();
  image.src = imageSrc;
  await new Promise((resolve, reject) => {
    image.onload = resolve;
    image.onerror = reject;
  });

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve(blob);
    }, 'image/jpeg', 0.9);
  });
}
