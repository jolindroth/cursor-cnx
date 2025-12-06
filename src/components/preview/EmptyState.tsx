'use client';

interface EmptyStateProps {
  hasInputs: boolean;
}

export function EmptyState({ hasInputs }: EmptyStateProps) {
  return (
    <div className="text-center max-w-md">
      <div className="relative inline-block mb-6">
        <div className="w-32 h-24 rounded-lg bg-muted flex items-center justify-center border-2 border-dashed border-border">
          <span className="text-4xl opacity-50">🎬</span>
        </div>
        <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
          <span className="text-lg">✨</span>
        </div>
      </div>
      
      <h3 className="text-xl font-semibold text-foreground mb-2">
        {hasInputs ? 'Ready to Generate' : 'Create Your Property Video'}
      </h3>
      
      <p className="text-sm text-muted-foreground leading-relaxed">
        {hasInputs
          ? 'All set! Click "Generate Video" to create your AI-powered real estate marketing video.'
          : 'Upload property photos, select a presenter, and choose a video style to generate your professional marketing video.'}
      </p>

      {!hasInputs && (
        <div className="mt-6 flex flex-col gap-2 text-left max-w-xs mx-auto">
          <div className="flex items-center gap-3 text-sm">
            <span className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-medium">1</span>
            <span className="text-muted-foreground">Upload property photos</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-medium">2</span>
            <span className="text-muted-foreground">Choose your presenter</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-medium">3</span>
            <span className="text-muted-foreground">Select video style</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-medium">4</span>
            <span className="text-muted-foreground">Generate with AI</span>
          </div>
        </div>
      )}
    </div>
  );
}

