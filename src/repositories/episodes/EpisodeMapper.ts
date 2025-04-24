import { Episode } from "@/lib/types";
import { CreateEpisodeDTO, DBEpisode, UpdateEpisodeDTO } from "./EpisodeDTO";
import { DataMapper } from "../core/DataMapper";
import { Json } from "@/integrations/supabase/types";
import { ContentVersion, RecordingLinks, PodcastUrls, Resource } from "@/lib/types";
import { EpisodeStatus } from "@/lib/enums";

/**
 * Mapper for converting between Episode domain objects and DB representation
 */
export class EpisodeMapper implements DataMapper<Episode, DBEpisode> {
  /**
   * Map a database record to a domain object
   */
  toDomain(dbEpisode: DBEpisode): Episode {
    // Extract guest IDs from episode_guests relationship
    const guestIds = (dbEpisode.episode_guests || [])
      .map(relation => relation.guest_id);
    
    // Parse complex JSON fields with proper type casting
    const notesVersions = this.parseJsonField<ContentVersion[]>(dbEpisode.notes_versions);
    const introductionVersions = this.parseJsonField<ContentVersion[]>(dbEpisode.introduction_versions);
    const recordingLinks = this.parseJsonField<RecordingLinks>(dbEpisode.recording_links);
    const podcastUrls = this.parseJsonField<PodcastUrls>(dbEpisode.podcast_urls);
    const resources = this.parseJsonField<Resource[]>(dbEpisode.resources);
    
    return {
      id: dbEpisode.id,
      title: dbEpisode.title,
      episodeNumber: dbEpisode.episode_number,
      description: dbEpisode.description || undefined,
      topic: dbEpisode.topic || undefined,
      coverArt: dbEpisode.cover_art || undefined,
      guestIds: guestIds,
      scheduled: dbEpisode.scheduled,
      publishDate: dbEpisode.publish_date || undefined,
      // Explicitly cast to EpisodeStatus
      status: EpisodeStatus[dbEpisode.status as keyof typeof EpisodeStatus],
      introduction: dbEpisode.introduction || undefined,
      notes: dbEpisode.notes || undefined,
      notesVersions: notesVersions || undefined,
      introductionVersions: introductionVersions || undefined,
      recordingLinks: recordingLinks || undefined,
      podcastUrls: podcastUrls || undefined,
      resources: resources || undefined,
      createdAt: dbEpisode.created_at,
      updatedAt: dbEpisode.updated_at,
    };
  }
  
  // Helper method to safely parse JSON fields
  private parseJsonField<T>(jsonValue: Json | null | undefined): T | undefined {
    if (!jsonValue) return undefined;
    
    try {
      if (typeof jsonValue === 'string') {
        return JSON.parse(jsonValue) as T;
      }
      
      return jsonValue as unknown as T;
    } catch (e) {
      console.error('Error parsing JSON field:', e);
      return undefined;
    }
  }
  
  /**
   * Map a domain object to database format
   */
  toDB(episode: Partial<Episode>): Partial<DBEpisode> {
    const dbEpisode: Partial<DBEpisode> = {};
    
    if (episode.title !== undefined) dbEpisode.title = episode.title;
    if (episode.episodeNumber !== undefined) dbEpisode.episode_number = episode.episodeNumber;
    if (episode.description !== undefined) dbEpisode.description = episode.description || null;
    if (episode.topic !== undefined) dbEpisode.topic = episode.topic || null;
    if (episode.coverArt !== undefined) dbEpisode.cover_art = episode.coverArt || null;
    if (episode.scheduled !== undefined) dbEpisode.scheduled = episode.scheduled;
    if (episode.publishDate !== undefined) dbEpisode.publish_date = episode.publishDate || null;
    if (episode.status !== undefined) dbEpisode.status = episode.status;
    if (episode.introduction !== undefined) dbEpisode.introduction = episode.introduction || null;
    if (episode.notes !== undefined) dbEpisode.notes = episode.notes || null;
    
    // Handle complex objects by converting them to JSON
    if (episode.notesVersions !== undefined) 
      dbEpisode.notes_versions = episode.notesVersions as unknown as Json;
    if (episode.introductionVersions !== undefined) 
      dbEpisode.introduction_versions = episode.introductionVersions as unknown as Json;
    if (episode.recordingLinks !== undefined) 
      dbEpisode.recording_links = episode.recordingLinks as unknown as Json;
    if (episode.podcastUrls !== undefined) 
      dbEpisode.podcast_urls = episode.podcastUrls as unknown as Json;
    if (episode.resources !== undefined) 
      dbEpisode.resources = episode.resources as unknown as Json;
    
    return dbEpisode;
  }
  
