
import { Episode, EpisodeDTO } from '@/types';
import { EpisodeMapper } from './EpisodeMapper';
import { BaseRepository, TableName } from '../core/BaseRepository';
import { Result } from '../core/Repository';
import { supabase } from '@/integrations/supabase/client';

/**
 * Repository for managing Episode data
 */
export class EpisodeRepository extends BaseRepository<Episode, EpisodeDTO> {
  constructor() {
    super('episodes' as TableName, new EpisodeMapper());
  }
  
  /**
   * Find all episodes for a user
   */
  async findAllForUser(userId: string): Promise<Result<Episode[]>> {
    try {
      const { data, error } = await supabase
        .from('episodes')
        .select('*, episode_guests(*, guests(*))')
        .eq('user_id', userId)
        .order('scheduled', { ascending: false });
      
      if (error) {
        return { success: false, error: new Error(error.message) };
      }
      
      if (!data) {
        return { success: true, data: [] };
      }
      
      // Process and map the episodes with their guests
      const episodes = data.map(episode => {
        // Map the episode to domain model
        return this.mapper.toDomain(episode);
      });
      
      return { success: true, data: episodes };
    } catch (error: any) {
      return this.handleError(error);
    }
  }

  /**
   * Find an episode with its guests
   */
  async findWithGuests(id: string): Promise<Result<Episode>> {
    try {
      const { data, error } = await supabase
        .from('episodes')
        .select('*, episode_guests(*, guests(*))')
        .eq('id', id)
        .single();
      
      if (error) {
        return { success: false, error: new Error(error.message) };
      }
      
      if (!data) {
        return { success: false, error: new Error('Episode not found') };
      }
      
      // Map the episode to domain model with its guests
      const episode = this.mapper.toDomain(data);
      
      return { success: true, data: episode };
    } catch (error: any) {
      return this.handleError(error);
    }
  }
  
  /**
   * Create an episode with its guests
   */
  async createWithGuests(episode: Episode, guestIds: string[]): Promise<Result<Episode>> {
    try {
      // First create the episode
      const { data: createdEpisode, error: episodeError } = await supabase
        .from('episodes')
        .insert(this.mapper.toDB(episode))
        .select()
        .single();
      
      if (episodeError) {
        return { success: false, error: new Error(episodeError.message) };
      }
      
      // If there are guest IDs, create episode_guests relations
      if (guestIds.length > 0) {
        const episodeGuests = guestIds.map(guestId => ({
          episode_id: createdEpisode.id,
          guest_id: guestId
        }));
        
        const { error: guestLinkError } = await supabase
          .from('episode_guests')
          .insert(episodeGuests);
        
        if (guestLinkError) {
          console.error('Error linking guests to episode:', guestLinkError);
          // We don't return an error here since the episode was created
        }
      }
      
      // Return the created episode
      return { 
        success: true, 
        data: this.mapper.toDomain(createdEpisode)
      };
    } catch (error: any) {
      return this.handleError(error);
    }
  }
  
  /**
   * Update an episode and its guest relationships
   */
  async updateWithGuests(id: string, episode: Partial<Episode>, guestIds: string[]): Promise<Result<boolean>> {
    try {
      // First, update the episode
      const { error: episodeError } = await supabase
        .from('episodes')
        .update(this.mapper.toDB(episode))
        .eq('id', id);
      
      if (episodeError) {
        return { success: false, error: new Error(episodeError.message) };
      }
      
      // Delete existing episode_guests relations
      const { error: deleteError } = await supabase
        .from('episode_guests')
        .delete()
        .eq('episode_id', id);
      
      if (deleteError) {
        return { success: false, error: new Error(deleteError.message) };
      }
      
      // If there are guest IDs, create new episode_guests relations
      if (guestIds.length > 0) {
        const episodeGuests = guestIds.map(guestId => ({
          episode_id: id,
          guest_id: guestId
        }));
        
        const { error: guestLinkError } = await supabase
          .from('episode_guests')
          .insert(episodeGuests);
        
        if (guestLinkError) {
          return { success: false, error: new Error(guestLinkError.message) };
        }
      }
      
      return { success: true };
    } catch (error: any) {
      return this.handleError(error);
    }
  }
  
  /**
   * Delete an episode and its guest relationships
   */
  async deleteWithGuests(id: string): Promise<Result<boolean>> {
    try {
      // Delete episode_guests relations first
      const { error: deleteGuestsError } = await supabase
        .from('episode_guests')
        .delete()
        .eq('episode_id', id);
      
      if (deleteGuestsError) {
        console.error('Error deleting episode guests:', deleteGuestsError);
        // Continue with episode deletion regardless
      }
      
      // Delete the episode
      const { error: deleteEpisodeError } = await supabase
        .from('episodes')
        .delete()
        .eq('id', id);
      
      if (deleteEpisodeError) {
        return { success: false, error: new Error(deleteEpisodeError.message) };
      }
      
      return { success: true };
    } catch (error: any) {
      return this.handleError(error);
    }
  }
  
  // Helper method to handle errors consistently
  private handleError(error: any): Result<any> {
    console.error('Repository error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error : new Error(error.message || 'Unknown error')
    };
  }
  
  // Factory method to get a repository instance
  static getInstance(): EpisodeRepository {
    return new EpisodeRepository();
  }
}
