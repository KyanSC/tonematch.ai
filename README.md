# ToneAdapt (beta) 🎸

**AI-powered guitar tone research and adaptation platform**

ToneAdapt (beta) helps guitarists find the exact amp settings and gear configurations used in their favorite songs, then adapts those settings to work with their own equipment.

## ✨ Features

- **🎵 Song Research**: Find original amp settings, guitar knob positions, and gear used in any song
- **🔧 Smart Adaptation**: Automatically adapt settings to your specific gear (guitar, amp, features)
- **🌐 Web Search**: Uses real web data to find accurate, documented settings
- **📊 Confidence Scoring**: See how confident the AI is in the research results
- **🎯 Pickup Guidance**: Get specific pickup selector recommendations
- **⚡ Real-time Processing**: Fast, responsive interface with loading states

## 🚀 Live Demo

[Coming Soon - Deploy to Vercel/Netlify]

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS with custom animations
- **AI**: OpenAI GPT-4o with Responses API + Web Search
- **Database**: Supabase (PostgreSQL) for caching
- **Deployment**: Vercel-ready

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/tonematch.ai.git
   cd tonematch.ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```
   
   Fill in your environment variables:
   ```env
   # OpenAI Configuration
   OPENAI_API_KEY=your_openai_api_key_here
   OPENAI_MODEL_RESEARCH=gpt-4o
   OPENAI_MODEL_ADAPT=gpt-4o
   
   # Supabase Configuration (optional - for caching)
   SUPABASE_URL=your_supabase_url_here
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎯 Usage

1. **Enter a song**: Type the song title and artist name
2. **Select the part**: Choose between "riff" or "solo" section
3. **Run research**: Click "Run Research" to find original settings
4. **Configure your gear**: Select your guitar and amp types
5. **Enable features**: Toggle available features (coil-split, presence, reverb, etc.)
6. **Get adapted settings**: View settings optimized for your gear

## 🔧 API Endpoints

### `/api/research-tone` (POST)
Research original tone settings for a song.

**Request:**
```json
{
  "song": "Sweet Child O' Mine",
  "artist": "Guns N' Roses",
  "part": "riff"
}
```

**Response:**
```json
{
  "ok": true,
  "data": {
    "original_gear": {
      "guitar": "1959 Gibson Les Paul",
      "pickups": "P.A.F. humbuckers",
      "amp": "Marshall JCM800"
    },
    "settings": {
      "gain": 7,
      "bass": 6,
      "mid": 8,
      "treble": 7
    },
    "guitar_knob_settings": {
      "volume": "8",
      "tone": "7"
    },
    "confidence": 0.9,
    "citations": [...]
  }
}
```

### `/api/adapt-tone` (POST)
Adapt original settings to user's gear.

**Request:**
```json
{
  "song": "Sweet Child O' Mine",
  "artist": "Guns N' Roses", 
  "part": "riff",
  "original": {
    "gear": {...},
    "settings": {...},
    "guitar_knob_settings": {...}
  },
  "guitarLabel": "les-paul",
  "ampLabel": "marshall",
  "features": {
    "coilSplit": true,
    "presence": true,
    "reverb": false
  }
}
```

## 🏗️ Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── health/          # Database health check
│   │   ├── research-tone/   # Song research endpoint
│   │   └── adapt-tone/      # Gear adaptation endpoint
│   ├── app/                 # Main application page
│   ├── status/              # Health status page
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Homepage
├── components/
│   ├── ui/                  # Reusable UI components
│   └── navbar.tsx           # Navigation component
└── lib/
    ├── cn.ts                # Utility functions
    ├── env.ts               # Environment validation
    └── supabaseServer.ts    # Database client
```

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect your repository** to Vercel
2. **Set environment variables** in Vercel dashboard
3. **Deploy** - Vercel will automatically detect Next.js

### Manual Deployment

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Start production server**
   ```bash
   npm start
   ```

## 🔒 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `OPENAI_API_KEY` | Your OpenAI API key | ✅ |
| `OPENAI_MODEL_RESEARCH` | Model for research (default: gpt-4o) | ❌ |
| `OPENAI_MODEL_ADAPT` | Model for adaptation (default: gpt-4o) | ❌ |
| `SUPABASE_URL` | Supabase project URL (for caching) | ❌ |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | ❌ |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- OpenAI for providing the AI capabilities
- Supabase for database infrastructure
- Next.js team for the amazing framework
- The guitar community for inspiration

## 📞 Support

If you have any questions or need help, please open an issue on GitHub.

---

**Made with ❤️ for guitarists everywhere**
