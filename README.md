# Telegram Mini App - User Profiles

A modern, feature-rich Telegram Mini App built with React, TypeScript, and Tailwind CSS. Browse and interact with user profiles directly within Telegram with a beautiful, responsive interface.

## Features

- **Profile Browsing**: View a list of user profiles with avatars, status, and bio information
- **Search & Filter**: Search profiles by name, username, or bio; filter by online status
- **Telegram Integration**: Full integration with Telegram's WebApp API for native controls and theme support
- **Responsive Design**: Optimized for mobile, tablet, and desktop viewing
- **Dark/Light Theme Support**: Automatically adapts to the user's Telegram theme preference
- **Haptic Feedback**: Tactile feedback on interactions for enhanced user experience
- **Profile Actions**: Message and add friends directly from the profile card

## Tech Stack

- **Frontend Framework**: React 19 with TypeScript
- **Styling**: Tailwind CSS 4 with shadcn/ui components
- **Routing**: Wouter (lightweight client-side router)
- **UI Components**: Lucide React icons, shadcn/ui
- **Notifications**: Sonner (toast notifications)
- **Build Tool**: Vite
- **Package Manager**: pnpm

## Project Structure

```
client/
├── public/              # Static assets
├── src/
│   ├── components/      # Reusable UI components
│   │   ├── ProfileCard.tsx      # Individual profile card component
│   │   ├── ProfileList.tsx      # Profile list with search/filter
│   │   └── ...
│   ├── hooks/           # Custom React hooks
│   │   └── useTelegram.ts       # Telegram WebApp integration hook
│   ├── lib/             # Utility functions and data
│   │   └── mockProfiles.ts      # Mock profile data
│   ├── pages/           # Page components
│   │   ├── Home.tsx             # Main profile list page
│   │   └── NotFound.tsx
│   ├── contexts/        # React contexts
│   ├── App.tsx          # Main app component with routing
│   ├── main.tsx         # React entry point
│   └── index.css        # Global styles and theme tokens
├── index.html           # HTML template
└── package.json         # Dependencies and scripts
```

## Getting Started

### Prerequisites

- Node.js 18+ and pnpm
- Telegram Desktop or Telegram Web for testing

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd telegram-mini-app-profiles
```

2. Install dependencies:
```bash
pnpm install
```

3. Start the development server:
```bash
pnpm dev
```

The app will be available at `http://localhost:3000`

### Development

The development server includes hot module reloading (HMR) for instant feedback as you make changes.

```bash
pnpm dev      # Start development server
pnpm build    # Build for production
pnpm preview  # Preview production build locally
pnpm check    # Type check with TypeScript
pnpm format   # Format code with Prettier
```

## Telegram Integration

### WebApp API

The app uses the Telegram WebApp API to:

- **Access User Data**: Retrieve the current user's information
- **Theme Support**: Detect and adapt to the user's Telegram theme (light/dark)
- **Native Controls**: Display the Main Button and Back Button
- **Haptic Feedback**: Provide tactile feedback on interactions
- **Expand App**: Automatically expand the mini app to full height

### useTelegram Hook

The custom `useTelegram` hook provides easy access to Telegram WebApp features:

```typescript
const { webApp, user, theme, isReady, showMainButton, triggerHaptic } = useTelegram();

// Show main button with action
showMainButton('Select Profile', () => {
  // Handle button click
});

// Trigger haptic feedback
triggerHaptic('success');
```

## Customization

### Theme Colors

The app uses Telegram's native blue (`#0088cc`) as the primary color. To customize:

1. Edit `client/src/index.css` to change color variables
2. Update the theme in `client/src/App.tsx` if needed

### Profile Data

Mock profiles are stored in `client/src/lib/mockProfiles.ts`. To use real data:

1. Replace the mock data with API calls
2. Update the `UserProfile` interface to match your data structure
3. Modify the search and filter functions accordingly

### Components

All UI components are built with shadcn/ui and can be customized by editing files in `client/src/components/ui/`.

## Deployment

### To Telegram

1. Deploy the app to a public URL (e.g., using Vercel, Netlify, or your own server)
2. Create a Telegram bot using BotFather
3. Set the Mini App URL in the bot settings
4. Users can access the app by opening the bot and tapping the Mini App button

### Build for Production

```bash
pnpm build
```

The production build will be optimized and minified in the `dist/` directory.

## Design Philosophy

The app follows a **Modern Minimalist with Telegram Integration** design approach:

- **Content-First**: Profile cards are the primary focus
- **Telegram Native**: Leverages Telegram's UI patterns and theme system
- **Responsive**: Optimized for all screen sizes
- **Accessible**: Clear visual hierarchy and keyboard navigation support
- **Interactive**: Smooth animations and micro-interactions

## API Reference

### useTelegram Hook

```typescript
interface UseTelegramReturn {
  webApp: TelegramWebApp | null;           // Raw Telegram WebApp object
  user: TelegramUser | null;               // Current user info
  theme: 'light' | 'dark';                 // Current theme
  isReady: boolean;                        // App initialization status
  showMainButton: (text: string, onClick: () => void) => void;
  hideMainButton: () => void;
  showBackButton: (onClick: () => void) => void;
  hideBackButton: () => void;
  triggerHaptic: (type: HapticType) => void;
}
```

### ProfileCard Component

```typescript
interface ProfileCardProps {
  profile: UserProfile;
  onSelect?: (profile: UserProfile) => void;
  onMessage?: (profile: UserProfile) => void;
  onAddFriend?: (profile: UserProfile) => void;
}
```

### ProfileList Component

```typescript
interface ProfileListProps {
  profiles: UserProfile[];
  onSelectProfile?: (profile: UserProfile) => void;
  onMessageProfile?: (profile: UserProfile) => void;
  onAddFriend?: (profile: UserProfile) => void;
}
```

## Browser Support

The app works on:

- Telegram Desktop (Windows, macOS, Linux)
- Telegram Web
- Telegram Mobile (iOS, Android) - via in-app browser

## License

MIT

## Support

For issues, questions, or feature requests, please open an issue on GitHub.

## Resources

- [Telegram Mini Apps Documentation](https://core.telegram.org/bots/webapps)
- [Telegram WebApp API Reference](https://core.telegram.org/bots/webapps#initializing-mini-apps)
- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [shadcn/ui Documentation](https://ui.shadcn.com)
