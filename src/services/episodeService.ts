
import { supabase } from "@/integrations/supabase/client";
import { EpisodeStatus } from "@/lib/enums";
import { User } from "@/lib/types";
import { EpisodeFormData } from "@/components/episodes/CreateEpisodeForm/types";

export const createEpisodes = async (
  episodes: EpisodeFormData[],
  user: User
): Promise<{ success: boolean; error?: any }> => {
  try {
    // Save each episode to the database
    for (const episode of episodes) {
      const { error } = await supabase
        .from('episodes')
        .insert({
          user_id: user.id,
          episode_number: episode.episodeNumber,
          title: episode.title || `Episode #${episode.episodeNumber}`,
          scheduled: episode.scheduled.toISOString(),
          status: EpisodeStatus.SCHEDULED,
          introduction: `Introduction for Episode #${episode.episodeNumber}`, // Default introduction
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
    }
    
    return { success: true };
  } catch (error) {
    console.error("Error creating episodes:", error);
    return { success: false, error };
  }
};
