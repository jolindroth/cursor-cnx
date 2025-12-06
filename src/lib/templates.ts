import { VideoStyle } from '@/types';

export const videoStyles: VideoStyle[] = [
  {
    id: 'luxury',
    name: 'Luxury Showcase',
    description: 'Elegant, cinematic presentation with slow panning shots and sophisticated narration',
    thumbnail: '🏛️',
    prompt: `Create a luxurious, cinematic real estate video. The presenter should walk through the property with elegance and poise, highlighting premium features with measured, sophisticated commentary. Use slow, sweeping camera movements that emphasize space and quality finishes. The atmosphere should feel exclusive and aspirational.`,
  },
  {
    id: 'quick-tour',
    name: 'Quick Tour',
    description: 'Energetic, fast-paced walkthrough highlighting key features',
    thumbnail: '⚡',
    prompt: `Create an energetic, fast-paced property tour video. The presenter should move dynamically through the space, pointing out key features with enthusiasm and brevity. Quick cuts between rooms, upbeat pacing, and highlights of the most impressive features. Perfect for social media and capturing attention quickly.`,
  },
  {
    id: 'lifestyle',
    name: 'Lifestyle Focus',
    description: 'Warm, inviting atmosphere showing how life would feel in this home',
    thumbnail: '🏡',
    prompt: `Create a warm, lifestyle-focused real estate video. The presenter should help viewers imagine living in this space, describing morning coffee routines, family gatherings, and everyday moments. Soft, natural lighting feel. Focus on how the space supports daily life and creates memories.`,
  },
  {
    id: 'professional',
    name: 'Professional Listing',
    description: 'Formal, fact-focused presentation with detailed specifications',
    thumbnail: '📋',
    prompt: `Create a professional, detailed property listing video. The presenter should systematically cover each room and feature, providing specific details about square footage, materials, and amenities. Clear, organized presentation style with comprehensive coverage of all property aspects. Ideal for serious buyers wanting complete information.`,
  },
];

