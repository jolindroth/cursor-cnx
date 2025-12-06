import { NextResponse } from 'next/server';
import { ai } from '@/lib/genai';
import * as fs from 'fs';
import * as path from 'path';

const avatarPrompts = [
  {
    id: 'sarah',
    prompt: 'Professional headshot portrait of a friendly woman in her 30s with light brown hair, wearing a navy blue blazer, warm smile, professional real estate agent look, studio lighting, white background, high quality photo',
  },
  {
    id: 'james',
    prompt: 'Professional headshot portrait of a confident Asian man in his 40s with short black hair, wearing a dark grey suit, friendly expression, luxury real estate specialist look, studio lighting, white background, high quality photo',
  },
  {
    id: 'emma',
    prompt: 'Professional headshot portrait of an energetic young woman in her late 20s with dark curly hair, wearing a teal blouse, bright genuine smile, modern real estate agent look, studio lighting, white background, high quality photo',
  },
  {
    id: 'michael',
    prompt: 'Professional headshot portrait of a distinguished man in his 50s with grey hair, wearing a classic navy suit and tie, trustworthy expression, senior real estate executive look, studio lighting, white background, high quality photo',
  },
];

export async function POST() {
  if (!ai) {
    return NextResponse.json({ error: 'AI not configured' }, { status: 500 });
  }

  const results: { id: string; success: boolean; error?: string }[] = [];

  for (const avatar of avatarPrompts) {
    try {
      console.log(`Generating avatar for ${avatar.id}...`);

      // Use Gemini 2.5 Flash Image (Nano Banana) for image generation
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: avatar.prompt,
        config: {
          responseModalities: ['IMAGE'],
        },
      });

      // Extract the image from the response
      const parts = response.candidates?.[0]?.content?.parts;
      if (parts && parts.length > 0) {
        for (const part of parts) {
          if (part.inlineData?.data) {
            const outputDir = path.join(process.cwd(), 'public/avatars');

            // Create directory if it doesn't exist
            if (!fs.existsSync(outputDir)) {
              fs.mkdirSync(outputDir, { recursive: true });
            }

            const outputPath = path.join(outputDir, `${avatar.id}.jpg`);

            // Convert base64 to buffer and save
            const buffer = Buffer.from(part.inlineData.data, 'base64');
            fs.writeFileSync(outputPath, buffer);

            console.log(`✓ Saved ${avatar.id}.jpg`);
            results.push({ id: avatar.id, success: true });
            break;
          }
        }
      } else {
        results.push({ id: avatar.id, success: false, error: 'No image in response' });
      }

      // Small delay between requests
      await new Promise((resolve) => setTimeout(resolve, 2000));
    } catch (error) {
      console.error(`Error generating ${avatar.id}:`, error);
      results.push({
        id: avatar.id,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  return NextResponse.json({
    message: 'Avatar generation complete',
    results,
  });
}
