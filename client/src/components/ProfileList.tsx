import { UserProfile, filterProfilesByStatus, searchProfiles } from '@/lib/mockProfiles';
import { Search, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { ProfileCard } from './ProfileCard';

interface ProfileListProps {
  profiles: UserProfile[];
  onSelectProfile?: (profile: UserProfile) => void;
  onMessageProfile?: (profile: UserProfile) => void;
  onAddFriend?: (profile: UserProfile) => void;
}

type StatusFilter = 'all' | 'online' | 'away' | 'offline';

export function ProfileList({
  profiles,
  onSelectProfile,
  onMessageProfile,
  onAddFriend,
}: ProfileListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  // Filter and search profiles
  const filteredProfiles = useMemo(() => {
    let result = profiles;

    // Apply status filter
    if (statusFilter !== 'all') {
      result = filterProfilesByStatus(statusFilter);
    }

    // Apply search filter
    if (searchQuery.trim()) {
      result = result.filter(profile =>
        profile.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        profile.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        profile.bio.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return result;
  }, [profiles, searchQuery, statusFilter]);

  const statusFilterOptions: { label: string; value: StatusFilter }[] = [
    { label: 'All', value: 'all' },
    { label: 'Online', value: 'online' },
    { label: 'Away', value: 'away' },
    { label: 'Offline', value: 'offline' },
  ];

  return (
    <div className="flex flex-col gap-4">
      {/* Search bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search profiles..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-lg border border-input bg-background pl-10 pr-10 py-2 text-sm placeholder-muted-foreground transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Status filter tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {statusFilterOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => setStatusFilter(option.value)}
            className={`whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              statusFilter === option.value
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary/50 text-secondary-foreground hover:bg-secondary'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* Results count */}
      <div className="text-sm text-muted-foreground">
        {filteredProfiles.length} profile{filteredProfiles.length !== 1 ? 's' : ''} found
      </div>

      {/* Profiles grid */}
      {filteredProfiles.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProfiles.map((profile) => (
            <ProfileCard
              key={profile.id}
              profile={profile}
              onSelect={onSelectProfile}
              onMessage={onMessageProfile}
              onAddFriend={onAddFriend}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-secondary/30 py-12">
          <Search className="mb-3 h-8 w-8 text-muted-foreground/50" />
          <p className="text-center text-sm font-medium text-muted-foreground">
            No profiles found
          </p>
          <p className="text-center text-xs text-muted-foreground/70">
            Try adjusting your search or filters
          </p>
        </div>
      )}
    </div>
  );
}
