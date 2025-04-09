import { supabase } from "@/integrations/supabase/client";
import { BaseRepository } from "../core/BaseRepository";
import { Episode } from "@/lib/types";
import { episodeMapper } from "./EpisodeMapper";
import { deleteImage } from "@/lib/imageUpload";
import { CreateEpisodeDTO, UpdateEpisodeDTO, DBEpisode } from "./EpisodeDTO";
import { Result } from "@/lib/types";

/**
 * Repository for episode-related operations
 */
export class EpisodeRepository extends BaseRepository<Episode, CreateEpisodeDTO, UpdateEpisodeDTO, DBEpisode> {
  protected tableName = 'episodes';
  protected mapper = episodeMapper;
  
  /**
   * Get all episodes with their related guests
   */
  async getAll(options?: { 
    filters?: Record<string, any> 
  }): Promise<Result<Episode[]>> {
    try {
      // Get episodes with base implementation first
      const result = await super.getAll(options);
      
      if (result.error || !result.data) {
        return result;
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
      
      // Add guest IDs to episodes
      const episodes = result.data.map(episode => {
        episode.guestIds = guestsByEpisode[episode.id] || [];
        return episode;
      });
      
      return { data: episodes, error: null };
    } catch (error) {
      return { data: null, error: this.handleError("getAll with guests", error) };
    }
  }
  
  /**
   * Get episode by ID with its related guests
   */
  async getById(id: string): Promise<Result<Episode>> {
    try {
      // Get episode with base implementation first
      const result = await super.getById(id);
      
      if (result.error || !result.data) {
        return result;
      }
      
      // Get episode guests
      const { data: guestsData, error: guestsError } = await supabase
        .from('episode_guests')
        .select('guest_id')
        .eq('episode_id', id);
      
      if (guestsError) throw guestsError;
      
      // Add guest IDs to episode
      result.data.guestIds = guestsData?.map(item => item.guest_id) || [];
      
      return result;
    } catch (error) {
      return { data: null, error: this.handleError(`getById ${id} with guests`, error) };
    }
  }
  
  /**
   * Create an episode with guest relationships
   */
  async create(episodeDTO: CreateEpisodeDTO): Promise<Result<Episode>> {
    try {
      // Create episode with base implementation
      const result = await super.create(episodeDTO);
      
      if (result.error || !result.data) {
        return result;
      }
      
      // Handle guest relationships if available
      if (episodeDTO.guestIds && episodeDTO.guestIds.length > 0) {
        const episodeGuestsToInsert = episodeDTO.guestIds.map(guestId => ({
          episode_id: result.data!.id,
          guest_id: guestId
        }));
        
        const { error: guestError } = await supabase
          .from('episode_guests')
          .insert(episodeGuestsToInsert);
          
        if (guestError) {
          console.error("Error inserting guest relationships:", guestError);
          throw guestError;
        }
      }
      
      // Add guest IDs to returned episode
      result.data.guestIds = episodeDTO.guestIds || [];
      
      return result;
    } catch (error) {
      return { data: null, error: this.handleError("create with guests", error) };
    }
  }
  
  /**
   * Update an episode and its guest relationships
   */
  async update(id: string, updateDTO: UpdateEpisodeDTO): Promise<Result<boolean>> {
    try {
      // Update episode with base implementation
      const result = await super.update(id, updateDTO);
      
      if (result.error || !result.data) {
        return result;
      }

      // Handle guest relationships if provided
      if (updateDTO.guestIds !== undefined) {
        // First delete existing relationships
        const { error: deleteError } = await supabase
          .from('episode_guests')
          .delete()
          .eq('episode_id', id);
        
        if (deleteError) throw deleteError;
        
        // Then insert new relationships if any
        if (updateDTO.guestIds.length > 0) {
          const episodeGuestsToInsert = updateDTO.guestIds.map(guestId => ({
            episode_id: id,
            guest_id: guestId
          }));
          
          const { error: insertError } = await supabase
            .from('episode_guests')
            .insert(episodeGuestsToInsert);
            
          if (insertError) throw insertError;
        }
      }
      
      return { data: true, error: null };
    } catch (error) {
      return { data: false, error: this.handleError(`update ${id} with guests`, error) };
    }
  }
  
  /**
   * Delete an episode and its related data
   */
  async delete(id: string): Promise<Result<boolean>> {
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
      
      // Delete the episode with base implementation
      return await super.delete(id);
    } catch (error) {
      return { data: false, error: this.handleError(`delete ${id} with related data`, error) };
    }
  }
}

// Create a singleton instance
export const episodeRepository = new EpisodeRepository();
