
import { Episode } from "@/lib/types";
import { CreateEpisodeDTO, UpdateEpisodeDTO } from "@/repositories/episodes/EpisodeDTO";
import { EpisodeFormData } from "@/components/episodes/CreateEpisodeForm/types";
import { episodeRepository } from "@/repositories";

/**
 * Service for episode-related operations
 */
export const episodeService = {
  /**
   * Get all episodes
   */
  async getAllEpisodes(): Promise<Episode[]> {
    return await episodeRepository.getAll();
  },
  
  /**
   * Get a specific episode by ID
   */
  async getEpisodeById(id: string): Promise<Episode | null> {
    return await episodeRepository.getById(id);
  },
  
  /**
   * Create a new episode
   */
  async createEpisode(episodeData: CreateEpisodeDTO): Promise<Episode> {
    // Transform the data if needed
    const createDTO: CreateEpisodeDTO = {
      ...episodeData,
      guestIds: episodeData.guestIds || []
    };
    
    // Use the repository to create the episode
    return await episodeRepository.add(createDTO);
  },
  
  /**
   * Update an existing episode
   */
  async updateEpisode(id: string, episodeData: UpdateEpisodeDTO): Promise<Episode | null> {
    return await episodeRepository.update(id, episodeData);
  },
  
  /**
   * Delete an episode
   */
  async deleteEpisode(id: string): Promise<boolean> {
    return await episodeRepository.delete(id);
  }
};

/**
 * Create multiple episodes at once
 * @param episodes Array of episode data to create
 * @param user Current user information
 * @returns Result of the operation
 */
export const createEpisodes = async (
  episodes: EpisodeFormData[], 
  user: any
): Promise<{ success: boolean; error?: Error }> => {
  try {
    if (!user) {
      throw new Error("User is required to create episodes");
    }
    
    // Process each episode 
    for (const episodeData of episodes) {
      // Create CreateEpisodeDTO from form data
      const createDTO: CreateEpisodeDTO = {
        title: episodeData.title || `Episode #${episodeData.episodeNumber}`,
        episodeNumber: episodeData.episodeNumber,
        topic: episodeData.topic || undefined,
        description: '',
        guestIds: episodeData.guestIds || [],
        scheduled: new Date(episodeData.scheduled).toISOString(),
        status: 'scheduled',
        introduction: episodeData.introduction || '',
      };
      
      // Use the repository to create the episode
      await episodeRepository.add(createDTO);
    }
    
    return { success: true };
  } catch (error) {
    console.error("Error creating episodes:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error : new Error('Unknown error creating episodes') 
    };
  }
};
