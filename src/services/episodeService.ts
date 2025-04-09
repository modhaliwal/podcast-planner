
import { toast } from '@/hooks/toast';
import { Episode } from '@/types';
import { EpisodeFormData } from '@/components/episodes/CreateEpisodeForm/types';

export const createEpisodes = async (episodesData: EpisodeFormData[]) => {
  try {
    console.log("Creating episodes:", episodesData);
    
    // This is a mock implementation since we don't have a real backend
    // In a real app, we would send a request to the server
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // In a real app, we would get the IDs from the server
    const createdEpisodes = episodesData.map((episode, index) => {
      const now = new Date().toISOString();
      return {
        id: `temp-id-${index}-${now}`,
        episodeNumber: episode.episodeNumber,
        title: episode.title,
        scheduled: new Date(episode.scheduled).toISOString(),
        guestIds: episode.guestIds || [],
        status: 'scheduled',
        introduction: '',
        notes: '',
        createdAt: now,
        updatedAt: now
      };
    });
    
    console.log("Created episodes:", createdEpisodes);
    
    return {
      success: true,
      data: createdEpisodes,
      error: null
    };
  } catch (error: any) {
    console.error("Error creating episodes:", error);
    
    return {
      success: false,
      data: null,
      error: error.message || "Failed to create episodes"
    };
  }
};
