
import { supabase } from "@/integrations/supabase/client";
import { Guest } from "@/lib/types";
import { prepareGuestForDatabase } from "./guestMappers";

/**
 * Function to create a new guest
 */
export const createGuest = async (guest: Partial<Guest>): Promise<{ data: any | null; error: any }> => {
  try {
    // Get current user ID from Supabase auth
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error("User not authenticated");
    }
    
    // Prepare guest data for database
    const guestData = prepareGuestForDatabase(guest);
    
    const { data, error } = await supabase
      .from('guests')
      .insert({
        user_id: user.id,
        ...guestData,
        created_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return { data, error: null };
  } catch (error) {
    console.error("Error creating guest:", error);
    return { data: null, error };
  }
};
