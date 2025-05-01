
import { ContentVersion, PodcastUrls, RecordingLinks, Resource } from "@/lib/types";
import { Json } from "@/integrations/supabase/types";
import { EpisodeStatus } from "@/lib/enums";

/**
 * Database representation of Episode
 */
export interface DBEpisode {
  id: string;
  title: string;
  episode_number: number;
  description?: string | null;
  topic?: string | null;
  cover_art?: string | null;
  scheduled: string;
  publish_date?: string | null;
  status: string; // Database stores as string (not enum)
  introduction: string | null;  // Must be required as per database schema
  notes?: string | null;
  notes_versions?: Json | null;
  introduction_versions?: Json | null;
  recording_links?: Json | null;
  podcast_urls?: Json | null;
  resources?: Json | null;
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
  guestIds?: string[];
  scheduled: string;
  publishDate?: string;
  status: EpisodeStatus;
  introduction?: string;  // Changed from required to optional
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
  coverArt?: string | null;  // Explicitly allow null for image removal
  guestIds?: string[];
  scheduled?: string;
  publishDate?: string;
  status?: EpisodeStatus;
  introduction?: string | null;  // Explicitly allow null
  notes?: string | null;
  notesVersions?: ContentVersion[];
  introductionVersions?: ContentVersion[];
  recordingLinks?: RecordingLinks;
  podcastUrls?: PodcastUrls;
  resources?: Resource[];
}
