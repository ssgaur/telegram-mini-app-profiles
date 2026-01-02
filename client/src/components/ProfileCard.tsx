import { UserProfile } from '@/lib/mockProfiles';
import { MessageCircle, UserPlus } from 'lucide-react';
import { useState } from 'react';

interface ProfileCardProps {
  profile: UserProfile;
  onSelect?: (profile: UserProfile) => void;
  onMessage?: (profile: UserProfile) => void;
  onAddFriend?: (profile: UserProfile) => void;
}

const statusColors = {
  online: 'bg-green-500',
  away: 'bg-yellow-500',
  offline: 'bg-gray-400',
};

const statusLabels = {
  online: 'Online',
  away: 'Away',
  offline: 'Offline',
};

export function ProfileCard({
  profile,
  onSelect,
  onMessage,
  onAddFriend,
}: ProfileCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="group relative overflow-hidden rounded-lg border border-border bg-card transition-all duration-300 hover:shadow-lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onSelect?.(profile)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onSelect?.(profile);
        }
      }}
    >
      {/* Background gradient overlay on hover */}
      <div
        className={`absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : ''
        }`}
      />

      {/* Main content */}
      <div className="relative p-4">
        {/* Header with avatar and status */}
        <div className="mb-3 flex items-start gap-3">
          <div className="relative flex-shrink-0">
            <img
              src={profile.avatar}
              alt={profile.name}
              className="h-12 w-12 rounded-full object-cover ring-2 ring-primary/20"
            />
            {/* Status indicator */}
            <div
              className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-card ${
                statusColors[profile.status]
              }`}
            />
          </div>

          {/* Name and username */}
          <div className="min-w-0 flex-1">
            <h3 className="truncate font-semibold text-card-foreground">
              {profile.name}
            </h3>
            <p className="truncate text-sm text-muted-foreground">
              {profile.username}
            </p>
          </div>
        </div>

        {/* Status text */}
        <p className="mb-2 text-xs font-medium text-muted-foreground">
          {profile.statusText}
        </p>

        {/* Bio */}
        <p className="mb-3 line-clamp-2 text-sm text-foreground/80">
          {profile.bio}
        </p>

        {/* Mutual friends */}
        <div className="mb-3 flex items-center gap-1 text-xs text-muted-foreground">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary" />
          {profile.mutualFriends} mutual friends
        </div>

        {/* Action buttons - visible on hover or always on mobile */}
        <div
          className={`flex gap-2 transition-all duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0 md:opacity-0'
          }`}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMessage?.(profile);
            }}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-md bg-primary/10 px-3 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/20 active:scale-95"
            aria-label={`Message ${profile.name}`}
          >
            <MessageCircle className="h-4 w-4" />
            <span className="hidden sm:inline">Message</span>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddFriend?.(profile);
            }}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-md bg-secondary/10 px-3 py-2 text-sm font-medium text-secondary transition-colors hover:bg-secondary/20 active:scale-95"
            aria-label={`Add ${profile.name}`}
          >
            <UserPlus className="h-4 w-4" />
            <span className="hidden sm:inline">Add</span>
          </button>
        </div>

        {/* Mobile action buttons - always visible */}
        <div className="mt-3 flex gap-2 md:hidden">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMessage?.(profile);
            }}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-md bg-primary/10 px-3 py-2 text-sm font-medium text-primary transition-colors active:scale-95"
            aria-label={`Message ${profile.name}`}
          >
            <MessageCircle className="h-4 w-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddFriend?.(profile);
            }}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-md bg-secondary/10 px-3 py-2 text-sm font-medium text-secondary transition-colors active:scale-95"
            aria-label={`Add ${profile.name}`}
          >
            <UserPlus className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
