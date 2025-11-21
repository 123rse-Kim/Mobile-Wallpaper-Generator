export interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  createdAt: number;
}

export interface GenerationState {
  isLoading: boolean;
  error: string | null;
}
