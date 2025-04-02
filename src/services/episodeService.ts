
import { EpisodeFormData } from '@/components/episodes/CreateEpisodeForm/types';
import { episodeRepository } from '@/repositories';
import { EpisodeStatus } from '@/lib/enums';

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
      const episode = {
        title: episodeData.title,
        episodeNumber: episodeData.episodeNumber,
        introduction: episodeData.introduction || `Introduction for episode #${episodeData.episodeNumber}`,
        scheduled: episodeData.scheduled instanceof Date 
          ? episodeData.scheduled.toISOString() 
          : episodeData.scheduled,
        status: EpisodeStatus.SCHEDULED,
        guestIds: episodeData.guestIds || []
      };
      
      const { error } = await episodeRepository.create(episode);
      
      if (error) {
        throw error;
      }
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
