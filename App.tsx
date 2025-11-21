import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { InputArea } from './components/InputArea';
import { ImageGrid } from './components/ImageGrid';
import { ImageViewer } from './components/ImageViewer';
import { generateWallpapers } from './services/geminiService';
import { GeneratedImage, GenerationState } from './types';
import { Image as ImageIcon } from 'lucide-react';

const App: React.FC = () => {
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [state, setState] = useState<GenerationState>({ isLoading: false, error: null });
  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(null);
  const [inputPrompt, setInputPrompt] = useState<string>("");

  const handleGenerate = useCallback(async (prompt: string) => {
    setState({ isLoading: true, error: null });
    // Update the input prompt state in case we want to persist it
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

    } catch (error) {
      setState({ isLoading: false, error: "오류가 발생했습니다. 잠시 후 다시 시도해주세요." });
      console.error(error);
    }
  }, []);

  const handleRemix = (prompt: string) => {
    setInputPrompt(prompt);
    // Focus on input happens automatically via prop update in InputArea if we wanted, 
    // but user will just see the text populated ready to edit
  };

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
