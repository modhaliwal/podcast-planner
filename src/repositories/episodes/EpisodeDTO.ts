
import { Json } from "@/integrations/supabase/types";
import { EpisodeStatus } from "@/lib/enums";

export interface DBEpisode {
  id?: string;
  episode_number: number;
  title: string;
  topic?: string | null;
  scheduled: string;
  publish_date?: string | null;
  status: string;
  cover_art?: string | null;
  introduction: string;
  notes?: string | null;
  notes_versions?: Json | null;
  introduction_versions?: Json | null;
  recording_links?: Json | null;
  podcast_urls?: Json | null;
  resources?: Json | null;
  created_at?: string;
  updated_at?: string;
  user_id: string;
}

export interface CreateEpisodeDTO {
  episodeNumber: number;
  title: string;
  topic?: string;
  introduction: string;
  scheduled: string;
  status?: EpisodeStatus;
  publishDate?: string;
  coverArt?: string;
  notes?: string;
  resources?: any[];
  podcastUrls?: Record<string, string | null>;
  recordingLinks?: Record<string, string>;
}

export interface UpdateEpisodeDTO {
  episodeNumber?: number;
  title?: string;
  topic?: string;
  introduction?: string;
  scheduled?: string;
  status?: EpisodeStatus;
  publishDate?: string;
  coverArt?: string;
  notes?: string;
  notesVersions?: any[];
  introductionVersions?: any[];
  resources?: any[];
  podcastUrls?: Record<string, string | null>;
  recordingLinks?: Record<string, string>;
}
