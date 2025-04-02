
import { DataMapper } from "../core/DataMapper";
import { Episode, ContentVersion } from "@/lib/types";
import { DBEpisode } from "./EpisodeDTO";
import { EpisodeStatus } from "@/lib/enums";

/**
 * Maps between Episode domain models and database models
 */
export class EpisodeMapper implements DataMapper<Episode, DBEpisode> {
  /**
   * Maps a database model to a domain model
   */
  toDomain(dbEpisode: DBEpisode): Episode {
    // Process notes versions if they exist
    let notesVersions: ContentVersion[] | undefined;
    let introductionVersions: ContentVersion[] | undefined;
    
    try {
      if (dbEpisode.notes_versions) {
        // Handle various input formats for notes_versions
        notesVersions = Array.isArray(dbEpisode.notes_versions) 
          ? dbEpisode.notes_versions 
          : typeof dbEpisode.notes_versions === 'string'
            ? JSON.parse(dbEpisode.notes_versions)
            : [dbEpisode.notes_versions];
      }
      
      if (dbEpisode.introduction_versions) {
        introductionVersions = Array.isArray(dbEpisode.introduction_versions)
          ? dbEpisode.introduction_versions
          : typeof dbEpisode.introduction_versions === 'string'
            ? JSON.parse(dbEpisode.introduction_versions)
            : [dbEpisode.introduction_versions];
      }
    } catch (error) {
      console.error("Error processing versions:", error);
      notesVersions = [];
      introductionVersions = [];
    }
  
    // Map podcast URLs from legacy fields if needed
    const podcastUrls = dbEpisode.podcast_urls || {};
  
    return {
      id: dbEpisode.id || '',
      title: dbEpisode.title || '',
      episodeNumber: dbEpisode.episode_number,
      scheduled: dbEpisode.scheduled || '',
      publishDate: dbEpisode.publish_date,
      status: dbEpisode.status as EpisodeStatus || EpisodeStatus.SCHEDULED,
      introduction: dbEpisode.introduction || '',
      notes: dbEpisode.notes || '',
      notesVersions: notesVersions,
      introductionVersions: introductionVersions,
      topic: dbEpisode.topic,
      guestIds: [], // This will be populated separately
      coverArt: dbEpisode.cover_art,
      podcastUrls: podcastUrls,
      resources: dbEpisode.resources || [],
      createdAt: dbEpisode.created_at || new Date().toISOString(),
      updatedAt: dbEpisode.updated_at || new Date().toISOString()
    };
  }
  
  /**
   * Maps a domain model to a database model
   */
  toDB(episode: Partial<Episode>): Partial<DBEpisode> {
    const dbEpisode: Partial<DBEpisode> = {};
    
    if (episode.title !== undefined) dbEpisode.title = episode.title;
    if (episode.episodeNumber !== undefined) dbEpisode.episode_number = episode.episodeNumber;
    if (episode.scheduled !== undefined) dbEpisode.scheduled = episode.scheduled;
    if (episode.publishDate !== undefined) dbEpisode.publish_date = episode.publishDate;
    if (episode.status !== undefined) dbEpisode.status = episode.status;
    if (episode.introduction !== undefined) dbEpisode.introduction = episode.introduction;
    if (episode.notes !== undefined) dbEpisode.notes = episode.notes;
    if (episode.notesVersions !== undefined) dbEpisode.notes_versions = episode.notesVersions;
    if (episode.introductionVersions !== undefined) dbEpisode.introduction_versions = episode.introductionVersions;
    if (episode.coverArt !== undefined) dbEpisode.cover_art = episode.coverArt;
    if (episode.topic !== undefined) dbEpisode.topic = episode.topic;
    if (episode.resources !== undefined) dbEpisode.resources = episode.resources;
    if (episode.podcastUrls !== undefined) dbEpisode.podcast_urls = episode.podcastUrls;
    
    return dbEpisode;
  }
}

// Create a singleton instance
export const episodeMapper = new EpisodeMapper();
