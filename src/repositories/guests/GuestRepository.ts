
import { supabase } from '@/integrations/supabase/client';
import { BaseRepository } from '../core/BaseRepository';
import { Guest } from '@/lib/types';
import { GuestMapper } from './GuestMapper';
import { Json } from '@/integrations/supabase/types';

// Define specific types for create/update operations
export interface CreateGuestDTO {
  name: string;
  title?: string;
  company?: string;
  bio?: string;
  email?: string;
  phone?: string;
  location?: string;
  imageUrl?: string;
  website?: string;
  twitter?: string;
  linkedin?: string;
  notes?: string;
  backgroundResearch?: string;
  status?: 'potential' | 'contacted' | 'confirmed' | 'appeared';
}

export interface UpdateGuestDTO {
  name?: string;
  title?: string;
  company?: string;
  bio?: string;
  email?: string;
  phone?: string;
  location?: string;
  imageUrl?: string;
  website?: string;
  twitter?: string;
  linkedin?: string;
  notes?: string;
  backgroundResearch?: string;
  status?: 'potential' | 'contacted' | 'confirmed' | 'appeared';
}

export interface DBGuest {
  id: string;
  name: string;
  title: string | null;
  company: string | null;
  bio: string;
  email: string | null;
  phone: string | null;
  location: string | null;
  image: string | null;
  image_url: string | null;
  website: string | null;
  twitter: string | null;
  linkedin: string | null;
  notes: string | null;
  background_research: string | null;
  status: string | null;
  created_at: string;
  updated_at: string;
  social_links: Json;
  bio_versions?: Json | null;
  background_research_versions?: Json | null;
}

export class GuestRepository extends BaseRepository<Guest, DBGuest> {
  constructor() {
    super('guests', new GuestMapper());
  }

  // Method to update a guest with explicit typing
  async update(id: string, guestData: UpdateGuestDTO): Promise<Guest | null> {
    try {
      // Map update DTO to DB format
      const dbGuest = this.mapper.updateDtoToDB(guestData);
      
      // Update the guest in the database
      const { error } = await supabase
        .from('guests')
        .update(dbGuest)
        .eq('id', id);

      if (error) {
        console.error('Error updating guest:', error);
        return null;
      }

      // Get the updated guest
      return await this.getById(id);
    } catch (error) {
      console.error('Unexpected error in update:', error);
      return null;
    }
  }

  // Override getAll to implement specific requirements
  async getAll(): Promise<Guest[]> {
    try {
      const { data, error } = await supabase
        .from('guests')
        .select('*')
        .order('name', { ascending: true });

      if (error) {
        console.error('Error fetching guests:', error);
        return [];
      }

      // Ensure data is properly typed before mapping
      return (data || []).map(guest => this.mapper.toDomain(guest as DBGuest));
    } catch (error) {
      console.error('Unexpected error in getAll:', error);
      return [];
    }
  }

  // Override getById to implement specific requirements
  async getById(id: string): Promise<Guest | null> {
    try {
      const { data, error } = await supabase
        .from('guests')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching guest:', error);
        return null;
      }

      return this.mapper.toDomain(data as DBGuest);
    } catch (error) {
      console.error('Unexpected error in getById:', error);
      return null;
    }
  }

  // Override add to implement specific requirements
  async add(guestData: CreateGuestDTO): Promise<Guest> {
    try {
      // Convert guestData to DB format
      const dbGuest = this.mapper.createDtoToDB(guestData) as any;
      
      // Set default values for required fields
      dbGuest.bio = guestData.bio || '';
      dbGuest.name = guestData.name;
      dbGuest.title = guestData.title || '';
      dbGuest.social_links = dbGuest.social_links || {};

      const { data, error } = await supabase
        .from('guests')
        .insert(dbGuest)
        .select()
        .single();

      if (error) {
        console.error('Error adding guest:', error);
        throw new Error(`Failed to add guest: ${error.message}`);
      }

      // Get full guest details
      const newGuest = await this.getById(data.id);
      if (!newGuest) {
        throw new Error('Failed to retrieve created guest');
      }
      
      return newGuest;
    } catch (error) {
      console.error('Unexpected error in add:', error);
      throw new Error(`Failed to add guest: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  // Override delete to implement specific requirements
  async delete(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('guests')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting guest:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Unexpected error in delete:', error);
      return false;
    }
  }
}
