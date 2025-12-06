/**
 * Script to generate presenter avatar images using Google's Imagen API
 * Run with: npx ts-node scripts/generate-avatars.ts
 */

import { GoogleGenAI } from '@google/genai';
import * as fs from 'fs';
import * as path from 'path';

const apiKey = process.env.GOOGLE_AI_API_KEY;

if (!apiKey) {
  console.error('GOOGLE_AI_API_KEY environment variable is required');
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey });

const avatars = [
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

async function generateAvatar(id: string, prompt: string): Promise<void> {
  console.log(`Generating avatar for ${id}...`);

  try {
    const response = await ai.models.generateImages({
      model: 'imagen-3.0-generate-002',
      prompt: prompt,
      config: {
        numberOfImages: 1,
        aspectRatio: '1:1',
      },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
      const imageData = response.generatedImages[0].image;
      
      if (imageData?.imageBytes) {
        const outputDir = path.join(__dirname, '../public/avatars');
        
        // Create directory if it doesn't exist
        if (!fs.existsSync(outputDir)) {
          fs.mkdirSync(outputDir, { recursive: true });
        }

        const outputPath = path.join(outputDir, `${id}.jpg`);
        
        // Convert base64 to buffer and save
        const buffer = Buffer.from(imageData.imageBytes, 'base64');
        fs.writeFileSync(outputPath, buffer);
        
        console.log(`✓ Saved ${id}.jpg`);
      }
    }
  } catch (error) {
    console.error(`Error generating ${id}:`, error);
  }
}

async function main() {
  console.log('Starting avatar generation...\n');

  for (const avatar of avatars) {
    await generateAvatar(avatar.id, avatar.prompt);
    // Small delay between requests
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }

  console.log('\nDone! Avatar images saved to public/avatars/');
}

main();

