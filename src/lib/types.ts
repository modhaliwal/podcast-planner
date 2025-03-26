
import { EpisodeStatus } from './enums';

export interface SocialLinks {
  twitter?: string; // Keeping for backward compatibility, now represents X
  facebook?: string;
  linkedin?: string;
  instagram?: string;
  tiktok?: string;
  website?: string;
  youtube?: string;
  other?: { label: string; url: string }[];
}

export interface ContentVersion {
  id: string;
  content: string;
  timestamp: string;
  source: 'manual' | 'ai' | 'import';
  active?: boolean; // Added active flag to track which version is active
  versionNumber: number; // Added sequential version number
}

export interface Guest {
  id: string;
  name: string;
  title: string;
  company?: string;
  email?: string;
  phone?: string;
  bio: string;
  bioVersions?: ContentVersion[];
  imageUrl?: string;
  socialLinks: SocialLinks;
  notes?: string;
  // @deprecated - Kept for backward compatibility
  backgroundResearch?: string;
  backgroundResearchVersions?: ContentVersion[];
  status?: 'potential' | 'contacted' | 'confirmed' | 'appeared';
  createdAt: string;
  updatedAt: string;
}

export interface RecordingLinks {
  audio?: string;
  video?: string;
  transcript?: string;
  other?: { label: string; url: string }[];
}

export interface PodcastUrls {
  spotify?: string;
  applePodcasts?: string;
  amazonPodcasts?: string;
  youtube?: string;
}

export interface Resource {
  label: string;
  url: string;
  description?: string;
}

export interface Episode {
  id: string;
  episodeNumber: number;
  title: string;
  topic?: string;       // Added topic field
  scheduled: string;    // Recording session date and time
  publishDate?: string; // Date the episode will be published
  status: EpisodeStatus;
  coverArt?: string;    // URL to the cover art image
  guestIds: string[];
  introduction: string;
  notes: string;
  notesVersions?: ContentVersion[]; // Added notesVersions field
  recordingLinks?: RecordingLinks;
  podcastUrls?: PodcastUrls;
  resources?: Resource[]; // Added resources field
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  created_at: string;
  last_sign_in?: string;
}
