
import { DataMapper } from "../core/DataMapper";
import { Episode } from "@/lib/types";
import { CreateEpisodeDTO, UpdateEpisodeDTO, DBEpisode } from "./EpisodeDTO";
import { EpisodeStatus } from "@/lib/enums";
import { Json } from "@/integrations/supabase/types";
import { ContentVersion } from "@/lib/types";

// Helper function to safely convert Json to ContentVersion array
const toContentVersionArray = (jsonValue: Json | null): ContentVersion[] | undefined => {
  if (!jsonValue) return undefined;
  
  try {
    // If it's already an array, check if it has the right structure
    if (Array.isArray(jsonValue)) {
      // Validate that every item has the required properties
      const isValid = jsonValue.every(item => 
        typeof item === 'object' && 
        item !== null && 
        'id' in item && 
        'content' in item && 
        'timestamp' in item && 
        'source' in item
      );
      
      if (isValid) {
        return jsonValue as ContentVersion[];
      }
    }
    // If it's a string (JSON string), parse it
    else if (typeof jsonValue === 'string') {
      const parsed = JSON.parse(jsonValue);
      if (Array.isArray(parsed)) {
        return parsed as ContentVersion[];
      }
    }
    return undefined;
  } catch (e) {
    console.error("Error converting to ContentVersion array:", e);
    return undefined;
  }
};

/**
 * Maps between Episode domain models and database models
 */
export class EpisodeMapper implements DataMapper<Episode, DBEpisode> {
  /**
   * Maps a database model to a domain model
   */
  toDomain(dbEpisode: DBEpisode): Episode {
    // Use the helper function to convert JSON to ContentVersion arrays
    const notesVersions = toContentVersionArray(dbEpisode.notes_versions);
    const introductionVersions = toContentVersionArray(dbEpisode.introduction_versions);

    // Parse JSON fields for resources, podcast_urls, and recording_links
    let resources = undefined;
    let podcastUrls = undefined;
    let recordingLinks = undefined;

    try {
      if (dbEpisode.resources) {
        resources = dbEpisode.resources as any; // Already handled by Supabase client
      }

      if (dbEpisode.podcast_urls) {
        podcastUrls = dbEpisode.podcast_urls as any;
      }

      if (dbEpisode.recording_links) {
        recordingLinks = dbEpisode.recording_links as any;
      }
    } catch (e) {
      console.error("Error parsing JSON fields for episode", dbEpisode.id, e);
    }
    
    return {
      id: dbEpisode.id || '',
      episodeNumber: dbEpisode.episode_number,
      title: dbEpisode.title,
      topic: dbEpisode.topic || undefined,
      scheduled: dbEpisode.scheduled,
      publishDate: dbEpisode.publish_date || undefined,
      status: dbEpisode.status as EpisodeStatus,
      coverArt: dbEpisode.cover_art || undefined,
      guestIds: [], // This should be populated separately
      introduction: dbEpisode.introduction,
      notes: dbEpisode.notes || '',
      notesVersions: notesVersions,
      introductionVersions: introductionVersions,
      recordingLinks: recordingLinks,
      podcastUrls: podcastUrls,
      resources: resources,
      createdAt: dbEpisode.created_at || '',
      updatedAt: dbEpisode.updated_at || ''
    };
  }
  
  /**
   * Maps a domain model to a database model
   */
  toDB(episode: Partial<Episode>): Partial<DBEpisode> {
    const dbEpisode: Partial<DBEpisode> = {};
    
    if (episode.episodeNumber !== undefined) dbEpisode.episode_number = episode.episodeNumber;
    if (episode.title !== undefined) dbEpisode.title = episode.title;
    if (episode.topic !== undefined) dbEpisode.topic = episode.topic;
    if (episode.scheduled !== undefined) dbEpisode.scheduled = episode.scheduled;
    if (episode.publishDate !== undefined) dbEpisode.publish_date = episode.publishDate;
    if (episode.status !== undefined) dbEpisode.status = episode.status;
    if (episode.coverArt !== undefined) dbEpisode.cover_art = episode.coverArt;
    if (episode.introduction !== undefined) dbEpisode.introduction = episode.introduction;
    if (episode.notes !== undefined) dbEpisode.notes = episode.notes;
    
    // Handle complex JSON fields
    if (episode.recordingLinks !== undefined) {
      dbEpisode.recording_links = episode.recordingLinks as unknown as Json;
    }
    
    if (episode.podcastUrls !== undefined) {
      dbEpisode.podcast_urls = episode.podcastUrls as unknown as Json;
    }
    
    if (episode.resources !== undefined) {
      dbEpisode.resources = episode.resources as unknown as Json;
    }
    
    // Stringify the versions for database storage
    if (episode.notesVersions) {
      dbEpisode.notes_versions = episode.notesVersions as unknown as Json;
    }
    
    if (episode.introductionVersions) {
      dbEpisode.introduction_versions = episode.introductionVersions as unknown as Json;
    }
    
    return dbEpisode;
  }

  /**
   * Maps from CreateEpisodeDTO to database model
   */
  createDtoToDB(dto: CreateEpisodeDTO): DBEpisode {
    return {
      title: dto.title,
      episode_number: dto.episodeNumber,
      introduction: dto.introduction,
      scheduled: dto.scheduled,
      status: dto.status || EpisodeStatus.SCHEDULED,
      topic: dto.topic || null,
      notes: dto.notes || null,
      cover_art: dto.coverArt || null,
      publish_date: dto.publishDate || null,
      resources: dto.resources as unknown as Json || null,
      podcast_urls: dto.podcastUrls as unknown as Json || null,
      recording_links: dto.recordingLinks as unknown as Json || null,
      user_id: '' // Will be set by repository
    };
  }
}

// Create a singleton instance
export const episodeMapper = new EpisodeMapper();
