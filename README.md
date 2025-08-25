# ToneMatch.ai

AI-powered guitar tone matching that adapts any guitar tone to your gear.

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy the environment example file:
   ```bash
   cp env.example .env.local
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

The app will be available at [http://localhost:3000](http://localhost:3000).

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## Environment Variables

The following environment variables will be used in future development:

- `OPENAI_API_KEY` - Your OpenAI API key
- `OPENAI_MODEL_RESEARCH` - OpenAI model for research (web search)
- `OPENAI_MODEL_ADAPT` - OpenAI model for tone adaptation

## Future Development

This project will integrate with:
- OpenAI Responses API with web search tool for researching original gear and settings
- OpenAI Structured Outputs for strict JSON responses
- Advanced tone analysis and adaptation algorithms

## Project Structure

```
src/
├── app/                 # Next.js App Router pages
│   ├── app/            # Main application flow
│   ├── status/         # Health check endpoint
│   ├── globals.css     # Global styles
│   └── layout.tsx      # Root layout
├── components/         # React components
│   ├── ui/            # Reusable UI components
│   └── navbar.tsx     # Navigation component
└── lib/               # Utility functions
    ├── cn.ts          # ClassName merge utility
    └── env.ts         # Environment variable utilities
```
