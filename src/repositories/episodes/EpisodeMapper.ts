
import { DataMapper } from "../core/DataMapper";
import { Episode } from "@/lib/types";
import { CreateEpisodeDTO, UpdateEpisodeDTO, DBEpisode } from "./EpisodeDTO";
import { EpisodeStatus } from "@/lib/enums";

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
      if (dbEpisode.notes_versions && typeof dbEpisode.notes_versions === 'string') {
        notesVersions = JSON.parse(dbEpisode.notes_versions);
      } else if (dbEpisode.notes_versions) {
        notesVersions = dbEpisode.notes_versions;
      }
      
      if (dbEpisode.introduction_versions && typeof dbEpisode.introduction_versions === 'string') {
        introductionVersions = JSON.parse(dbEpisode.introduction_versions);
      } else if (dbEpisode.introduction_versions) {
        introductionVersions = dbEpisode.introduction_versions;
      }
    } catch (e) {
      console.error("Error parsing versions for episode", dbEpisode.id, e);
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
      recordingLinks: dbEpisode.recording_links || undefined,
      podcastUrls: dbEpisode.podcast_urls || undefined,
      resources: dbEpisode.resources || undefined,
      createdAt: dbEpisode.created_at,
      updatedAt: dbEpisode.updated_at
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
    if (episode.recordingLinks !== undefined) dbEpisode.recording_links = episode.recordingLinks;
    if (episode.podcastUrls !== undefined) dbEpisode.podcast_urls = episode.podcastUrls;
    if (episode.resources !== undefined) dbEpisode.resources = episode.resources;
    
    // Stringify the versions for database storage
    if (episode.notesVersions) {
      dbEpisode.notes_versions = JSON.stringify(episode.notesVersions);
    }
    
    if (episode.introductionVersions) {
      dbEpisode.introduction_versions = JSON.stringify(episode.introductionVersions);
    }
    
    return dbEpisode;
  }

  /**
   * Maps from CreateEpisodeDTO to database model
   */
  createDtoToDB(dto: CreateEpisodeDTO): Partial<DBEpisode> {
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
      resources: dto.resources || null,
      podcast_urls: dto.podcastUrls || null
    };
  }
}

// Create a singleton instance
export const episodeMapper = new EpisodeMapper();
