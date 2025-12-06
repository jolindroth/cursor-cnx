'use client';

import { ReactNode } from 'react';

interface EditorLayoutProps {
  sidebar: ReactNode;
  preview: ReactNode;
}

export function EditorLayout({ sidebar, preview }: EditorLayoutProps) {
  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Header */}
      <header className="flex h-14 shrink-0 items-center border-b border-border px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
            RE
          </div>
          <h1 className="text-lg font-semibold tracking-tight">
            RealEstate Video Generator
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-[400px] shrink-0 border-r border-border bg-card overflow-hidden">
          {sidebar}
        </aside>

        {/* Preview Panel */}
        <main className="flex-1 bg-muted/30">
          {preview}
        </main>
      </div>
    </div>
  );
}

