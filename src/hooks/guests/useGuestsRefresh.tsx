
import { useState, useCallback, useRef } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Guest } from "@/lib/types";
import { mapDatabaseGuestToGuest } from "@/services/guests/guestMappers";

export function useGuestsRefresh(userId: string | undefined) {
  const [isLoadingGuests, setIsLoadingGuests] = useState(false);
  const lastRefreshTimeRef = useRef<number>(0);
  
  const refreshGuests = useCallback(async () => {
    if (!userId) {
      console.log("No user found, skipping guest refresh");
      return [];
    }
    
    // Prevent multiple rapid refreshes (must be at least 2 seconds apart)
    const now = Date.now();
    if (now - lastRefreshTimeRef.current < 2000) {
      console.log("Skipping refresh, too soon since last refresh");
      return [];
    }
    
    setIsLoadingGuests(true);
    lastRefreshTimeRef.current = now;
    
    try {
      console.log("Fetching guests from database for user:", userId);
      
      // Fetch all guests
      const { data, error } = await supabase
        .from('guests')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      if (!data || data.length === 0) {
        console.log("No guests found in database");
        return [];
      }
      
      const formattedGuests: Guest[] = data.map(guest => mapDatabaseGuestToGuest(guest));
      
      console.log(`Loaded ${formattedGuests.length} guests`);
      return formattedGuests;
    } catch (error: any) {
      toast.error(`Error fetching guests: ${error.message}`);
      console.error("Error fetching guests:", error);
      return [];
    } finally {
      setIsLoadingGuests(false);
    }
  }, [userId]);

  return {
    isLoadingGuests,
    refreshGuests
  };
}
