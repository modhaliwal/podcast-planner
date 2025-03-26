
import { supabase } from "@/integrations/supabase/client";
import { Guest } from "@/lib/types";
import { mapDatabaseGuestToGuest } from "./guestMappers";

/**
 * Function to get all guests for the current user
 */
export const getUserGuests = async (): Promise<{ data: Guest[] | null; error: any }> => {
  try {
    console.log("Fetching all guests from database");
    
    const { data, error } = await supabase
      .from('guests')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error("Error in getUserGuests:", error);
      throw error;
    }
    
    // Format the guests into our application's Guest type
    const formattedGuests: Guest[] = data?.map(guest => mapDatabaseGuestToGuest(guest)) || [];
    console.log(`Found ${formattedGuests.length} guests in database`);
    
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
  if (!id) {
    console.error("No guest ID provided to getGuest");
    return { data: null, error: "No guest ID provided" };
  }
  
  try {
    console.log(`Fetching guest with ID: ${id}`);
    
    const { data, error } = await supabase
      .from('guests')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        console.log(`No guest found with ID ${id}`);
        return { data: null, error: "Guest not found" };
      }
      console.error(`Error fetching guest with ID ${id}:`, error);
      throw error;
    }
    
    if (!data) {
      console.log(`No guest found with ID ${id}`);
      return { data: null, error: "Guest not found" };
    }
    
    // Format the guest into our application's Guest type
    const formattedGuest = mapDatabaseGuestToGuest(data);
    console.log(`Successfully fetched guest: ${formattedGuest.name}`);
    
    return { data: formattedGuest, error: null };
  } catch (error) {
    console.error(`Error fetching guest with id ${id}:`, error);
    return { data: null, error };
  }
};
