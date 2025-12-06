import { NextRequest, NextResponse } from 'next/server';
import { generateVideoWithVeo } from '@/lib/genai';

export const maxDuration = 300; // 5 minutes timeout for video generation

export async function POST(request: NextRequest) {
  try {
    const { photos, avatarImage, script, stylePrompt, language } = await request.json();

    if (!photos || !Array.isArray(photos) || photos.length === 0) {
      return NextResponse.json(
        { error: 'No photos provided' },
        { status: 400 }
      );
    }

    if (!script || !stylePrompt) {
      return NextResponse.json(
        { error: 'Missing required fields: script, stylePrompt' },
        { status: 400 }
      );
    }

    console.log(`Starting video generation with Veo 3.1 using ${photos.length} reference images...`);
    
    const result = await generateVideoWithVeo(
      photos,
      avatarImage || '',
      script,
      stylePrompt,
      language || 'English'
    );

    // Return a proxied URL that will work in the browser
    const proxyUrl = `/api/video-proxy?uri=${encodeURIComponent(result.videoUrl)}`;

    return NextResponse.json({ 
      videoUrl: proxyUrl,
      originalUrl: result.videoUrl,
      success: true 
    });
  } catch (error) {
    console.error('Error generating video:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate video' },
      { status: 500 }
    );
  }
}
