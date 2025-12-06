import { NextRequest, NextResponse } from 'next/server';
import { analyzePropertyPhotos } from '@/lib/genai';

export async function POST(request: NextRequest) {
  try {
    const { photos } = await request.json();

    if (!photos || !Array.isArray(photos) || photos.length === 0) {
      return NextResponse.json(
        { error: 'No photos provided' },
        { status: 400 }
      );
    }

    const analysis = await analyzePropertyPhotos(photos);

    return NextResponse.json({ analysis });
  } catch (error) {
    console.error('Error analyzing photos:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to analyze photos' },
      { status: 500 }
    );
  }
}
