import React from 'react';
import { Laptop } from 'lucide-react'; // Using lucide-react for icons

export const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-10 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800 px-4 py-4">
      <div className="flex items-center justify-between max-w-md mx-auto">
        <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          배경화면 스튜디오
        </h1>
        <div className="text-xs text-zinc-500 font-medium px-2 py-1 rounded bg-zinc-900 border border-zinc-800">
          AI Powered
        </div>
      </div>
    </header>
  );
};
