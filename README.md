# RealEstate Video Generator

An AI-powered application that generates professional real estate marketing videos using Google's Gemini and Veo 3.1 models.

## Features

- **Photo Upload**: Upload multiple property photos with drag-and-drop support
- **Presenter Selection**: Choose from predefined avatars or upload a custom presenter image
- **Video Styles**: Select from different video styles (Luxury, Quick Tour, Lifestyle, Professional)
- **AI-Powered Generation**: 
  - Gemini analyzes property photos and generates descriptions
  - Veo 3.1 creates marketing videos with the presenter walking through the property

## Getting Started

### Prerequisites

- Node.js 18+ 
- Google AI API key (get one at [Google AI Studio](https://aistudio.google.com/apikey))

### Installation

1. Install dependencies:

```bash
npm install
```

2. Configure environment variables:

Copy `.env.example` to `.env.local` and add your Google AI API key:

```bash
GOOGLE_AI_API_KEY=your_api_key_here
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/
│   ├── page.tsx                  # Main editor layout
│   ├── api/
│   │   ├── analyze/route.ts      # Gemini image analysis
│   │   ├── generate-script/route.ts  # Generate presenter script
│   │   └── generate-video/route.ts   # Veo 3.1 video generation
│   └── layout.tsx
├── components/
│   ├── layout/
│   │   ├── EditorLayout.tsx      # Split-screen container
│   │   ├── Sidebar.tsx           # Left panel with all controls
│   │   └── PreviewPanel.tsx      # Right panel for video output
│   ├── sidebar/
│   │   ├── PhotoUploader.tsx     # Property photo upload section
│   │   ├── AvatarSelector.tsx    # Presenter selection section
│   │   └── StyleSelector.tsx     # Video style section
│   ├── preview/
│   │   ├── VideoPlayer.tsx       # Video playback
│   │   ├── EmptyState.tsx        # Placeholder before generation
│   │   └── GeneratingState.tsx   # Loading/progress state
│   └── ui/                       # shadcn components
├── lib/
│   ├── genai.ts                  # GenAI SDK config
│   ├── templates.ts              # Style template definitions
│   └── avatars.ts                # Predefined avatar data
└── types/
    └── index.ts                  # TypeScript interfaces
```

## Tech Stack

- **Framework**: Next.js 14 with App Router and TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **AI**: Google Generative AI SDK (`@google/generative-ai`)
- **Video Generation**: Veo 3.1 via Google GenAI SDK
- **File Handling**: React Dropzone

## Usage

1. **Upload Property Photos**: Drag and drop or click to upload images of the property
2. **Select Presenter**: Choose a predefined avatar or upload your own presenter image
3. **Choose Video Style**: Select the style that matches your marketing goals
4. **Generate**: Click "Generate Video" to create your AI-powered marketing video
5. **Download**: Preview and download the finished video

## Note on Veo 3.1 Integration

The Veo 3.1 video generation API integration is prepared as a placeholder. You'll need to update the `src/lib/genai.ts` file with the actual Veo 3.1 API configuration once you have access to the service. The current implementation demonstrates the expected flow and can be adapted based on the official Veo API documentation.

## License

MIT
