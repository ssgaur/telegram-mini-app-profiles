import { ProfileList } from '@/components/ProfileList';
import { useTelegram } from '@/hooks/useTelegram';
import { mockProfiles } from '@/lib/mockProfiles';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

/**
 * Profiles Page - Displays the profile list (moved from Home)
 * This is now shown in the Home tab of the bottom navigation
 */
export default function Profiles() {
  const { webApp, user, theme, isReady, showMainButton, hideMainButton, triggerHaptic } =
    useTelegram();
  const [selectedProfile, setSelectedProfile] = useState<string | null>(null);

  // Apply theme to document
  useEffect(() => {
    if (isReady) {
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [theme, isReady]);

  // Handle profile selection
  const handleSelectProfile = (profile: any) => {
    setSelectedProfile(profile.id);
    triggerHaptic('light');
    toast.success(`Selected ${profile.name}`, {
      description: profile.username,
    });
  };

  // Handle message action
  const handleMessage = (profile: any) => {
    triggerHaptic('success');
    toast.success(`Message sent to ${profile.name}`, {
      description: 'Opening chat...',
    });
  };

  // Handle add friend action
  const handleAddFriend = (profile: any) => {
    triggerHaptic('success');
    toast.success(`Friend request sent to ${profile.name}`, {
      description: 'Waiting for acceptance...',
    });
  };

  // Show main button when a profile is selected
  useEffect(() => {
    if (selectedProfile) {
      showMainButton('View Profile', () => {
        const profile = mockProfiles.find(p => p.id === selectedProfile);
        if (profile) {
          triggerHaptic('medium');
          toast.info(`Viewing ${profile.name}'s profile`, {
            description: 'Full profile details would load here',
          });
        }
      });
    } else {
      hideMainButton();
    }
  }, [selectedProfile, showMainButton, hideMainButton, triggerHaptic]);

  if (!isReady) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/75">
        <div className="container flex items-center justify-between px-4 py-4">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-foreground">Profiles</h1>
            <p className="text-sm text-muted-foreground">
              {user?.first_name ? `Welcome, ${user.first_name}!` : 'Browse user profiles'}
            </p>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container px-4 py-6">
        <ProfileList
          profiles={mockProfiles}
          onSelectProfile={handleSelectProfile}
          onMessageProfile={handleMessage}
          onAddFriend={handleAddFriend}
        />
      </main>

      {/* Footer info */}
      <footer className="border-t border-border bg-secondary/30 py-4 mt-8">
        <div className="container px-4 text-center text-xs text-muted-foreground">
          <p>Telegram Mini App • {theme === 'dark' ? 'Dark' : 'Light'} Mode</p>
          <p className="mt-1">{mockProfiles.length} profiles available</p>
        </div>
      </footer>
    </div>
  );
}
