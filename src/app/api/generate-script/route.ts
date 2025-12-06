import { NextRequest, NextResponse } from 'next/server';
import { generatePresenterScript } from '@/lib/genai';

export async function POST(request: NextRequest) {
  try {
    const { propertyAnalysis, stylePrompt, presenterName } = await request.json();

    if (!propertyAnalysis || !stylePrompt || !presenterName) {
      return NextResponse.json(
        { error: 'Missing required fields: propertyAnalysis, stylePrompt, presenterName' },
        { status: 400 }
      );
    }

    const script = await generatePresenterScript(
      propertyAnalysis,
      stylePrompt,
      presenterName
    );

    return NextResponse.json({ script });
  } catch (error) {
    console.error('Error generating script:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate script' },
      { status: 500 }
    );
  }
}

