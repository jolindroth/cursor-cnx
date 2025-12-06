'use client';

import { useState, useCallback } from 'react';
import { EditorLayout } from '@/components/layout/EditorLayout';
import { Sidebar } from '@/components/layout/Sidebar';
import { PreviewPanel } from '@/components/layout/PreviewPanel';
import { PropertyPhoto, Avatar, VideoStyle, GenerationState } from '@/types';

export default function Home() {
  // State management
  const [photos, setPhotos] = useState<PropertyPhoto[]>([]);
  const [selectedAvatar, setSelectedAvatar] = useState<Avatar | null>(null);
  const [customAvatarFile, setCustomAvatarFile] = useState<File | null>(null);
  const [customAvatarPreview, setCustomAvatarPreview] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<VideoStyle | null>(null);
  const [generation, setGeneration] = useState<GenerationState>({
    status: 'idle',
    progress: 0,
    message: '',
  });

  const handlePhotosChange = useCallback((newPhotos: PropertyPhoto[]) => {
    setPhotos(newPhotos);
  }, []);

  const handleAvatarSelect = useCallback((avatar: Avatar | null) => {
    setSelectedAvatar(avatar);
    if (avatar) {
      // Clear custom avatar when selecting predefined
      if (customAvatarPreview) {
        URL.revokeObjectURL(customAvatarPreview);
      }
      setCustomAvatarFile(null);
      setCustomAvatarPreview(null);
    }
  }, [customAvatarPreview]);

  const handleCustomAvatarUpload = useCallback((file: File, preview: string) => {
    if (customAvatarPreview) {
      URL.revokeObjectURL(customAvatarPreview);
    }
    setCustomAvatarFile(file);
    setCustomAvatarPreview(preview);
    setSelectedAvatar(null);
  }, [customAvatarPreview]);

  const handleStyleSelect = useCallback((style: VideoStyle) => {
    setSelectedStyle(style);
  }, []);

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleGenerate = async () => {
    if (!selectedStyle) return;
    if (photos.length === 0) return;
    if (!selectedAvatar && !customAvatarPreview) return;

    try {
      // Step 1: Analyze photos
      setGeneration({
        status: 'analyzing',
        progress: 10,
        message: 'Analyzing property photos...',
      });

      const photoBase64 = await Promise.all(
        photos.map((photo) => fileToBase64(photo.file))
      );

      const analyzeResponse = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ photos: photoBase64 }),
      });

      if (!analyzeResponse.ok) {
        const error = await analyzeResponse.json();
        throw new Error(error.error || 'Failed to analyze photos');
      }

      const { analysis } = await analyzeResponse.json();

      // Step 2: Generate script
      setGeneration({
        status: 'generating-script',
        progress: 40,
        message: 'Writing presenter script...',
      });

      const presenterName = selectedAvatar?.name || 'Your Presenter';

      const scriptResponse = await fetch('/api/generate-script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          propertyAnalysis: analysis,
          stylePrompt: selectedStyle.prompt,
          presenterName,
        }),
      });

      if (!scriptResponse.ok) {
        const error = await scriptResponse.json();
        throw new Error(error.error || 'Failed to generate script');
      }

      const { script } = await scriptResponse.json();

      // Step 3: Generate video with Veo
      setGeneration({
        status: 'generating-video',
        progress: 60,
        message: 'Creating your video with Veo 3.1...',
      });

      // Get avatar image
      let avatarImage: string;
      if (customAvatarFile) {
        avatarImage = await fileToBase64(customAvatarFile);
      } else if (selectedAvatar) {
        // For predefined avatars, we'd need to fetch and convert
        // For now, use placeholder
        avatarImage = selectedAvatar.image;
      } else {
        throw new Error('No avatar selected');
      }

      const videoResponse = await fetch('/api/generate-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          photos: photoBase64,
          avatarImage,
          script,
          stylePrompt: selectedStyle.prompt,
        }),
      });

      if (!videoResponse.ok) {
        const error = await videoResponse.json();
        throw new Error(error.error || 'Failed to generate video');
      }

      const { videoUrl } = await videoResponse.json();

      setGeneration({
        status: 'complete',
        progress: 100,
        message: 'Video generated successfully!',
        videoUrl,
      });
    } catch (error) {
      console.error('Generation error:', error);
      setGeneration({
        status: 'error',
        progress: 0,
        message: 'Generation failed',
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
      });
    }
  };

  const hasInputs =
    photos.length > 0 ||
    selectedAvatar !== null ||
    customAvatarPreview !== null ||
    selectedStyle !== null;

  return (
    <EditorLayout
      sidebar={
        <Sidebar
          photos={photos}
          onPhotosChange={handlePhotosChange}
          selectedAvatar={selectedAvatar}
          customAvatarPreview={customAvatarPreview}
          onAvatarSelect={handleAvatarSelect}
          onCustomAvatarUpload={handleCustomAvatarUpload}
          selectedStyle={selectedStyle}
          onStyleSelect={handleStyleSelect}
          generation={generation}
          onGenerate={handleGenerate}
        />
      }
      preview={<PreviewPanel generation={generation} hasInputs={hasInputs} />}
    />
  );
}
