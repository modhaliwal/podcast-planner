
import { ContentVersion, PodcastUrls, RecordingLinks, Resource } from "@/lib/types";
import { Json } from "@/integrations/supabase/types";

export type EpisodeStatus = 'scheduled' | 'recorded' | 'published';

/**
 * Database representation of Episode
 */
export interface DBEpisode {
  id: string;
  title: string;
  episode_number: number;
  description: string | null;
  topic: string | null;
  cover_art: string | null;
  scheduled: string;
  publish_date: string | null;
  status: EpisodeStatus;
  introduction: string | null;
  notes: string | null;
  notes_versions: ContentVersion[] | null;
  introduction_versions: ContentVersion[] | null;
  recording_links: RecordingLinks | null;
  podcast_urls: PodcastUrls | null;
  resources: Resource[] | null;
  created_at: string;
  updated_at: string;
  episode_guests?: { guest_id: string }[];
}

/**
 * DTO for creating a new Episode
 */
export interface CreateEpisodeDTO {
  title: string;
  episodeNumber: number;
  description?: string;
  topic?: string;
  coverArt?: string;
  guestIds: string[];
  scheduled: string;
  publishDate?: string;
  status: EpisodeStatus;
  introduction: string;
  notes?: string;
  notesVersions?: ContentVersion[];
  introductionVersions?: ContentVersion[];
  recordingLinks?: RecordingLinks;
  podcastUrls?: PodcastUrls;
  resources?: Resource[];
}

/**
 * DTO for updating an Episode
 */
export interface UpdateEpisodeDTO {
  title?: string;
  episodeNumber?: number;
  description?: string;
  topic?: string;
  coverArt?: string;
  guestIds?: string[];
  scheduled?: string;
  publishDate?: string;
  status?: EpisodeStatus;
  introduction?: string;
  notes?: string;
  notesVersions?: ContentVersion[];
  introductionVersions?: ContentVersion[];
  recordingLinks?: RecordingLinks;
  podcastUrls?: PodcastUrls;
  resources?: Resource[];
}
