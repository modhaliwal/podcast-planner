
import { EpisodeRepository } from './episodes/EpisodeRepository';
import { GuestRepository } from './guests/GuestRepository';
import { EpisodeMapper } from './episodes/EpisodeMapper';
import { GuestMapper } from './guests/GuestMapper';

// Create singleton instances
export const episodeRepository = new EpisodeRepository();
export const guestRepository = new GuestRepository();

/**
 * Central registry of all repositories for easy access
 */
export const repositories = {
  episodes: episodeRepository,
  guests: guestRepository
};

export type { Repository, Result } from './core/Repository';
