
import { supabase } from "@/integrations/supabase/client";
import { BaseRepository } from "./BaseRepository";
import { Episode } from "@/lib/types";
import { mapEpisodeFromDB, mapEpisodeToDB } from "@/services/episodeService";
import { deleteImage } from "@/lib/imageUpload";

/**
 * Repository for episode-related operations
 */
export class EpisodeRepository extends BaseRepository<Episode> {
  /**
   * Get all episodes
   */
  async getAll(): Promise<{ data: Episode[] | null; error: Error | null }> {
    try {
      // Fetch episodes
      const { data: episodesData, error: episodesError } = await supabase
        .from('episodes')
        .select('*');
      
      if (episodesError) throw episodesError;
      
      if (!episodesData) {
        return { data: [], error: null };
      }
      
      // Fetch guest relationships
      const { data: episodeGuestsData, error: episodeGuestsError } = await supabase
        .from('episode_guests')
        .select('episode_id, guest_id');
      
      if (episodeGuestsError) throw episodeGuestsError;
      
      // Organize guest IDs by episode
      const guestsByEpisode: Record<string, string[]> = {};
      episodeGuestsData?.forEach(({ episode_id, guest_id }) => {
        if (!guestsByEpisode[episode_id]) {
          guestsByEpisode[episode_id] = [];
        }
        guestsByEpisode[episode_id].push(guest_id);
      });
      
      // Format episodes
      const episodes = episodesData.map(episode => {
        const mappedEpisode = mapEpisodeFromDB(episode);
        mappedEpisode.guestIds = guestsByEpisode[episode.id] || [];
        return mappedEpisode;
      });
      
      return { data: episodes, error: null };
    } catch (error: any) {
      console.error("Error fetching episodes:", error);
      return { data: null, error };
    }
  }
  
  /**
   * Get episode by ID
   */
  async getById(id: string): Promise<{ data: Episode | null; error: Error | null }> {
    if (!id) {
      return { data: null, error: new Error("No episode ID provided") };
    }
    
    try {
      const { data, error } = await supabase
        .from('episodes')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      // Map DB episode to application episode
      const episode = mapEpisodeFromDB(data);
      
      // Get episode guests
      const { data: guestsData } = await supabase
        .from('episode_guests')
        .select('guest_id')
        .eq('episode_id', id);
      
      episode.guestIds = guestsData?.map(item => item.guest_id) || [];
      
      return { data: episode, error: null };
    } catch (error: any) {
      console.error(`Error fetching episode with id ${id}:`, error);
      return { data: null, error };
    }
  }
  
  /**
   * Create a new episode
   */
  async create(episode: Partial<Episode>): Promise<{ data: Episode | null; error: Error | null }> {
    try {
      // Convert application model to DB model
      const dbEpisode = mapEpisodeToDB(episode);
      
      // Ensure required fields are present
      if (!dbEpisode.episode_number || !dbEpisode.title || !dbEpisode.introduction || !dbEpisode.scheduled) {
        throw new Error("Missing required fields for episode creation");
      }

      // Get the current user from supabase auth
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("User not authenticated");
      }

      // Insert episode into database with required fields
      const { data, error } = await supabase
        .from('episodes')
        .insert({
          ...dbEpisode,
          user_id: user.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      
      // Handle guest relationships if available
      if (episode.guestIds && episode.guestIds.length > 0 && data) {
        const episodeGuestsToInsert = episode.guestIds.map(guestId => ({
          episode_id: data.id,
          guest_id: guestId
        }));
        
        const { error: guestError } = await supabase
          .from('episode_guests')
          .insert(episodeGuestsToInsert);
          
        if (guestError) {
          console.error("Error inserting guest relationships:", guestError);
        }
      }
      
      if (!data) return { data: null, error: null };

      // Return the created episode
      const createdEpisode = mapEpisodeFromDB(data);
      createdEpisode.guestIds = episode.guestIds || [];
      
      return { data: createdEpisode, error: null };
    } catch (error: any) {
      console.error("Error creating episode:", error);
      return { data: null, error };
    }
  }
  
  /**
   * Update an existing episode
   */
  async update(id: string, updates: Partial<Episode>): Promise<{ success: boolean; error: Error | null }> {
    try {
      // Convert application model to DB model
      const dbUpdates = mapEpisodeToDB(updates);
      
      const { error } = await supabase
        .from('episodes')
        .update({
          ...dbUpdates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);
      
      if (error) throw error;

      // Handle guest relationships if provided
      if (updates.guestIds !== undefined) {
        // First delete existing relationships
        const { error: deleteError } = await supabase
          .from('episode_guests')
          .delete()
          .eq('episode_id', id);
        
        if (deleteError) throw deleteError;
        
        // Then insert new relationships if any
        if (updates.guestIds.length > 0) {
          const episodeGuestsToInsert = updates.guestIds.map(guestId => ({
            episode_id: id,
            guest_id: guestId
          }));
          
          const { error: insertError } = await supabase
            .from('episode_guests')
            .insert(episodeGuestsToInsert);
            
          if (insertError) throw insertError;
        }
      }
      
      return { success: true, error: null };
    } catch (error: any) {
      console.error(`Error updating episode with id ${id}:`, error);
      return { success: false, error };
    }
  }
  
  /**
   * Delete an episode by ID
   */
  async delete(id: string): Promise<{ success: boolean; error: Error | null }> {
    try {
      // Get episode to access cover art
      const { data: episodeData } = await supabase
        .from('episodes')
        .select('cover_art')
        .eq('id', id)
        .single();
      
      // Delete cover art from storage if it exists
      if (episodeData?.cover_art) {
        await deleteImage(episodeData.cover_art);
      }
      
      // Delete episode-guest relationships
      const { error: guestsError } = await supabase
        .from('episode_guests')
        .delete()
        .eq('episode_id', id);
      
      if (guestsError) throw guestsError;
      
      // Delete the episode
      const { error } = await supabase
        .from('episodes')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      return { success: true, error: null };
    } catch (error: any) {
      console.error(`Error deleting episode with id ${id}:`, error);
      return { success: false, error };
    }
  }
}

// Create a singleton instance
export const episodeRepository = new EpisodeRepository();
