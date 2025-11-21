import React from 'react';
import { X, Download, RefreshCw } from 'lucide-react';
import { GeneratedImage } from '../types';

interface ImageViewerProps {
  image: GeneratedImage | null;
  onClose: () => void;
  onRemix: (prompt: string) => void;
}

export const ImageViewer: React.FC<ImageViewerProps> = ({ image, onClose, onRemix }) => {
  if (!image) return null;

  const handleDownload = async () => {
    try {
      // Create a temporary link
      const link = document.createElement('a');
      link.href = image.url;
      link.download = `wallpaper-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Download failed", err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col animate-in fade-in duration-200">
      {/* Close Button */}
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 z-10 p-2 bg-black/20 backdrop-blur-md rounded-full text-white/80 hover:text-white hover:bg-black/40 transition-colors"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Image Container */}
      <div className="flex-1 flex items-center justify-center bg-zinc-900 relative">
        <img 
          src={image.url} 
          alt="Fullscreen wallpaper" 
          className="w-full h-full object-contain"
        />
      </div>

      {/* Action Bar */}
      <div className="p-6 bg-gradient-to-t from-black via-black/90 to-transparent absolute bottom-0 left-0 right-0 flex flex-col gap-4">
        
        <div className="flex gap-3 w-full max-w-md mx-auto">
            <button 
                onClick={() => {
                    onRemix(image.prompt.replace('A high-quality, aesthetic smartphone wallpaper (vertical 9:16 aspect ratio). Style: ', '').replace('. No text, minimal UI elements, highly detailed, atmospheric.', ''));
                    onClose();
                }}
                className="flex-1 bg-zinc-800/80 backdrop-blur text-white font-medium rounded-xl py-3 flex items-center justify-center gap-2 active:scale-95 transition-transform"
            >
                <RefreshCw className="w-5 h-5" />
                Remix
            </button>

            <button 
                onClick={handleDownload}
                className="flex-1 bg-white text-black font-bold rounded-xl py-3 flex items-center justify-center gap-2 active:scale-95 transition-transform"
            >
                <Download className="w-5 h-5" />
                다운로드
            </button>
        </div>
      </div>
    </div>
  );
};
