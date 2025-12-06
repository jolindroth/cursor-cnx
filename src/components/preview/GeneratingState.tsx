'use client';

import { Progress } from '@/components/ui/progress';

interface GeneratingStateProps {
  status: 'analyzing' | 'generating-script' | 'generating-video';
  progress: number;
  message: string;
}

export function GeneratingState({ status, progress, message }: GeneratingStateProps) {
  const steps = [
    { key: 'analyzing', label: 'Analyzing Photos', icon: '🔍' },
    { key: 'generating-script', label: 'Writing Script', icon: '📝' },
    { key: 'generating-video', label: 'Creating Video', icon: '🎬' },
  ];

  const currentStepIndex = steps.findIndex((s) => s.key === status);

  return (
    <div className="text-center max-w-md w-full">
      {/* Animated Icon */}
      <div className="relative inline-block mb-8">
        <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center animate-pulse">
          <span className="text-5xl">
            {steps[currentStepIndex]?.icon || '⏳'}
          </span>
        </div>
        <div className="absolute inset-0 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
      </div>

      <h3 className="text-xl font-semibold text-foreground mb-2">
        {message}
      </h3>

      <p className="text-sm text-muted-foreground mb-6">
        This may take a few minutes. Please don&apos;t close this window.
      </p>

      {/* Progress Bar */}
      <div className="space-y-2">
        <Progress value={progress} className="h-2" />
        <p className="text-xs text-muted-foreground">{Math.round(progress)}% complete</p>
      </div>

      {/* Steps Indicator */}
      <div className="mt-8 flex justify-center gap-6">
        {steps.map((step, index) => (
          <div key={step.key} className="flex flex-col items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm mb-1 transition-colors ${
                index < currentStepIndex
                  ? 'bg-primary text-primary-foreground'
                  : index === currentStepIndex
                  ? 'bg-primary/20 text-primary border-2 border-primary'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              {index < currentStepIndex ? '✓' : step.icon}
            </div>
            <span
              className={`text-xs ${
                index <= currentStepIndex ? 'text-foreground' : 'text-muted-foreground'
              }`}
            >
              {step.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

