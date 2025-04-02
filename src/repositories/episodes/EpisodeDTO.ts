
import { Episode } from "@/lib/types";
import { EpisodeStatus } from "@/lib/enums";

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
  publish_date?: string;
  status: string;
  introduction: string;
  notes?: string;
  notes_versions?: any;
  introduction_versions?: any;
  cover_art?: string;
  topic?: string;
  user_id: string;
  podcast_urls?: {
    spotify?: string;
    applePodcasts?: string;
    amazonPodcasts?: string;
    youtube?: string;
  };
  resources?: Array<{
    label: string;
    url: string;
    description?: string;
  }>;
  created_at?: string;
  updated_at?: string;
}
