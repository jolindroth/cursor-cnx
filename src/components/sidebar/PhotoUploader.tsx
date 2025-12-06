'use client';

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { PropertyPhoto } from '@/types';
import { cn } from '@/lib/utils';

interface PhotoUploaderProps {
  photos: PropertyPhoto[];
  onPhotosChange: (photos: PropertyPhoto[]) => void;
}

export function PhotoUploader({ photos, onPhotosChange }: PhotoUploaderProps) {
  const MAX_PHOTOS = 1;

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const remainingSlots = MAX_PHOTOS - photos.length;
      const filesToAdd = acceptedFiles.slice(0, remainingSlots);
      
      const newPhotos: PropertyPhoto[] = filesToAdd.map((file) => ({
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        file,
        preview: URL.createObjectURL(file),
      }));
      onPhotosChange([...photos, ...newPhotos]);
    },
    [photos, onPhotosChange]
  );

  const removePhoto = (id: string) => {
    const photo = photos.find((p) => p.id === id);
    if (photo) {
      URL.revokeObjectURL(photo.preview);
    }
    onPhotosChange(photos.filter((p) => p.id !== id));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp'],
    },
    multiple: true,
  });

  return (
    <div className="space-y-3">
      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={cn(
          'border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors',
          isDragActive
            ? 'border-primary bg-primary/5'
            : 'border-border hover:border-primary/50 hover:bg-muted/50'
        )}
      >
        <input {...getInputProps()} />
        <div className="text-3xl mb-2">📁</div>
        {photos.length >= MAX_PHOTOS ? (
          <p className="text-sm text-muted-foreground">Maximum {MAX_PHOTOS} photos reached</p>
        ) : isDragActive ? (
          <p className="text-sm text-primary font-medium">Drop photos here...</p>
        ) : (
          <>
            <p className="text-sm text-foreground font-medium">
              Drop photos here or click to browse
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Starting scene • JPEG, PNG, WebP
            </p>
          </>
        )}
      </div>

      {/* Photo Thumbnails */}
      {photos.length > 0 && (
        <div className="grid grid-cols-4 gap-2">
          {photos.map((photo) => (
            <div
              key={photo.id}
              className="relative aspect-square rounded-md overflow-hidden group"
            >
              <img
                src={photo.preview}
                alt="Property"
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => removePhoto(photo.id)}
                className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
              >
                <span className="text-white text-lg">✕</span>
              </button>
            </div>
          ))}
        </div>
      )}

      {photos.length > 0 && (
        <p className="text-xs text-muted-foreground">
          {photos.length} of {MAX_PHOTOS} photos selected
        </p>
      )}
    </div>
  );
}

