import React from 'react';
import { GeneratedImage } from '../types';

interface ImageGridProps {
  images: GeneratedImage[];
  onImageClick: (image: GeneratedImage) => void;
}

export const ImageGrid: React.FC<ImageGridProps> = ({ images, onImageClick }) => {
  if (images.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-2 gap-3 p-4 pb-32 max-w-md mx-auto animate-fade-in">
      {images.map((image) => (
        <div 
          key={image.id} 
          onClick={() => onImageClick(image)}
          className="relative aspect-[9/16] rounded-xl overflow-hidden cursor-pointer group bg-zinc-900 shadow-lg transition-transform active:scale-95 hover:scale-[1.02] border border-zinc-800"
        >
          <img 
            src={image.url} 
            alt={image.prompt} 
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
            <span className="text-white text-xs font-medium">탭하여 보기</span>
          </div>
        </div>
      ))}
    </div>
  );
};
