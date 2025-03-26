
import { supabase } from "@/integrations/supabase/client";

/**
 * Function to delete a guest
 */
export const deleteGuest = async (id: string): Promise<{ success: boolean; error?: any }> => {
  try {
    const { error } = await supabase
      .from('guests')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    return { success: true };
  } catch (error) {
    console.error(`Error deleting guest with id ${id}:`, error);
    return { success: false, error };
  }
};
