
import { episodeRepository } from './episodes/EpisodeRepository';
import { guestRepository } from './guests/GuestRepository';

/**
 * Central registry of all repositories for easy access
 */
export const repositories = {
  episodes: episodeRepository,
  guests: guestRepository
};

export { episodeRepository } from './episodes/EpisodeRepository';
export { guestRepository } from './guests/GuestRepository';
export type { Repository } from './core/Repository';
