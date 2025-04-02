
import { DataMapper } from "../core/DataMapper";
import { Episode } from "@/lib/types";
import { CreateEpisodeDTO, UpdateEpisodeDTO, DBEpisode } from "./EpisodeDTO";
import { EpisodeStatus } from "@/lib/enums";
import { Json } from "@/integrations/supabase/types";

/**
 * Maps between Episode domain models and database models
 */
export class EpisodeMapper implements DataMapper<Episode, DBEpisode> {
  /**
   * Maps a database model to a domain model
   */
  toDomain(dbEpisode: DBEpisode): Episode {
    // Parse versions if they exist as strings
    let notesVersions = undefined;
    let introductionVersions = undefined;
    
    try {
      if (dbEpisode.notes_versions) {
        if (typeof dbEpisode.notes_versions === 'string') {
          notesVersions = JSON.parse(dbEpisode.notes_versions as string);
        } else {
          notesVersions = dbEpisode.notes_versions;
        }
      }
      
      if (dbEpisode.introduction_versions) {
        if (typeof dbEpisode.introduction_versions === 'string') {
          introductionVersions = JSON.parse(dbEpisode.introduction_versions as string);
        } else {
          introductionVersions = dbEpisode.introduction_versions;
        }
      }
    } catch (e) {
      console.error("Error parsing versions for episode", dbEpisode.id, e);
    }

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
