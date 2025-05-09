
import { EpisodeRepository } from './episodes/EpisodeRepository';
import { GuestRepository } from './guests/GuestRepository';
import { EpisodeMapper } from './episodes/EpisodeMapper';
import { GuestMapper } from './guests/GuestMapper';
import { AIGeneratorRepository } from './ai-generators/AIGeneratorRepository';
import { aiGeneratorMapper } from './ai-generators/AIGeneratorMapper';

// Create singleton instances
export const episodeRepository = new EpisodeRepository();
export const guestRepository = new GuestRepository();
export const aiGeneratorRepository = new AIGeneratorRepository();

/**
 * Central registry of all repositories for easy access
 */
export const repositories = {
  episodes: episodeRepository,
  guests: guestRepository,
  aiGenerators: aiGeneratorRepository
};

export type { Repository, Result } from './core/Repository';
