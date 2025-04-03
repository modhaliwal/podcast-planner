
export interface Guest {
  id: string;
  name: string;
  imageUrl?: string;
  title?: string;
  company?: string;
  location?: string;
  website?: string;
  linkedin?: string;
  twitter?: string;
  bio?: string;
  backgroundResearch?: string;
  notes?: string;
  email?: string;
  phone?: string;
  status?: 'potential' | 'contacted' | 'confirmed' | 'appeared';
  socialLinks: SocialLinks;
  bioVersions?: ContentVersion[];
  backgroundResearchVersions?: ContentVersion[];
  createdAt: string;
  updatedAt: string;
}

export interface Episode {
  id: string;
  title: string;
  episodeNumber: number;
  topic?: string;
  description?: string;
  coverArt?: string;
  guestIds: string[];
  scheduled: string;
  publishDate?: string;
  status: 'scheduled' | 'recorded' | 'published';
  introduction?: string;
  notes?: string;
  notesVersions?: ContentVersion[];
  introductionVersions?: ContentVersion[];
  recordingLinks?: RecordingLinks;
  podcastUrls?: PodcastUrls;
  resources?: Resource[];
  createdAt: string;
  updatedAt: string;
}

export interface Settings {
  id: string;
  userId: string;
  themeMode: 'light' | 'dark' | 'system';
  aiProvider: 'openai' | 'perplexity' | 'none';
}

export interface AIPrompt {
  id: string;
  slug: string;
  title: string;
  prompt_text: string;
  example_output?: string;
  context_instructions?: string;
  system_prompt?: string;
  ai_model: 'openai' | 'perplexity' | 'claude' | 'gemini';
  model_name?: string;
  parameters?: string;
  created_at?: string;
  updated_at?: string;
}

export interface SocialLinks {
  twitter?: string; // Represents X (formerly Twitter)
  facebook?: string;
  linkedin?: string;
  instagram?: string;
  tiktok?: string;
  youtube?: string;
  website?: string;
  other?: { label: string; url: string }[];
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

export interface ContentVersion {
  id: string;
  content: string;
  timestamp: string;
  source: string;
  active?: boolean;
  versionNumber?: number;
}

export enum UsersRoleKey {
  ADMIN = 'admin',
  STANDARD = 'standard'
}

export interface UserRole {
  id: string;
  user_id: string;
  role: UsersRoleKey;
  created_at: string;
}

export interface User {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  created_at: string;
  last_sign_in?: string;
  roles?: UserRole[];
}
