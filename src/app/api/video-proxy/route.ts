import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const videoUri = request.nextUrl.searchParams.get('uri');
  
  if (!videoUri) {
    return NextResponse.json({ error: 'No video URI provided' }, { status: 400 });
  }

  const apiKey = process.env.GOOGLE_AI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
  }

  try {
    // Fetch the video from Google's API with the API key
    const response = await fetch(videoUri, {
      headers: {
        'x-goog-api-key': apiKey,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Video fetch error:', errorText);
      return NextResponse.json(
        { error: `Failed to fetch video: ${response.status}` },
        { status: response.status }
      );
    }

    // Get the video as a blob and stream it back
    const videoBlob = await response.blob();
    
    return new NextResponse(videoBlob, {
      headers: {
        'Content-Type': 'video/mp4',
        'Content-Disposition': `attachment; filename="property-video-${Date.now()}.mp4"`,
      },
    });
  } catch (error) {
    console.error('Video proxy error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to proxy video' },
      { status: 500 }
    );
  }
}

