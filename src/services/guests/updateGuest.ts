
import { supabase } from "@/integrations/supabase/client";
import { Guest } from "@/lib/types";
import { prepareGuestForDatabase } from "./guestMappers";

/**
 * Function to update a guest
 */
export const updateGuest = async (id: string, updates: Partial<Guest>): Promise<{ success: boolean; error?: any }> => {
  try {
    // Prepare guest data for database
    const guestData = prepareGuestForDatabase(updates);
    
    const { error } = await supabase
      .from('guests')
      .update(guestData)
      .eq('id', id);
    
    if (error) throw error;
    
    return { success: true };
  } catch (error) {
    console.error(`Error updating guest with id ${id}:`, error);
    return { success: false, error };
  }
};
