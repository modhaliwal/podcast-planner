
import { supabase } from '@/integrations/supabase/client';
import { BaseRepository } from '../core/BaseRepository';
import { Guest } from '@/lib/types';
import { GuestMapper } from './GuestMapper';
import { Result } from '@/lib/types';
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
  user_id: string;
  social_links: Json;
  bio_versions?: Json | null;
  background_research_versions?: Json | null;
}

export class GuestRepository extends BaseRepository<Guest, DBGuest> {
  mapper: GuestMapper = new GuestMapper();

  // Method to update a guest with explicit typing
  async update(id: string, guestData: UpdateGuestDTO): Promise<Result<Guest>> {
    try {
      // First, get the current user ID
      const { data: userData } = await supabase.auth.getUser();
      if (!userData || !userData.user) {
        return { data: null, error: new Error('User not authenticated') };
      }

      // Map update DTO to DB format
      const dbGuest = this.mapper.updateDtoToDB(guestData);
      
      // Update the guest in the database
      const { error } = await supabase
        .from('guests')
        .update(dbGuest)
        .eq('id', id)
        .eq('user_id', userData.user.id);

      if (error) {
        console.error('Error updating guest:', error);
        return { data: null, error: new Error(`Failed to update guest: ${error.message}`) };
      }

      // Get the updated guest
      const { data, error: fetchError } = await supabase
        .from('guests')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchError) {
        console.error('Error fetching updated guest:', fetchError);
        return { data: null, error: new Error(`Failed to fetch updated guest: ${fetchError.message}`) };
      }

      // Map the guest from DB format to domain object
      return { data: this.mapper.toDomain(data), error: null };
    } catch (error) {
      console.error('Unexpected error in update:', error);
      return {
        data: null,
        error: new Error(`Failed to update guest: ${error instanceof Error ? error.message : String(error)}`)
      };
    }
  }

  async getAll(): Promise<Guest[]> {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData || !userData.user) {
        console.error('User not authenticated');
        return [];
      }

      const { data, error } = await supabase
        .from('guests')
        .select('*')
        .eq('user_id', userData.user.id)
        .order('name', { ascending: true });

      if (error) {
        console.error('Error fetching guests:', error);
        return [];
      }

      return data.map(guest => this.mapper.toDomain(guest));
    } catch (error) {
      console.error('Unexpected error in getAll:', error);
      return [];
    }
  }

  async getById(id: string): Promise<Guest | null> {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData || !userData.user) {
        console.error('User not authenticated');
        return null;
      }

      const { data, error } = await supabase
        .from('guests')
        .select('*')
        .eq('id', id)
        .eq('user_id', userData.user.id)
        .single();

      if (error) {
        console.error('Error fetching guest:', error);
        return null;
      }

      return this.mapper.toDomain(data);
    } catch (error) {
      console.error('Unexpected error in getById:', error);
      return null;
    }
  }

  async add(guestData: CreateGuestDTO): Promise<Guest> {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData || !userData.user) {
        throw new Error('User not authenticated');
      }

      // Convert guestData to DB format
      const dbGuest = this.mapper.createDtoToDB(guestData);
      
      // Add user_id
      dbGuest.user_id = userData.user.id;
      
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

  async remove(id: string): Promise<boolean> {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData || !userData.user) {
        console.error('User not authenticated');
        return false;
      }

      const { error } = await supabase
        .from('guests')
        .delete()
        .eq('id', id)
        .eq('user_id', userData.user.id);

      if (error) {
        console.error('Error deleting guest:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Unexpected error in remove:', error);
      return false;
    }
  }
}
