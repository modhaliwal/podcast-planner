
import { supabase } from "@/integrations/supabase/client";
import { BaseRepository } from "./BaseRepository";
import { Guest } from "@/lib/types";
import { mapDatabaseGuestToGuest } from "@/services/guests/guestMappers";
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
      
      const guests = data?.map(guest => mapDatabaseGuestToGuest(guest)) || [];
      
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
      
      const guest = mapDatabaseGuestToGuest(data);
      
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
      // Implementation for creating a guest
      // This would convert the Guest type to the database schema format
      // and insert it into the database
      
      // This is a simplified implementation
      return { data: null, error: new Error("Not implemented") };
    } catch (error: any) {
      return { data: null, error };
    }
  }
  
  /**
   * Update an existing guest
   */
  async update(id: string, updates: Partial<Guest>): Promise<{ success: boolean; error: Error | null }> {
    try {
      // Implementation for updating a guest
      // This would convert the Guest updates to the database schema format
      // and update the record in the database
      
      // This is a simplified implementation
      return { success: false, error: new Error("Not implemented") };
    } catch (error: any) {
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
