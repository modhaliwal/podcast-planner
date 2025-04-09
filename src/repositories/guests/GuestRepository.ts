
import { Guest } from '@/lib/types';
import { GuestMapper } from './GuestMapper';
import { BaseRepository, TableName } from '../core/BaseRepository';
import { supabase } from '@/integrations/supabase/client';

/**
 * Repository for managing Guest data
 */
export class GuestRepository extends BaseRepository<Guest, any> {
  constructor() {
    super('guests' as TableName, new GuestMapper());
  }
  
  /**
   * Find all guests
   */
  async findAll(): Promise<Guest[]> {
    try {
      const { data, error } = await supabase
        .from('guests')
        .select('*')
        .order('name');
      
      if (error) throw error;
      
      return data?.map(guest => this.mapper.toDomain(guest)) || [];
    } catch (error: any) {
      console.error('Error getting all guests:', error);
      return [];
    }
  }
  
  /**
   * Find guest by ID
   */
  async findById(id: string): Promise<Guest | null> {
    try {
      const { data, error } = await supabase
        .from('guests')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      return this.mapper.toDomain(data);
    } catch (error: any) {
      console.error('Error getting guest by ID:', error);
      return null;
    }
  }
  
  /**
   * Add a new guest
   */
  async add(guest: Partial<Guest>): Promise<Guest> {
    try {
      const guestData = this.mapper.toDB(guest);
      
      const { data, error } = await supabase
        .from('guests')
        .insert(guestData)
        .select()
        .single();
      
      if (error) throw error;
      
      return this.mapper.toDomain(data);
    } catch (error: any) {
      console.error('Error creating guest:', error);
      throw error;
    }
  }
  
  /**
   * Update a guest
   */
  async update(id: string, guest: Partial<Guest>): Promise<Guest | null> {
    try {
      const guestData = this.mapper.toDB(guest);
      
      const { data, error } = await supabase
        .from('guests')
        .update(guestData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      return this.mapper.toDomain(data);
    } catch (error: any) {
      console.error('Error updating guest:', error);
      return null;
    }
  }
  
  /**
   * Delete a guest
   */
  async delete(id: string): Promise<boolean> {
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
      
      return true;
    } catch (error: any) {
      console.error('Error deleting guest:', error);
      return false;
    }
  }
}
