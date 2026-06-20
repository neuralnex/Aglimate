# Aglimate - Farmer-First Climate Advisory

A mobile-first Next.js application providing AI-powered agricultural advice for Nigerian smallholder farmers.

## Overview

Aglimate helps farmers with:
- **Climate Advisory**: Get personalized farming advice based on your crop, location, and photos
- **Chat**: Ask questions in natural language about farming practices
- **Weather**: Check current weather, forecasts, and alerts for your area
- **Knowledge Base**: Browse articles on crops, livestock, soil, pests, weather, and market information

## Features

- **Mobile-First Design**: Optimized for mobile devices with touch-friendly interfaces
- **Offline Support**: Works with limited connectivity (chats sync when reconnected)
- **Multi-Language**: Supports English, Hausa, Igbo, Yoruba, Nigerian Pidgin, and more
- **Responsive**: Adapts seamlessly from mobile to desktop
- **Accessible**: WCAG-compliant with proper touch targets (≥44px)

## Tech Stack

- **Framework**: Next.js 15
- **UI Library**: Tailwind CSS
- **Icons**: Lucide React
- **State Management**: Zustand
- **TypeScript**: Full type safety
- **PWA**: Progressive Web App support

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/neuralnex/Aglimate.git
   cd Aglimate
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your API endpoint
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

## Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API endpoint | `` |

### Tailwind CSS

Customize colors, fonts, and spacing in `tailwind.config.js`:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#2E7D32',    // Green
        accent: '#FF8F00',     // Orange
        // ...
      }
    }
  }
}
```

## Project Structure

```
aglimate-frontend/
├── public/                 # Static assets
│   ├── manifest.json      # PWA manifest
│   └── icon-192x192.png  # App icon
├── src/
│   ├── app/               # Next.js App Router pages
│   │   ├── advisory/      # Climate advisory feature
│   │   ├── chat/         # Chat interface
│   │   ├── knowledge/    # Knowledge base
│   │   ├── settings/     # App settings
│   │   ├── weather/      # Weather information
│   │   ├── globals.css   # Global styles
│   │   └── layout.tsx    # Root layout
│   ├── components/
│   │   ├── chat/         # Chat components
│   │   ├── layout/       # Layout components (Header, BottomNav)
│   │   ├── ui/           # UI components (Button, Card, Input)
│   │   └── weather/      # Weather components
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility functions and stores
│   └── types/            # TypeScript types
├── .gitignore            # Git ignore rules
├── next.config.js        # Next.js configuration
├── tailwind.config.js    # Tailwind configuration
├── tsconfig.json         # TypeScript configuration
└── README.md             # This file
```

## Mobile UX Best Practices

This project follows mobile-first design principles:

1. **Touch Targets**: All interactive elements have minimum 44x44px tap areas
2. **Typography**: Font sizes scale appropriately (16px base, responsive scaling)
3. **Spacing**: Tighter spacing on mobile, more generous on desktop
4. **Navigation**: Bottom navigation bar for mobile, top navigation for desktop
5. **Safe Areas**: Proper insets for notched devices (iPhone X, etc.)
6. **Performance**: Optimized for slow networks and low-end devices

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Create production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

## API Integration

The app integrates with the Aglimate backend API for:

- `/ask` - Chat with AI assistant
- `/advise` - Get climate advisory
- `/weather/current` - Current weather data
- `/weather/forecast` - Weather forecast
- `/weather-alerts` - Weather alerts

## Browser Support

- Chrome (recommended)
- Firefox
- Safari (iOS)
- Edge

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

MIT License - see LICENSE file for details.

## Contact

For questions or feedback, please contact the development team.

---

Built with ❤️ for Nigerian farmers by NeuralNex
