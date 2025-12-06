'use client';

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Avatar } from '@/types';
import { predefinedAvatars } from '@/lib/avatars';
import { cn } from '@/lib/utils';
import { Avatar as AvatarUI, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface AvatarSelectorProps {
  selectedAvatar: Avatar | null;
  customAvatarPreview: string | null;
  onAvatarSelect: (avatar: Avatar | null) => void;
  onCustomAvatarUpload: (file: File, preview: string) => void;
}

export function AvatarSelector({
  selectedAvatar,
  customAvatarPreview,
  onAvatarSelect,
  onCustomAvatarUpload,
}: AvatarSelectorProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        const preview = URL.createObjectURL(file);
        onAvatarSelect(null);
        onCustomAvatarUpload(file, preview);
      }
    },
    [onAvatarSelect, onCustomAvatarUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp'],
    },
    multiple: false,
  });

  const handleAvatarClick = (avatar: Avatar) => {
    onAvatarSelect(avatar);
  };

  const isCustomSelected = customAvatarPreview !== null && selectedAvatar === null;

  return (
    <div className="space-y-4">
      {/* Predefined Avatars Grid */}
      <div className="grid grid-cols-2 gap-3">
        {predefinedAvatars.map((avatar) => (
          <button
            key={avatar.id}
            onClick={() => handleAvatarClick(avatar)}
            className={cn(
              'flex items-center gap-3 p-3 rounded-lg border-2 transition-all text-left',
              selectedAvatar?.id === avatar.id
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary/50'
            )}
          >
            <AvatarUI className="h-10 w-10 shrink-0">
              <AvatarImage src={avatar.image} alt={avatar.name} />
              <AvatarFallback className="text-xs">
                {avatar.name.split(' ').map((n) => n[0]).join('')}
              </AvatarFallback>
            </AvatarUI>
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {avatar.name}
              </p>
              <p className="text-xs text-muted-foreground line-clamp-1">
                {avatar.description}
              </p>
            </div>
          </button>
        ))}
      </div>

      {/* Custom Avatar Upload */}
      <div
        {...getRootProps()}
        className={cn(
          'border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors',
          isCustomSelected
            ? 'border-primary bg-primary/5'
            : isDragActive
            ? 'border-primary bg-primary/5'
            : 'border-border hover:border-primary/50 hover:bg-muted/50'
        )}
      >
        <input {...getInputProps()} />
        {customAvatarPreview ? (
          <div className="flex items-center gap-3 justify-center">
            <AvatarUI className="h-12 w-12">
              <AvatarImage src={customAvatarPreview} alt="Custom avatar" />
              <AvatarFallback>CU</AvatarFallback>
            </AvatarUI>
            <div className="text-left">
              <p className="text-sm font-medium text-foreground">Custom Presenter</p>
              <p className="text-xs text-muted-foreground">Click to change</p>
            </div>
          </div>
        ) : (
          <>
            <div className="text-2xl mb-1">📤</div>
            <p className="text-sm text-foreground font-medium">
              Upload custom presenter
            </p>
            <p className="text-xs text-muted-foreground">
              Use your own image
            </p>
          </>
        )}
      </div>
    </div>
  );
}

