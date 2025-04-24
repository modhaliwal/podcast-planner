
import { toast } from '@/hooks/toast';
import { Episode } from '@/lib/types';
import { EpisodeFormData } from '@/components/episodes/CreateEpisodeForm/types';
import { repositories } from '@/repositories';
import { CreateEpisodeDTO } from '@/repositories/episodes/EpisodeDTO';

export const createEpisodes = async (episodesData: EpisodeFormData[]) => {
  try {
    console.log("Creating episodes:", episodesData);
    
    const createdEpisodes: Episode[] = [];
    
    // Process each episode
    for (const episodeData of episodesData) {
      // Convert form data to DTO format
      const episodeDto: CreateEpisodeDTO = {
        title: episodeData.title || `Episode #${episodeData.episodeNumber}`,
        episodeNumber: episodeData.episodeNumber,
        scheduled: new Date(episodeData.scheduled).toISOString(),
        status: 'scheduled',
        introduction: episodeData.introduction || undefined,  // Use undefined if empty
        guestIds: episodeData.guestIds || [],
        topic: episodeData.topic || undefined  // Use undefined if empty
      };
      
      // Add the episode using the repository
      const createdEpisode = await repositories.episodes.add(episodeDto);
      
      if (createdEpisode) {
        createdEpisodes.push(createdEpisode);
      }
    }
    
    console.log("Created episodes:", createdEpisodes);
    
    return {
      success: true,
      data: createdEpisodes,
      error: null
    };
  } catch (error: any) {
    console.error("Error creating episodes:", error);
    
    toast({
      title: "Error creating episodes",
      description: error.message || "Failed to create episodes",
      variant: "destructive"
    });
    
    return {
      success: false,
      data: null,
      error: error.message || "Failed to create episodes"
    };
  }
};
