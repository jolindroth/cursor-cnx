'use client';

import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { PhotoUploader } from '@/components/sidebar/PhotoUploader';
import { AvatarSelector } from '@/components/sidebar/AvatarSelector';
import { StyleSelector } from '@/components/sidebar/StyleSelector';
import { LanguageSelector } from '@/components/sidebar/LanguageSelector';
import { PropertyPhoto, Avatar, VideoStyle, GenerationState } from '@/types';
import { Language } from '@/lib/languages';

interface SidebarProps {
  photos: PropertyPhoto[];
  onPhotosChange: (photos: PropertyPhoto[]) => void;
  selectedAvatar: Avatar | null;
  customAvatarPreview: string | null;
  onAvatarSelect: (avatar: Avatar | null) => void;
  onCustomAvatarUpload: (file: File, preview: string) => void;
  selectedStyle: VideoStyle | null;
  onStyleSelect: (style: VideoStyle) => void;
  selectedLanguage: Language | null;
  onLanguageSelect: (language: Language) => void;
  generation: GenerationState;
  onGenerate: () => void;
}

export function Sidebar({
  photos,
  onPhotosChange,
  selectedAvatar,
  customAvatarPreview,
  onAvatarSelect,
  onCustomAvatarUpload,
  selectedStyle,
  onStyleSelect,
  selectedLanguage,
  onLanguageSelect,
  generation,
  onGenerate,
}: SidebarProps) {
  const canGenerate =
    photos.length > 0 &&
    (selectedAvatar !== null || customAvatarPreview !== null) &&
    selectedStyle !== null &&
    selectedLanguage !== null &&
    generation.status === 'idle';

  const isGenerating = generation.status !== 'idle' && generation.status !== 'complete' && generation.status !== 'error';

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <ScrollArea className="flex-1 h-0">
        <div className="p-5 space-y-6">
          {/* Photo Upload Section */}
          <section>
            <h2 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <span className="text-base">📷</span>
              Property Photo
            </h2>
            <PhotoUploader photos={photos} onPhotosChange={onPhotosChange} />
          </section>

          <Separator />

          {/* Avatar Selection Section */}
          <section>
            <h2 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <span className="text-base">👤</span>
              Presenter
            </h2>
            <AvatarSelector
              selectedAvatar={selectedAvatar}
              customAvatarPreview={customAvatarPreview}
              onAvatarSelect={onAvatarSelect}
              onCustomAvatarUpload={onCustomAvatarUpload}
            />
          </section>

          <Separator />

          {/* Language Selection Section */}
          <section>
            <h2 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <span className="text-base">🗣️</span>
              Presenter Language
            </h2>
            <LanguageSelector
              selectedLanguage={selectedLanguage}
              onLanguageSelect={onLanguageSelect}
            />
          </section>

          <Separator />

          {/* Style Selection Section */}
          <section>
            <h2 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <span className="text-base">🎬</span>
              Video Style
            </h2>
            <StyleSelector
              selectedStyle={selectedStyle}
              onStyleSelect={onStyleSelect}
            />
          </section>
        </div>
      </ScrollArea>

      {/* Generate Button */}
      <div className="shrink-0 border-t border-border p-5">
        <Button
          className="w-full h-12 text-base font-semibold"
          size="lg"
          disabled={!canGenerate || isGenerating}
          onClick={onGenerate}
        >
          {isGenerating ? (
            <>
              <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              {generation.message}
            </>
          ) : (
            'Generate Video'
          )}
        </Button>
        {!canGenerate && generation.status === 'idle' && (
          <p className="text-xs text-muted-foreground text-center mt-2">
            {photos.length === 0 && 'Upload photos • '}
            {!selectedAvatar && !customAvatarPreview && 'Select presenter • '}
            {!selectedLanguage && 'Choose language • '}
            {!selectedStyle && 'Pick style'}
          </p>
        )}
      </div>
    </div>
  );
}
