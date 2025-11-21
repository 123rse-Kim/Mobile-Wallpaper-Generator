import React, { useState, useEffect } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';

interface InputAreaProps {
  onGenerate: (prompt: string) => void;
  isLoading: boolean;
  initialPrompt?: string;
}

export const InputArea: React.FC<InputAreaProps> = ({ onGenerate, isLoading, initialPrompt = '' }) => {
  const [prompt, setPrompt] = useState(initialPrompt);

  useEffect(() => {
    if (initialPrompt) {
      setPrompt(initialPrompt);
    }
  }, [initialPrompt]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      onGenerate(prompt);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 bg-zinc-950 border-t border-zinc-800 z-20 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
      <div className="max-w-md mx-auto">
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="relative">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="원하는 분위기를 설명해주세요... (예: 비 오는 서울의 네온사인 거리)"
              className="w-full bg-zinc-900 text-white placeholder-zinc-500 rounded-2xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-purple-500/50 border border-zinc-800 resize-none h-24 text-sm leading-relaxed scrollbar-hide"
              disabled={isLoading}
            />
            <div className="absolute right-3 bottom-3 text-[10px] text-zinc-600">
              {prompt.length}/200
            </div>
          </div>
          
          <button
            type="submit"
            disabled={isLoading || !prompt.trim()}
            className="w-full bg-white text-black font-bold rounded-xl py-3.5 px-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all active:scale-[0.98] hover:bg-zinc-200"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>이미지 생성 중...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-purple-600 fill-purple-600" />
                <span>배경화면 생성하기</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
