import { GoogleGenAI, VideoGenerationReferenceType } from '@google/genai';

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

  const prompt = `You are a professional real estate analyst. Analyze this property photo and describe:

1. What room or area is shown
2. Key features visible (furniture, fixtures, architectural details)
3. Notable design elements or selling points
4. The condition and quality level
5. The atmosphere and feel of the space

Be specific and detailed so a video presenter can speak about this room naturally.`;

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
  presenterName: string,
  language: string
): Promise<string> {
  if (!ai) {
    throw new Error('Google AI API key not configured');
  }

  const prompt = `You are creating a script for a real estate video presenter named ${presenterName}.
The script MUST be written entirely in ${language}.

Property Analysis:
${propertyAnalysis}

Video Style:
${stylePrompt}

Write a natural, engaging script in ${language} that the presenter will speak while showcasing this room/space. The script should:
1. Be written 100% in ${language} (not English, unless English was selected)
2. Match the specified video style
3. Highlight the key features from the analysis
4. Be approximately 8 seconds when spoken (brief but impactful)
5. Feel conversational and authentic
6. Include a brief welcome and highlight of the best features

Format the script as spoken dialogue only, without stage directions. Keep it concise for the 8-second video.`;

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
  stylePrompt: string,
  language: string
): Promise<VideoGenerationResult> {
  if (!ai) {
    throw new Error('Google AI API key not configured');
  }

  if (propertyPhotos.length < 1) {
    throw new Error('At least one property photo is required');
  }

  // Check if using custom presenter
  const hasCustomPresenter = avatarImage && !avatarImage.startsWith('/');

  // Build a comprehensive prompt for video generation
  // Use BOTH property photo AND presenter as reference images
  const videoPrompt = `${stylePrompt}

Create a real estate marketing video in ${language}.

REFERENCE IMAGE 1 (Property/Room): This is the EXACT room that must be shown in the video. 
- Reproduce this room EXACTLY as shown - same furniture, same layout, same colors, same everything
- The camera should show THIS EXACT room throughout the video
- Do NOT invent new furniture or change the room layout
- Keep the room looking IDENTICAL to the reference image

${hasCustomPresenter ? `REFERENCE IMAGE 2 (Presenter): This is the person who should appear as the presenter.
- The presenter should look EXACTLY like the person in this reference image
- Same face, same appearance
- The presenter stands in the room and gestures toward features` : 'A professional presenter should appear in the room to explain features.'}

The presenter speaks this dialogue in ${language}: "${script}"

CRITICAL: 
- The room must look EXACTLY like Reference Image 1
- ${hasCustomPresenter ? 'The presenter must look EXACTLY like Reference Image 2' : ''}
- Keep camera mostly static, focused on the room
- Presenter points at and explains features visible in the room
- Do NOT show any areas not visible in the room reference image`;

  // Build reference images array
  const referenceImages = [];

  // Reference 1: Property photo (the room)
  const propertyPhotoBase64 = propertyPhotos[0].replace(/^data:image\/\w+;base64,/, '');
  referenceImages.push({
    image: {
      imageBytes: propertyPhotoBase64,
      mimeType: 'image/jpeg',
    },
    referenceType: VideoGenerationReferenceType.ASSET,
  });

  // Reference 2: Custom presenter (if uploaded)
  if (hasCustomPresenter) {
    const presenterBase64 = avatarImage.replace(/^data:image\/\w+;base64,/, '');
    referenceImages.push({
      image: {
        imageBytes: presenterBase64,
        mimeType: 'image/jpeg',
      },
      referenceType: VideoGenerationReferenceType.ASSET,
    });
  }

  console.log('Starting video generation with Veo 3.1...');
  console.log('- Reference images count:', referenceImages.length);
  console.log('- Reference 1: Property photo');
  console.log('- Reference 2:', hasCustomPresenter ? 'Custom presenter' : 'None (AI will generate presenter)');

  // Build the config - reference images require 8 seconds
  const config: Record<string, unknown> = {
    aspectRatio: '16:9',
    durationSeconds: 8,
    personGeneration: 'allow_adult',
    referenceImages: referenceImages,
  };

  // Start video generation with Veo 3.1 using reference images only (no starting frame)
  let operation = await ai.models.generateVideos({
    model: 'veo-3.1-generate-preview',
    prompt: videoPrompt,
    config: config,
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
  return {
    videoUrl: generatedVideo.video.uri || '',
  };
}

export async function downloadVideo(videoFile: { uri?: string }): Promise<Blob> {
  if (!ai) {
    throw new Error('Google AI API key not configured');
  }

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
