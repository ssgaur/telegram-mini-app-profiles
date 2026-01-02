export interface UserProfile {
  id: string;
  name: string;
  username: string;
  avatar: string;
  status: 'online' | 'offline' | 'away';
  statusText: string;
  bio: string;
  mutualFriends: number;
  lastSeen?: string;
}

export const mockProfiles: UserProfile[] = [
  {
    id: '1',
    name: 'Alex Johnson',
    username: '@alexjohnson',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    status: 'online',
    statusText: 'Active now',
    bio: 'Product designer | Coffee enthusiast | Always learning',
    mutualFriends: 12,
    lastSeen: 'now',
  },
  {
    id: '2',
    name: 'Sarah Chen',
    username: '@sarahchen',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
    status: 'online',
    statusText: 'Active 5m ago',
    bio: 'Software engineer | Open source contributor',
    mutualFriends: 8,
    lastSeen: '5m',
  },
  {
    id: '3',
    name: 'Marcus Williams',
    username: '@marcuswilliams',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
    status: 'away',
    statusText: 'Away',
    bio: 'Entrepreneur | Tech investor | Podcast host',
    mutualFriends: 15,
    lastSeen: '1h',
  },
  {
    id: '4',
    name: 'Emma Rodriguez',
    username: '@emmarodriguez',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
    status: 'offline',
    statusText: 'Offline',
    bio: 'Designer & illustrator | Art lover',
    mutualFriends: 6,
    lastSeen: '3h',
  },
  {
    id: '5',
    name: 'David Park',
    username: '@davidpark',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    status: 'online',
    statusText: 'Active now',
    bio: 'Data scientist | Machine learning enthusiast',
    mutualFriends: 10,
    lastSeen: 'now',
  },
  {
    id: '6',
    name: 'Lisa Thompson',
    username: '@lisathompson',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
    status: 'offline',
    statusText: 'Offline',
    bio: 'Marketing strategist | Content creator',
    mutualFriends: 9,
    lastSeen: '2h',
  },
  {
    id: '7',
    name: 'James Mitchell',
    username: '@jamesmitchell',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
    status: 'away',
    statusText: 'Away',
    bio: 'Full-stack developer | Gaming enthusiast',
    mutualFriends: 7,
    lastSeen: '30m',
  },
  {
    id: '8',
    name: 'Nina Patel',
    username: '@ninapatel',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
    status: 'online',
    statusText: 'Active 10m ago',
    bio: 'UX researcher | Psychology nerd',
    mutualFriends: 11,
    lastSeen: '10m',
  },
];

export function getProfileById(id: string): UserProfile | undefined {
  return mockProfiles.find(profile => profile.id === id);
}

export function searchProfiles(query: string): UserProfile[] {
  const lowerQuery = query.toLowerCase();
  return mockProfiles.filter(profile =>
    profile.name.toLowerCase().includes(lowerQuery) ||
    profile.username.toLowerCase().includes(lowerQuery) ||
    profile.bio.toLowerCase().includes(lowerQuery)
  );
}

export function filterProfilesByStatus(status: 'online' | 'offline' | 'away' | 'all'): UserProfile[] {
  if (status === 'all') return mockProfiles;
  return mockProfiles.filter(profile => profile.status === status);
}
