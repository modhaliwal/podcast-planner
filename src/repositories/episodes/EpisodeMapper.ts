
import { Episode } from "@/lib/types";
import { CreateEpisodeDTO, DBEpisode, UpdateEpisodeDTO } from "./EpisodeDTO";

/**
 * Mapper for converting between Episode domain objects and DB representation
 */
export class EpisodeMapper {
  /**
   * Map a database record to a domain object
   */
  mapFromDB(dbEpisode: DBEpisode): Episode {
    // Extract guest IDs from episode_guests relationship
    const guestIds = (dbEpisode.episode_guests || [])
      .map(relation => relation.guest_id);
    
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
      status: dbEpisode.status as 'scheduled' | 'recorded' | 'published',
      introduction: dbEpisode.introduction || undefined,
      notes: dbEpisode.notes || undefined,
      notesVersions: dbEpisode.notes_versions || undefined,
      introductionVersions: dbEpisode.introduction_versions || undefined,
      recordingLinks: dbEpisode.recording_links || undefined,
      podcastUrls: dbEpisode.podcast_urls || undefined,
      resources: dbEpisode.resources || undefined,
      createdAt: dbEpisode.created_at,
      updatedAt: dbEpisode.updated_at,
    };
  }
  
  /**
   * Map multiple database records to domain objects
   */
  mapManyFromDB(dbEpisodes: DBEpisode[]): Episode[] {
    return dbEpisodes.map(dbEpisode => this.mapFromDB(dbEpisode));
  }
  
  /**
   * Map a domain object to database format for creation
   */
  mapCreateDTOToDB(episode: CreateEpisodeDTO): Omit<DBEpisode, 'id' | 'created_at' | 'updated_at' | 'episode_guests'> {
    return {
      title: episode.title,
      episode_number: episode.episodeNumber,
      description: episode.description || null,
      topic: episode.topic || null,
      cover_art: episode.coverArt || null,
      scheduled: episode.scheduled,
      publish_date: episode.publishDate || null,
      status: episode.status,
      introduction: episode.introduction || null,
      notes: episode.notes || null,
      notes_versions: episode.notesVersions || null,
      introduction_versions: episode.introductionVersions || null,
      recording_links: episode.recordingLinks || null,
      podcast_urls: episode.podcastUrls || null,
      resources: episode.resources || null,
    };
  }
  
  /**
   * Map a domain object to database format for updates
   */
  mapUpdateDTOToDB(episode: UpdateEpisodeDTO): Partial<Omit<DBEpisode, 'id' | 'created_at' | 'updated_at' | 'episode_guests'>> {
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
    if (episode.notesVersions !== undefined) dbEpisode.notes_versions = episode.notesVersions || null;
    if (episode.introductionVersions !== undefined) dbEpisode.introduction_versions = episode.introductionVersions || null;
    if (episode.recordingLinks !== undefined) dbEpisode.recording_links = episode.recordingLinks || null;
    if (episode.podcastUrls !== undefined) dbEpisode.podcast_urls = episode.podcastUrls || null;
    if (episode.resources !== undefined) dbEpisode.resources = episode.resources || null;
    
    return dbEpisode;
  }
}
