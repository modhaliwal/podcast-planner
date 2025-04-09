
import { EpisodeStatus } from './lib/enums';

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

export interface Guest {
  id: string;
  name: string;
  title: string;
  company?: string;
  email?: string;
  phone?: string;
  bio: string;
  imageUrl?: string;
  socialLinks: SocialLinks;
  notes?: string;
  backgroundResearch?: string;  
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
  topic?: string;       
  scheduled: string;    
  publishDate?: string; 
  status: EpisodeStatus;
  coverArt?: string;    
  guestIds: string[];
  introduction: string;
  notes: string;
  recordingLinks?: RecordingLinks;
  podcastUrls?: PodcastUrls;
  resources?: Resource[];  
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
