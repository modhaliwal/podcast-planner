
import { Episode } from "@/lib/types";
import { EpisodeRepository } from "@/repositories/episodes/EpisodeRepository";
import { CreateEpisodeDTO, UpdateEpisodeDTO } from "@/repositories/episodes/EpisodeDTO";

// Create an instance of the repository
const episodeRepository = new EpisodeRepository();

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
    const result = await episodeRepository.update(id, episodeData);
    return result.data;
  },
  
  /**
   * Delete an episode
   */
  async deleteEpisode(id: string): Promise<boolean> {
    return await episodeRepository.remove(id);
  }
};
