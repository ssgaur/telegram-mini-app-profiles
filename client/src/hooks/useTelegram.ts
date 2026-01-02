import { useEffect, useState } from 'react';

interface TelegramUser {
  id: number;
  is_bot: boolean;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
  added_to_attachment_menu?: boolean;
}

interface TelegramThemeParams {
  bg_color?: string;
  text_color?: string;
  hint_color?: string;
  link_color?: string;
  button_color?: string;
  button_text_color?: string;
  secondary_bg_color?: string;
  header_bg_color?: string;
  accent_text_color?: string;
  section_bg_color?: string;
  section_header_text_color?: string;
  subtitle_text_color?: string;
  destructive_text_color?: string;
}

interface TelegramWebApp {
  initData: string;
  initDataUnsafe: {
    query_id?: string;
    user?: TelegramUser;
    auth_date?: number;
    hash?: string;
  };
  version: string;
  platform: string;
  colorScheme: 'light' | 'dark';
  themeParams: TelegramThemeParams;
  isExpanded: boolean;
  viewportHeight: number;
  viewportStableHeight: number;
  isClosingConfirmationEnabled: boolean;
  headerColor: string;
  backgroundColor: string;
  bottomBarColor: string;
  isVerticalSwipesEnabled: boolean;
  isOrientationLocked: boolean;
  
  ready: () => void;
  expand: () => void;
  close: () => void;
  onEvent: (eventType: string, callback: () => void) => void;
  offEvent: (eventType: string, callback: () => void) => void;
  sendData: (data: string) => void;
  setHeaderColor: (color: string) => void;
  setBackgroundColor: (color: string) => void;
  setBottomBarColor: (color: string) => void;
  enableClosingConfirmation: () => void;
  disableClosingConfirmation: () => void;
  MainButton: {
    text: string;
    color: string;
    textColor: string;
    isVisible: boolean;
    isActive: boolean;
    isProgressVisible: boolean;
    setText: (text: string) => void;
    onClick: (callback: () => void) => void;
    offClick: (callback: () => void) => void;
    show: () => void;
    hide: () => void;
    enable: () => void;
    disable: () => void;
    showProgress: (leaveActive?: boolean) => void;
    hideProgress: () => void;
    setParams: (params: any) => void;
  };
  BackButton: {
    isVisible: boolean;
    onClick: (callback: () => void) => void;
    offClick: (callback: () => void) => void;
    show: () => void;
    hide: () => void;
  };
  HapticFeedback: {
    impactOccurred: (style: 'light' | 'medium' | 'heavy') => void;
    notificationOccurred: (type: 'error' | 'success' | 'warning') => void;
    selectionChanged: () => void;
  };
}

declare global {
  interface Window {
    Telegram?: {
      WebApp: TelegramWebApp;
    };
  }
}

export function useTelegram() {
  const [webApp, setWebApp] = useState<TelegramWebApp | null>(null);
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      
      // Initialize the WebApp
      tg.ready();
      
      // Set the app to expanded mode
      if (!tg.isExpanded) {
        tg.expand();
      }

      // Extract user and theme information
      setWebApp(tg);
      setUser(tg.initDataUnsafe.user || null);
      setTheme(tg.colorScheme as 'light' | 'dark');
      setIsReady(true);

      // Listen for theme changes
      const handleThemeChange = () => {
        setTheme(tg.colorScheme as 'light' | 'dark');
      };

      tg.onEvent('themeChanged', handleThemeChange);

      return () => {
        tg.offEvent('themeChanged', handleThemeChange);
      };
    } else {
      // Fallback for development without Telegram
      setIsReady(true);
    }
  }, []);

  return {
    webApp,
    user,
    theme,
    isReady,
    showMainButton: (text: string, onClick: () => void) => {
      if (webApp?.MainButton) {
        webApp.MainButton.setText(text);
        webApp.MainButton.onClick(onClick);
        webApp.MainButton.show();
      }
    },
    hideMainButton: () => {
      if (webApp?.MainButton) {
        webApp.MainButton.hide();
      }
    },
    showBackButton: (onClick: () => void) => {
      if (webApp?.BackButton) {
        webApp.BackButton.onClick(onClick);
        webApp.BackButton.show();
      }
    },
    hideBackButton: () => {
      if (webApp?.BackButton) {
        webApp.BackButton.hide();
      }
    },
    triggerHaptic: (type: 'light' | 'medium' | 'heavy' | 'success' | 'error' | 'warning') => {
      if (webApp?.HapticFeedback) {
        if (type === 'light' || type === 'medium' || type === 'heavy') {
          webApp.HapticFeedback.impactOccurred(type);
        } else if (type === 'success' || type === 'error' || type === 'warning') {
          webApp.HapticFeedback.notificationOccurred(type);
        }
      }
    },
  };
}
