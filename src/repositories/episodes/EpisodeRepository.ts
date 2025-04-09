
import { supabase } from "@/integrations/supabase/client";
import { BaseRepository } from "../core/BaseRepository";
import { Episode } from "@/lib/types";
import { EpisodeMapper } from "./EpisodeMapper";
import { Result } from "@/lib/types";
import { CreateEpisodeDTO, DBEpisode, UpdateEpisodeDTO } from "./EpisodeDTO";

/**
 * Repository for handling episode data
 */
export class EpisodeRepository extends BaseRepository<Episode, DBEpisode> {
  mapper = new EpisodeMapper();
  
  /**
   * Get all episodes for the current user
   */
  async getAll(): Promise<Episode[]> {
    try {
      const { data: userData } = await supabase.auth.getUser();
      
      if (!userData || !userData.user) {
        console.error("No authenticated user found");
        return [];
      }
      
      const { data, error } = await supabase
        .from("episodes")
        .select(`
          id, 
          title, 
          episode_number,
          topic,
          cover_art,
          scheduled,
          publish_date,
          status,
          introduction,
          notes,
          notes_versions,
          introduction_versions,
          recording_links,
          podcast_urls,
          resources,
          created_at,
          updated_at,
          episode_guests (
            guest_id
          )
        `)
        .order("episode_number", { ascending: false });
        
      if (error) {
        console.error("Error fetching episodes:", error);
        return [];
      }
      
      // Map database records to domain objects
      return this.mapper.mapManyFromDB(data || []);
      
    } catch (error) {
      console.error("Unexpected error in getAll:", error);
      return [];
    }
  }
  
  /**
   * Get a specific episode by ID
   */
  async getById(id: string): Promise<Episode | null> {
    try {
      const { data, error } = await supabase
        .from("episodes")
        .select(`
          id, 
          title, 
          episode_number,
          topic,
          cover_art,
          scheduled,
          publish_date,
          status,
          introduction,
          notes,
          notes_versions,
          introduction_versions,
          recording_links,
          podcast_urls,
          resources,
          created_at,
          updated_at,
          episode_guests (
            guest_id
          )
        `)
        .eq("id", id)
        .single();
        
      if (error) {
        console.error(`Error fetching episode with ID ${id}:`, error);
        return null;
      }
      
      return this.mapper.mapFromDB(data);
      
    } catch (error) {
      console.error(`Unexpected error in getById(${id}):`, error);
      return null;
    }
  }
  
  /**
   * Add a new episode
   */
  async add(episode: CreateEpisodeDTO): Promise<Episode> {
    try {
      // Get current user ID
      const { data: userData } = await supabase.auth.getUser();
      if (!userData || !userData.user) {
        throw new Error("User not authenticated");
      }
      
      // Convert to DB format
      const dbEpisode = this.mapper.createDtoToDB(episode);
      // Add user ID
      dbEpisode.user_id = userData.user.id;
      
      // Insert the episode
      const { data, error } = await supabase
        .from("episodes")
        .insert(dbEpisode)
        .select()
        .single();
      
      if (error) {
        console.error("Error adding episode:", error);
        throw new Error(`Failed to add episode: ${error.message}`);
      }
      
      // For each guest ID, create a relationship in episode_guests
      if (episode.guestIds && episode.guestIds.length > 0) {
        const guestLinks = episode.guestIds.map(guestId => ({
          episode_id: data.id,
          guest_id: guestId
        }));
        
        const { error: linkError } = await supabase
          .from("episode_guests")
          .insert(guestLinks);
          
        if (linkError) {
          console.error("Error linking guests to episode:", linkError);
          // Continue anyway, we have the episode
        }
      }
      
      // Get the full episode including relationships
      const fullEpisode = await this.getById(data.id);
      if (!fullEpisode) {
        throw new Error("Failed to retrieve created episode");
      }
      
      return fullEpisode;
      
    } catch (error) {
      console.error("Unexpected error in add:", error);
      throw new Error(`Failed to add episode: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  
  /**
   * Update an existing episode
   */
  async update(id: string, episode: UpdateEpisodeDTO): Promise<Result<Episode>> {
    try {
      // Get current user ID
      const { data: userData } = await supabase.auth.getUser();
      if (!userData || !userData.user) {
        return { data: null, error: new Error("User not authenticated") };
      }
      
      // Convert to DB format (partial update)
      const dbEpisode = this.mapper.updateDtoToDB(episode);
      
      // Update the episode
      const { error } = await supabase
        .from("episodes")
        .update(dbEpisode)
        .eq("id", id)
        .eq("user_id", userData.user.id);
      
      if (error) {
        console.error("Error updating episode:", error);
        return { data: null, error: new Error(`Failed to update episode: ${error.message}`) };
      }
      
      // Handle guest relationships if needed
      if (episode.guestIds) {
        // First delete existing relationships
        const { error: deleteError } = await supabase
          .from("episode_guests")
          .delete()
          .eq("episode_id", id);
          
        if (deleteError) {
          console.error("Error removing episode-guest relationships:", deleteError);
          // Continue anyway
        }
        
        // Then add new relationships
        if (episode.guestIds.length > 0) {
          const guestLinks = episode.guestIds.map(guestId => ({
            episode_id: id,
            guest_id: guestId
          }));
          
          const { error: linkError } = await supabase
            .from("episode_guests")
            .insert(guestLinks);
            
          if (linkError) {
            console.error("Error creating episode-guest relationships:", linkError);
            // Continue anyway
          }
        }
      }
      
      // Get the updated episode
      const updatedEpisode = await this.getById(id);
      if (!updatedEpisode) {
        return { data: null, error: new Error("Failed to retrieve updated episode") };
      }
      
      return { data: updatedEpisode, error: null };
      
    } catch (error) {
      console.error("Unexpected error in update:", error);
      return { 
        data: null, 
        error: new Error(`Failed to update episode: ${error instanceof Error ? error.message : String(error)}`) 
      };
    }
  }
  
  /**
   * Delete an episode
   */
  async remove(id: string): Promise<boolean> {
    try {
      // First delete episode-guest relationships
      const { error: relError } = await supabase
        .from("episode_guests")
        .delete()
        .eq("episode_id", id);
        
      if (relError) {
        console.error("Error deleting episode-guest relationships:", relError);
        // Continue anyway
      }
      
      // Then delete the episode
      const { error } = await supabase
        .from("episodes")
        .delete()
        .eq("id", id);
        
      if (error) {
        console.error("Error deleting episode:", error);
        return false;
      }
      
      return true;
      
    } catch (error) {
      console.error("Unexpected error in remove:", error);
      return false;
    }
  }
}
