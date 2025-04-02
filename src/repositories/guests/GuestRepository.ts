
import { supabase } from "@/integrations/supabase/client";
import { BaseRepository } from "../core/BaseRepository";
import { Guest } from "@/lib/types";
import { guestMapper, DBGuest } from "./GuestMapper";
import { deleteImage } from "@/lib/imageUpload";

/**
 * Repository for guest-related operations
 */
export class GuestRepository extends BaseRepository<Guest> {
  /**
   * Get all guests
   */
  async getAll(): Promise<{ data: Guest[] | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('guests')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      const guests = data?.map(guest => guestMapper.toDomain(guest as unknown as DBGuest)) || [];
      
      return { data: guests, error: null };
    } catch (error: any) {
      console.error("Error fetching guests:", error);
      return { data: null, error };
    }
  }
  
  /**
   * Get guest by ID
   */
  async getById(id: string): Promise<{ data: Guest | null; error: Error | null }> {
    if (!id) {
      return { data: null, error: new Error("No guest ID provided") };
    }
    
    try {
      const { data, error } = await supabase
        .from('guests')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') {
          return { data: null, error: new Error("Guest not found") };
        }
        throw error;
      }
      
      if (!data) {
        return { data: null, error: new Error("Guest not found") };
      }
      
      const guest = guestMapper.toDomain(data as unknown as DBGuest);
      
      return { data: guest, error: null };
    } catch (error: any) {
      console.error(`Error fetching guest with id ${id}:`, error);
      return { data: null, error };
    }
  }
  
  /**
   * Create a new guest
   */
  async create(guest: Partial<Guest>): Promise<{ data: Guest | null; error: Error | null }> {
    try {
      // Get current user from supabase auth
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("User not authenticated");
      }
      
      // Prepare guest data for database
      const dbGuest = guestMapper.toDB(guest);
      
      if (!dbGuest.bio) {
        throw new Error("Guest bio is required");
      }
      if (!dbGuest.name) {
        throw new Error("Guest name is required");
      }
      if (!dbGuest.title) {
        throw new Error("Guest title is required");
      }
      
      // Add required fields for database insert
      const guestToInsert = {
        ...dbGuest,
        user_id: user.id,
        bio: dbGuest.bio,
        name: dbGuest.name,
        title: dbGuest.title,
        social_links: dbGuest.social_links || {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      const { data, error } = await supabase
        .from('guests')
        .insert(guestToInsert)
        .select()
        .single();
      
      if (error) throw error;
      
      return { data: guestMapper.toDomain(data as unknown as DBGuest), error: null };
    } catch (error: any) {
      console.error("Error creating guest:", error);
      return { data: null, error };
    }
  }
  
  /**
   * Update an existing guest
   */
  async update(id: string, updates: Partial<Guest>): Promise<{ success: boolean; error: Error | null }> {
    try {
      // Prepare guest data for database
      const dbUpdates = guestMapper.toDB(updates);
      
      const { error } = await supabase
        .from('guests')
        .update({
          ...dbUpdates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);
      
      if (error) throw error;
      
      return { success: true, error: null };
    } catch (error: any) {
      console.error(`Error updating guest with id ${id}:`, error);
      return { success: false, error };
    }
  }
  
  /**
   * Delete a guest by ID
   */
  async delete(id: string): Promise<{ success: boolean; error: Error | null }> {
    try {
      // First get the guest to access the image URL
      const { data: guest } = await this.getById(id);
      
      if (guest?.imageUrl) {
        // Delete image from storage
        await deleteImage(guest.imageUrl);
      }
      
      // Delete the guest from the database
      const { error } = await supabase
        .from('guests')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      return { success: true, error: null };
    } catch (error: any) {
      console.error(`Error deleting guest with id ${id}:`, error);
      return { success: false, error };
    }
  }
}

// Create a singleton instance
export const guestRepository = new GuestRepository();
