
import { Episode } from "@/lib/types";
import { EpisodeStatus } from "@/lib/enums";
import { Json } from "@/integrations/supabase/types";

/**
 * Data Transfer Object for creating a new episode
 * Contains only the fields required for episode creation
 */
export interface CreateEpisodeDTO {
  title: string;
  episodeNumber: number;
  introduction: string;
  scheduled: string;
  status?: EpisodeStatus;
  topic?: string;
  notes?: string;
  coverArt?: string;
  guestIds?: string[];
  publishDate?: string;
  resources?: Array<{
    label: string;
    url: string;
    description?: string;
  }>;
  podcastUrls?: {
    spotify?: string;
    applePodcasts?: string;
    amazonPodcasts?: string;
    youtube?: string;
  };
  recordingLinks?: {
    audio?: string;
    video?: string;
    transcript?: string;
    other?: { label: string; url: string }[];
  };
}

/**
 * Data Transfer Object for updating an episode
 */
export type UpdateEpisodeDTO = Partial<Episode>;

/**
 * Database representation of an Episode
 */
export interface DBEpisode {
  id?: string;
  title: string;
  episode_number: number;
  scheduled: string;
  publish_date?: string | null;
  status: string;
  introduction: string;
  notes?: string | null;
  notes_versions?: Json | null;
  introduction_versions?: Json | null;
  cover_art?: string | null;
  topic?: string | null;
  user_id: string;
  podcast_urls?: Json | null;
  recording_links?: Json | null;
  resources?: Json | null;
  created_at?: string;
  updated_at?: string;
}
