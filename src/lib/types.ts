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
}

export interface Episode {
  id: string;
  title: string;
  episodeNumber: number;
  topic: string;
  description?: string;
  coverArt?: string;
  guestIds: string[];
  createdAt: string;
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
