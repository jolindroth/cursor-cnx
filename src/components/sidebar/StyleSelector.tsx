'use client';

import { VideoStyle } from '@/types';
import { videoStyles } from '@/lib/templates';
import { cn } from '@/lib/utils';

interface StyleSelectorProps {
  selectedStyle: VideoStyle | null;
  onStyleSelect: (style: VideoStyle) => void;
}

export function StyleSelector({ selectedStyle, onStyleSelect }: StyleSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {videoStyles.map((style) => (
        <button
          key={style.id}
          onClick={() => onStyleSelect(style)}
          className={cn(
            'p-4 rounded-lg border-2 transition-all text-left',
            selectedStyle?.id === style.id
              ? 'border-primary bg-primary/5'
              : 'border-border hover:border-primary/50'
          )}
        >
          <div className="text-2xl mb-2">{style.thumbnail}</div>
          <p className="text-sm font-medium text-foreground">{style.name}</p>
          <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
            {style.description}
          </p>
        </button>
      ))}
    </div>
  );
}

