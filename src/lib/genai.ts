import { GoogleGenAI } from '@google/genai';

const apiKey = process.env.GOOGLE_AI_API_KEY;

if (!apiKey) {
  console.warn('GOOGLE_AI_API_KEY is not set. AI features will not work.');
}

export const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export async function analyzePropertyPhotos(photoBase64Array: string[]): Promise<string> {
  if (!ai) {
    throw new Error('Google AI API key not configured');
  }

  const imageParts = photoBase64Array.map((base64) => ({
    inlineData: {
      data: base64.replace(/^data:image\/\w+;base64,/, ''),
      mimeType: 'image/jpeg' as const,
    },
  }));

  const prompt = `You are a professional real estate analyst. Analyze these property photos and provide:
1. A brief overall description of the property type and style
2. Key features visible in the photos (rooms, amenities, architectural details)
3. The apparent condition and quality level
4. Notable selling points
5. The general atmosphere and feel of the property

Be concise but comprehensive. Format as a structured summary that can be used to create a property marketing video script.`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: [
      {
        role: 'user',
        parts: [
          { text: prompt },
          ...imageParts,
        ],
      },
    ],
  });

  return response.text || '';
}

export async function generatePresenterScript(
  propertyAnalysis: string,
  stylePrompt: string,
  presenterName: string
): Promise<string> {
  if (!ai) {
    throw new Error('Google AI API key not configured');
  }

  const prompt = `You are creating a script for a real estate video presenter named ${presenterName}.

Property Analysis:
${propertyAnalysis}

Video Style:
${stylePrompt}

Write a natural, engaging script that the presenter will speak while walking through and showcasing this property. The script should:
1. Match the specified video style
2. Highlight the key features identified in the analysis
3. Feel conversational and authentic
4. Be approximately 60-90 seconds when spoken
5. Include natural pauses and transitions between areas

Format the script as spoken dialogue only, without stage directions.`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: prompt,
  });

  return response.text || '';
}

export interface VideoGenerationResult {
  videoUrl: string;
  videoBytes?: Uint8Array;
}

export async function generateVideoWithVeo(
  propertyPhotos: string[],
  avatarImage: string,
  script: string,
  stylePrompt: string
): Promise<VideoGenerationResult> {
  if (!ai) {
    throw new Error('Google AI API key not configured');
  }

  // Build a comprehensive prompt for video generation
  // Include the script as dialogue and the style direction
  const videoPrompt = `${stylePrompt}

A professional real estate presenter walks through and showcases a property. The presenter speaks directly to the camera with confidence and warmth.

Presenter dialogue: "${script}"

The video should feature smooth, cinematic camera movements highlighting the property's best features. Natural lighting, professional quality, high production value.`;

  // Use the first property photo as the starting frame for image-to-video generation
  const firstPhotoBase64 = propertyPhotos[0].replace(/^data:image\/\w+;base64,/, '');

  // Start video generation with Veo 3.1
  let operation = await ai.models.generateVideos({
    model: 'veo-3.1-generate-preview',
    prompt: videoPrompt,
    image: {
      imageBytes: firstPhotoBase64,
      mimeType: 'image/jpeg',
    },
    config: {
      aspectRatio: '16:9',
      personGeneration: 'allow_adult',
    },
  });

  // Poll the operation status until the video is ready
  while (!operation.done) {
    console.log('Waiting for video generation to complete...');
    await new Promise((resolve) => setTimeout(resolve, 10000));
    operation = await ai.operations.getVideosOperation({
      operation: operation,
    });
  }

  // Get the generated video
  const generatedVideo = operation.response?.generatedVideos?.[0];
  if (!generatedVideo?.video) {
    throw new Error('Video generation completed but no video was returned');
  }

  // Return the video URL/file reference
  // The video can be downloaded using ai.files.download()
  return {
    videoUrl: generatedVideo.video.uri || '',
  };
}

export async function downloadVideo(videoFile: { uri?: string }): Promise<Blob> {
  if (!ai) {
    throw new Error('Google AI API key not configured');
  }

  // For server-side, we need to fetch the video using the API
  // The URI returned from Veo needs to be accessed with the API key
  if (!videoFile.uri) {
    throw new Error('No video URI provided');
  }

  const response = await fetch(videoFile.uri, {
    headers: {
      'x-goog-api-key': apiKey!,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to download video: ${response.statusText}`);
  }

  return response.blob();
}
