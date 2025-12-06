'use client';

import { Button } from '@/components/ui/button';

interface VideoPlayerProps {
  videoUrl: string;
}

export function VideoPlayer({ videoUrl }: VideoPlayerProps) {
  const handleDownload = () => {
    // Open in new tab to trigger download via the proxy
    window.open(videoUrl, '_blank');
  };

  return (
    <div className="w-full max-w-3xl">
      {/* Video Container */}
      <div className="relative aspect-video rounded-xl overflow-hidden bg-black shadow-2xl">
        <video
          src={videoUrl}
          controls
          className="w-full h-full"
          autoPlay
          playsInline
        >
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Actions */}
      <div className="mt-6 flex items-center justify-center gap-4">
        <Button onClick={handleDownload} size="lg" className="gap-2">
          <span>📥</span>
          Download Video
        </Button>
        <Button variant="outline" size="lg" className="gap-2">
          <span>🔗</span>
          Share Link
        </Button>
      </div>

      {/* Success Message */}
      <div className="mt-6 text-center">
        <p className="text-sm text-muted-foreground">
          Your video has been generated successfully!
        </p>
      </div>
    </div>
  );
}

