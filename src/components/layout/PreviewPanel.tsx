'use client';

import { GenerationState } from '@/types';
import { EmptyState } from '@/components/preview/EmptyState';
import { GeneratingState } from '@/components/preview/GeneratingState';
import { VideoPlayer } from '@/components/preview/VideoPlayer';

interface PreviewPanelProps {
  generation: GenerationState;
  hasInputs: boolean;
}

export function PreviewPanel({ generation, hasInputs }: PreviewPanelProps) {
  const renderContent = () => {
    switch (generation.status) {
      case 'idle':
        return <EmptyState hasInputs={hasInputs} />;
      case 'analyzing':
      case 'generating-script':
      case 'generating-video':
        return (
          <GeneratingState
            status={generation.status}
            progress={generation.progress}
            message={generation.message}
          />
        );
      case 'complete':
        return generation.videoUrl ? (
          <VideoPlayer videoUrl={generation.videoUrl} />
        ) : (
          <EmptyState hasInputs={hasInputs} />
        );
      case 'error':
        return (
          <div className="flex h-full items-center justify-center p-8">
            <div className="text-center max-w-md">
              <div className="text-4xl mb-4">⚠️</div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Generation Failed
              </h3>
              <p className="text-sm text-muted-foreground">
                {generation.error || 'An unexpected error occurred. Please try again.'}
              </p>
            </div>
          </div>
        );
      default:
        return <EmptyState hasInputs={hasInputs} />;
    }
  };

  return (
    <div className="h-full flex items-center justify-center p-8">
      {renderContent()}
    </div>
  );
}