  /**
   * Map from creation DTO to database model
   */
  createDtoToDB(episode: CreateEpisodeDTO): Partial<DBEpisode> {
    const dbEpisode: Partial<DBEpisode> = {
      title: episode.title,
      episode_number: episode.episodeNumber,
      scheduled: episode.scheduled,
      status: episode.status
    };
    
    if (episode.description !== undefined) dbEpisode.description = episode.description;
    if (episode.topic !== undefined) dbEpisode.topic = episode.topic;
    if (episode.coverArt !== undefined) dbEpisode.cover_art = episode.coverArt;
    if (episode.publishDate !== undefined) dbEpisode.publish_date = episode.publishDate;
    if (episode.introduction !== undefined) dbEpisode.introduction = episode.introduction;
    if (episode.notes !== undefined) dbEpisode.notes = episode.notes;
    
    // Handle complex objects
    if (episode.notesVersions) dbEpisode.notes_versions = episode.notesVersions as unknown as Json;
    if (episode.introductionVersions) dbEpisode.introduction_versions = episode.introductionVersions as unknown as Json;
    if (episode.recordingLinks) dbEpisode.recording_links = episode.recordingLinks as unknown as Json;
    if (episode.podcastUrls) dbEpisode.podcast_urls = episode.podcastUrls as unknown as Json;
    if (episode.resources) dbEpisode.resources = episode.resources as unknown as Json;
    
    return dbEpisode;
  }
  
  /**
   * Map from update DTO to database model
   */
  updateDtoToDB(episode: UpdateEpisodeDTO): Partial<DBEpisode> {
    const dbEpisode: Partial<DBEpisode> = {};
    
    if (episode.title !== undefined) dbEpisode.title = episode.title;
    if (episode.episodeNumber !== undefined) dbEpisode.episode_number = episode.episodeNumber;
    if (episode.description !== undefined) dbEpisode.description = episode.description || null;
    if (episode.topic !== undefined) dbEpisode.topic = episode.topic || null;
    if (episode.coverArt !== undefined) dbEpisode.cover_art = episode.coverArt || null;
    if (episode.scheduled !== undefined) dbEpisode.scheduled = episode.scheduled;
    if (episode.publishDate !== undefined) dbEpisode.publish_date = episode.publishDate || null;
    if (episode.status !== undefined) dbEpisode.status = episode.status;
    if (episode.introduction !== undefined) dbEpisode.introduction = episode.introduction || null;
    if (episode.notes !== undefined) dbEpisode.notes = episode.notes || null;
    
    // Handle complex objects with proper JSON typing
    if (episode.notesVersions !== undefined) 
      dbEpisode.notes_versions = episode.notesVersions as unknown as Json;
    if (episode.introductionVersions !== undefined) 
      dbEpisode.introduction_versions = episode.introductionVersions as unknown as Json;
    if (episode.recordingLinks !== undefined) 
      dbEpisode.recording_links = episode.recordingLinks as unknown as Json;
    if (episode.podcastUrls !== undefined) 
      dbEpisode.podcast_urls = episode.podcastUrls as unknown as Json;
    if (episode.resources !== undefined) 
      dbEpisode.resources = episode.resources as unknown as Json;
    
    return dbEpisode;
  }
}
