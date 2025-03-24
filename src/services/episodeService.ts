
import { supabase } from "@/integrations/supabase/client";
import { EpisodeStatus } from "@/lib/enums";
import { User as AppUser } from "@/lib/types";
import { User as SupabaseUser } from "@supabase/supabase-js";
import { EpisodeFormData } from "@/components/episodes/CreateEpisodeForm/types";

// Create a type that accepts either User type
type UserParam = AppUser | SupabaseUser;

export const createEpisodes = async (
  episodes: EpisodeFormData[],
  user: UserParam
): Promise<{ success: boolean; error?: any }> => {
  try {
    // Ensure we have a user ID
    if (!user || !user.id) {
      throw new Error("User ID is required");
    }

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

// Add function to get episodes for current user
export const getUserEpisodes = async (): Promise<{ data: any[] | null; error: any }> => {
  try {
    const { data, error } = await supabase
      .from('episodes')
      .select('*')
      .order('episode_number', { ascending: false });
    
    if (error) throw error;
    
    return { data, error: null };
  } catch (error) {
    console.error("Error fetching user episodes:", error);
    return { data: null, error };
  }
};

// Add function to get a specific episode
export const getEpisode = async (id: string): Promise<{ data: any | null; error: any }> => {
  try {
    const { data, error } = await supabase
      .from('episodes')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    return { data, error: null };
  } catch (error) {
    console.error(`Error fetching episode with id ${id}:`, error);
    return { data: null, error };
  }
};

// Add function to update an episode
export const updateEpisode = async (id: string, updates: any): Promise<{ success: boolean; error?: any }> => {
  try {
    const { error } = await supabase
      .from('episodes')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);
    
    if (error) throw error;
    
    return { success: true };
  } catch (error) {
    console.error(`Error updating episode with id ${id}:`, error);
    return { success: false, error };
  }
};

// Add function to delete an episode
export const deleteEpisode = async (id: string): Promise<{ success: boolean; error?: any }> => {
  try {
    const { error } = await supabase
      .from('episodes')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    return { success: true };
  } catch (error) {
    console.error(`Error deleting episode with id ${id}:`, error);
    return { success: false, error };
  }
};
