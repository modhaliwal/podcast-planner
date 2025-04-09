
import { EpisodeFormData } from '@/components/episodes/CreateEpisodeForm/types';
import { episodeRepository } from '@/repositories';
import { EpisodeStatus } from '@/lib/enums';
import { CreateEpisodeDTO } from '@/repositories/episodes/EpisodeDTO';

/**
 * Create multiple episodes from form data
 * @param episodes Array of episode form data
 * @param user Current user
 * @returns Result of operation
 */
export const createEpisodes = async (
  episodes: EpisodeFormData[], 
  user: { id: string }
): Promise<{ success: boolean; error?: Error }> => {
  if (!user) {
    return { success: false, error: new Error('User not authenticated') };
  }
  
  try {
    // Process each episode
    for (const episodeData of episodes) {
      // Convert form data to a proper CreateEpisodeDTO
      const episode: CreateEpisodeDTO = {
        title: episodeData.title || `Episode #${episodeData.episodeNumber}`,
        episodeNumber: episodeData.episodeNumber,
        introduction: episodeData.introduction || `Introduction for episode #${episodeData.episodeNumber}`,
        scheduled: episodeData.scheduled instanceof Date 
          ? episodeData.scheduled.toISOString() 
          : episodeData.scheduled,
        status: EpisodeStatus.SCHEDULED,
        topic: episodeData.topic,
      };
      
      // Store the episode
      await episodeRepository.add(episode);
      
      // If we have guest IDs, we would need to handle them separately
      // This would typically involve adding entries to the episode_guests table
    }
    
    return { success: true };
  } catch (error: any) {
    console.error('Error creating episodes:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error : new Error(error?.message || 'Error creating episodes') 
    };
  }
};
