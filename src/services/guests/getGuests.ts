
import { supabase } from "@/integrations/supabase/client";
import { Guest } from "@/lib/types";
import { mapDatabaseGuestToGuest } from "./guestMappers";

/**
 * Function to get all guests for the current user
 */
export const getUserGuests = async (): Promise<{ data: Guest[] | null; error: any }> => {
  try {
    const { data, error } = await supabase
      .from('guests')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    // Format the guests into our application's Guest type
    const formattedGuests: Guest[] = data?.map(guest => mapDatabaseGuestToGuest(guest)) || [];
    
    return { data: formattedGuests, error: null };
  } catch (error) {
    console.error("Error fetching user guests:", error);
    return { data: null, error };
  }
};

/**
 * Function to get a specific guest
 */
export const getGuest = async (id: string): Promise<{ data: Guest | null; error: any }> => {
  try {
    const { data, error } = await supabase
      .from('guests')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    // Format the guest into our application's Guest type
    const formattedGuest = mapDatabaseGuestToGuest(data);
    
    return { data: formattedGuest, error: null };
  } catch (error) {
    console.error(`Error fetching guest with id ${id}:`, error);
    return { data: null, error };
  }
};
