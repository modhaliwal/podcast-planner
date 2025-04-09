
import { Guest } from '@/lib/types';
import { GuestMapper } from './GuestMapper';
import { BaseRepository, TableName } from '../core/BaseRepository';
import { Result } from '../core/Repository';
import { supabase } from '@/integrations/supabase/client';

/**
 * Repository for managing Guest data
 */
export class GuestRepository extends BaseRepository<Guest, any> {
  constructor() {
    super('guests' as TableName, new GuestMapper());
  }
  
  /**
   * Get all guests
   */
  async getAll(): Promise<Result<Guest[]>> {
    try {
      const { data, error } = await supabase
        .from('guests')
        .select('*')
        .order('name');
      
      if (error) throw error;
      
      const guests = data?.map(guest => this.mapper.toDomain(guest)) || [];
      
      return {
        success: true,
        data: guests
      };
    } catch (error: any) {
      console.error('Error getting all guests:', error);
      return {
        success: false,
        error: new Error(error.message || 'Unknown error'),
        data: []
      };
    }
  }
  
  /**
   * Get guest by ID
   */
  async getById(id: string): Promise<Result<Guest>> {
    try {
      const { data, error } = await supabase
        .from('guests')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      const guest = this.mapper.toDomain(data);
      
      return {
        success: true,
        data: guest
      };
    } catch (error: any) {
      console.error('Error getting guest by ID:', error);
      return {
        success: false,
        error: new Error(error.message || 'Unknown error')
      };
    }
  }
  
  /**
   * Create a new guest
   */
  async create(guest: Partial<Guest>): Promise<Result<Guest>> {
    try {
      const guestData = this.mapper.toDB(guest);
      
      const { data, error } = await supabase
        .from('guests')
        .insert(guestData)
        .select()
        .single();
      
      if (error) throw error;
      
      const createdGuest = this.mapper.toDomain(data);
      
      return {
        success: true,
        data: createdGuest
      };
    } catch (error: any) {
      console.error('Error creating guest:', error);
      return {
        success: false,
        error: new Error(error.message || 'Unknown error')
      };
    }
  }
  
  /**
   * Update a guest
   */
  async update(id: string, guest: Partial<Guest>): Promise<Result<boolean>> {
    try {
      const guestData = this.mapper.toDB(guest);
      
      const { error } = await supabase
        .from('guests')
        .update(guestData)
        .eq('id', id);
      
      if (error) throw error;
      
      return {
        success: true
      };
    } catch (error: any) {
      console.error('Error updating guest:', error);
      return {
        success: false,
        error: new Error(error.message || 'Unknown error')
      };
    }
  }
  
  /**
   * Delete a guest
   */
  async delete(id: string): Promise<Result<boolean>> {
    try {
      // First, check if this guest is linked to any episodes
      const { data: linkedEpisodes, error: checkError } = await supabase
        .from('episode_guests')
        .select('episode_id')
        .eq('guest_id', id);
      
      if (checkError) throw checkError;
      
      // If the guest is linked to episodes, delete those links first
      if (linkedEpisodes && linkedEpisodes.length > 0) {
        const { error: unlinkError } = await supabase
          .from('episode_guests')
          .delete()
          .eq('guest_id', id);
        
        if (unlinkError) throw unlinkError;
      }
      
      // Now delete the guest
      const { error } = await supabase
        .from('guests')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      return {
        success: true
      };
    } catch (error: any) {
      console.error('Error deleting guest:', error);
      return {
        success: false,
        error: new Error(error.message || 'Unknown error')
      };
    }
  }
  
  // Factory method to get a repository instance
  static getInstance(): GuestRepository {
    return new GuestRepository();
  }
}
