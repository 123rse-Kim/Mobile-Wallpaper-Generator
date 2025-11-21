import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { InputArea } from './components/InputArea';
import { ImageGrid } from './components/ImageGrid';
import { ImageViewer } from './components/ImageViewer';
import { generateWallpapers } from './services/geminiService';
import { GeneratedImage, GenerationState } from './types';
import { Image as ImageIcon, Key, ChevronRight } from 'lucide-react';

const App: React.FC = () => {
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [state, setState] = useState<GenerationState>({ isLoading: false, error: null });
  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(null);
  const [inputPrompt, setInputPrompt] = useState<string>("");
  const [hasApiKey, setHasApiKey] = useState<boolean>(false);

  // Check for existing API Key selection on mount
  useEffect(() => {
    const checkKey = async () => {
      if ((window as any).aistudio?.hasSelectedApiKey) {
        const has = await (window as any).aistudio.hasSelectedApiKey();
        setHasApiKey(has);
      }
    };
    checkKey();
  }, []);

  // Handler to open the API Key selection dialog
  const handleApiKeySelect = async () => {
    if ((window as any).aistudio?.openSelectKey) {
      await (window as any).aistudio.openSelectKey();
      // Assume success to avoid race conditions
      setHasApiKey(true);
    }
  };

  const handleGenerate = useCallback(async (prompt: string) => {
    setState({ isLoading: true, error: null });
    setInputPrompt(prompt);

    try {
      const newImages = await generateWallpapers(prompt);
      
      if (newImages.length === 0) {
        setState({ isLoading: false, error: "이미지를 생성하지 못했습니다. 다시 시도해주세요." });
        return;
      }

      // Add new images to the top of the list
      setImages(prev => [...newImages, ...prev]);
      setState({ isLoading: false, error: null });
      
      // Scroll to top to see new results
      window.scrollTo({ top: 0, behavior: 'smooth' });

    } catch (error: any) {
      // Handle case where API Key is invalid or project is not found
      if (error.toString().includes("Requested entity was not found") || error.message?.includes("Requested entity was not found")) {
        setHasApiKey(false);
        setState({ isLoading: false, error: null });
        return;
      }

      setState({ isLoading: false, error: "오류가 발생했습니다. 잠시 후 다시 시도해주세요." });
      console.error(error);
    }
  }, []);

  const handleRemix = (prompt: string) => {
    setInputPrompt(prompt);
  };

  // If no API key is selected, show the Landing/Connect Page
  if (!hasApiKey) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
           <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-600/20 rounded-full blur-[100px]"></div>
           <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-pink-600/20 rounded-full blur-[100px]"></div>
        </div>

        <div className="relative z-10 max-w-md w-full flex flex-col items-center">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-8 shadow-xl shadow-purple-500/20">
                <ImageIcon className="w-10 h-10 text-white" />
            </div>
            
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent mb-3">
                Wallpaper Studio
            </h1>
            <p className="text-zinc-400 mb-10 leading-relaxed">
                AI로 만드는 나만의 감성 배경화면.<br/>
                지금 바로 시작해보세요.
            </p>

            <button 
                onClick={handleApiKeySelect}
                className="group w-full bg-white text-black font-bold py-4 px-6 rounded-xl hover:bg-zinc-200 transition-all active:scale-[0.98] flex items-center justify-between"
            >
                <span className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-black/10 flex items-center justify-center">
                        <Key className="w-4 h-4" />
                    </div>
                    API Key 연결하기
                </span>
                <ChevronRight className="w-5 h-5 text-zinc-400 group-hover:translate-x-1 transition-transform" />
            </button>

            <div className="mt-8 text-xs text-zinc-600">
                <p className="mb-1">Google Cloud 프로젝트의 API Key가 필요합니다.</p>
                <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noreferrer" className="underline hover:text-zinc-400 transition-colors">
                  요금제 및 설정 가이드
                </a>
            </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans">
      <Header />

      <main className="relative min-h-[calc(100vh-80px)]">
        
        {/* Error Message */}
        {state.error && (
          <div className="mx-4 mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-200 text-sm text-center">
            {state.error}
          </div>
        )}

        {/* Empty State */}
        {images.length === 0 && !state.isLoading && !state.error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center text-zinc-600 -translate-y-20">
            <div className="w-16 h-16 rounded-full bg-zinc-900 flex items-center justify-center mb-4 border border-zinc-800">
              <ImageIcon className="w-8 h-8 opacity-50" />
            </div>
            <h2 className="text-lg font-medium text-zinc-300 mb-2">나만의 배경화면 만들기</h2>
            <p className="text-sm max-w-xs">
              "몽환적인 보라색 구름", "사이버펑크 서울 야경" 등 원하는 분위기를 입력해보세요.
            </p>
          </div>
        )}

        {/* Grid */}
        <ImageGrid 
          images={images} 
          onImageClick={setSelectedImage} 
        />
        
        {/* Spacer for fixed bottom input */}
        <div className="h-48"></div>
      </main>

      {/* Fixed Input Area */}
      <InputArea 
        onGenerate={handleGenerate} 
        isLoading={state.isLoading} 
        initialPrompt={inputPrompt}
      />

      {/* Fullscreen Viewer Modal */}
      {selectedImage && (
        <ImageViewer 
          image={selectedImage} 
          onClose={() => setSelectedImage(null)} 
          onRemix={handleRemix}
        />
      )}
    </div>
  );
};

export default App;