import { supabase } from '@/integrations/supabase/client';
import { BaseRepository } from '../core/BaseRepository';
import { Guest } from '@/lib/types';
import { GuestMapper } from './GuestMapper';
import { Result } from '@/lib/types';

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
  website: string | null;
  twitter: string | null;
  linkedin: string | null;
  notes: string | null;
  background_research: string | null;
  status: string | null;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export class GuestRepository extends BaseRepository<Guest, DBGuest> {
  private mapper: GuestMapper = new GuestMapper();

  // Method to update a guest with explicit typing
  async update(id: string, guestData: UpdateGuestDTO): Promise<Result<Guest>> {
    try {
      // First, get the current user ID
      const { data: userData } = await supabase.auth.getUser();
      if (!userData || !userData.user) {
        return { data: null, error: new Error('User not authenticated') };
      }

      // Map update DTO to DB format
      const dbGuest: Record<string, any> = {};
      
      if (guestData.name !== undefined) dbGuest.name = guestData.name;
      if (guestData.title !== undefined) dbGuest.title = guestData.title || null;
      if (guestData.company !== undefined) dbGuest.company = guestData.company || null;
      if (guestData.bio !== undefined) dbGuest.bio = guestData.bio;
      if (guestData.email !== undefined) dbGuest.email = guestData.email || null;
      if (guestData.phone !== undefined) dbGuest.phone = guestData.phone || null;
      if (guestData.location !== undefined) dbGuest.location = guestData.location || null;
      if (guestData.imageUrl !== undefined) dbGuest.image = guestData.imageUrl || null;
      if (guestData.website !== undefined) dbGuest.website = guestData.website || null;
      if (guestData.twitter !== undefined) dbGuest.twitter = guestData.twitter || null;
      if (guestData.linkedin !== undefined) dbGuest.linkedin = guestData.linkedin || null;
      if (guestData.notes !== undefined) dbGuest.notes = guestData.notes || null;
      if (guestData.backgroundResearch !== undefined) dbGuest.background_research = guestData.backgroundResearch || null;
      if (guestData.status !== undefined) dbGuest.status = guestData.status || null;

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
      return { data: this.mapper.mapFromDB(data), error: null };
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

      return data.map(this.mapper.mapFromDB);
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

      return this.mapper.mapFromDB(data);
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

      const { data, error } = await supabase
        .from('guests')
        .insert([
          {
            user_id: userData.user.id,
            name: guestData.name,
            title: guestData.title || null,
            company: guestData.company || null,
            bio: guestData.bio || '',
            email: guestData.email || null,
            phone: guestData.phone || null,
            location: guestData.location || null,
            image: guestData.imageUrl || null,
            website: guestData.website || null,
            twitter: guestData.twitter || null,
            linkedin: guestData.linkedin || null,
            notes: guestData.notes || null,
            background_research: guestData.backgroundResearch || null,
            status: guestData.status || null,
          },
        ])
        .select()
        .single();

      if (error) {
        console.error('Error adding guest:', error);
        throw new Error(`Failed to add guest: ${error.message}`);
      }

      return this.getById(data.id) as Guest;
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
