
import { Episode } from '@/lib/types';
import { CreateEpisodeDTO, UpdateEpisodeDTO, DBEpisode } from './EpisodeDTO';
import { EpisodeMapper } from './EpisodeMapper';
import { BaseRepository, TableName } from '../core/BaseRepository';
import { supabase } from '@/integrations/supabase/client';

/**
 * Repository for managing Episode data
 */
export class EpisodeRepository extends BaseRepository<Episode, CreateEpisodeDTO, UpdateEpisodeDTO> {
  constructor() {
    super('episodes' as TableName, new EpisodeMapper());
  }
  
  /**
   * Find all episodes
   */
  async findAll(): Promise<Episode[]> {
    try {
      const { data, error } = await supabase
        .from('episodes')
        .select('*')
        .order('scheduled', { ascending: false });
      
      if (error) throw error;
      
      // Map to domain models
      const episodes = data?.map(episode => this.mapper.toDomain(episode)) || [];
      
      // Fetch episode-guest relationships
      const { data: episodeGuests, error: epGuestsError } = await supabase
        .from('episode_guests')
        .select('episode_id, guest_id');
        
      if (!epGuestsError && episodeGuests) {
        // Group guest IDs by episode ID
        const guestsByEpisode: Record<string, string[]> = {};
        episodeGuests.forEach(item => {
          if (!guestsByEpisode[item.episode_id]) {
            guestsByEpisode[item.episode_id] = [];
          }
          guestsByEpisode[item.episode_id].push(item.guest_id);
        });
        
        // Assign guest IDs to each episode
        episodes.forEach(episode => {
          episode.guestIds = guestsByEpisode[episode.id] || [];
        });
      }
      
      return episodes;
    } catch (error: any) {
      console.error('Repository error:', error);
      return [];
    }
  }

  /**
   * Find an episode by ID
   */
  async findById(id: string): Promise<Episode | null> {
    try {
      const { data, error } = await supabase
        .from('episodes')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      // Map to domain model
      const episode = this.mapper.toDomain(data);
      
      // Fetch guest IDs for this episode
      const { data: episodeGuests, error: epGuestsError } = await supabase
        .from('episode_guests')
        .select('guest_id')
        .eq('episode_id', id);
        
      if (!epGuestsError && episodeGuests) {
        episode.guestIds = episodeGuests.map(item => item.guest_id);
      }
      
      return episode;
    } catch (error: any) {
      console.error('Repository error:', error);
      return null;
    }
  }
  
  /**
   * Add a new episode
   */
  async add(episode: CreateEpisodeDTO): Promise<Episode> {
    try {
      // Prepare the data for insertion
      const dbEpisode = this.mapper.createDtoToDB(episode);
      
      // Add the episode
      const { data, error } = await supabase
        .from('episodes')
        .insert(dbEpisode)
        .select()
        .single();
      
      if (error) throw error;
      
      // Map to domain model
      const createdEpisode = this.mapper.toDomain(data);
      
      return createdEpisode;
    } catch (error: any) {
      console.error('Repository error:', error);
      throw error;
    }
  }
  
  /**
   * Update an episode
   */
  async update(id: string, episode: UpdateEpisodeDTO): Promise<Episode | null> {
    try {
      // Prepare the data for update
      const dbEpisode = this.mapper.toDB(episode as Partial<Episode>);
      
      // Update the episode
      const { data, error } = await supabase
        .from('episodes')
        .update(dbEpisode)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      // Map to domain model
      return this.mapper.toDomain(data);
    } catch (error: any) {
      console.error('Repository error:', error);
      return null;
    }
  }
  
  /**
   * Delete an episode
   */
  async delete(id: string): Promise<boolean> {
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
      
      if (deleteEpisodeError) throw deleteEpisodeError;
      
      return true;
    } catch (error: any) {
      console.error('Repository error:', error);
      return false;
    }
  }
}
