export interface PropertyPhoto {
  id: string;
  file: File;
  preview: string;
}

export interface Avatar {
  id: string;
  name: string;
  image: string;
  description: string;
}

export interface VideoStyle {
  id: string;
  name: string;
  description: string;
  prompt: string;
  thumbnail: string;
}

export interface GenerationState {
  status: 'idle' | 'analyzing' | 'generating-script' | 'generating-video' | 'complete' | 'error';
  progress: number;
  message: string;
  videoUrl?: string;
  error?: string;
}

export interface Language {
  code: string;
  name: string;
  flag: string;
}

export interface EditorState {
  photos: PropertyPhoto[];
  selectedAvatar: Avatar | null;
  customAvatarFile: File | null;
  customAvatarPreview: string | null;
  selectedStyle: VideoStyle | null;
  selectedLanguage: Language | null;
  generation: GenerationState;
}

