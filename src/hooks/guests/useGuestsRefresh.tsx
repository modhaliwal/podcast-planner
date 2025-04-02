
import { useState, useCallback, useRef } from "react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Guest } from "@/lib/types";
import { mapDatabaseGuestToGuest } from "@/utils/mappers";

export function useGuestsRefresh(userId: string | undefined) {
  const [error, setError] = useState<Error | null>(null);
  const lastRefreshTimeRef = useRef<number>(0);
  const refreshPromiseRef = useRef<Promise<Guest[]> | null>(null);
  
  const refreshGuests = useCallback(async (force = false) => {
    if (!userId) {
      console.log("No user ID found, skipping guest refresh");
      return [];
    }
    
    // Prevent multiple rapid refreshes unless forced
    const now = Date.now();
    if (!force && now - lastRefreshTimeRef.current < 2000) {
      console.log("Skipping refresh, too soon since last refresh");
      
      // If we have an in-flight refresh, return that promise instead of starting a new one
      if (refreshPromiseRef.current) {
        console.log("Using in-flight guests refresh promise");
        return refreshPromiseRef.current;
      }
      
      return [];
    }
    
    // Update last refresh time
    lastRefreshTimeRef.current = now;
    
    // Create a new refresh promise
    const fetchPromise = (async () => {
      try {
        console.log("Fetching guests from database for user:", userId);
        setError(null);
        
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
        console.error("Error fetching guests:", error);
        setError(error);
        toast({
          title: "Error fetching guests",
          description: error.message,
          variant: "destructive"
        });
        return [];
      } finally {
        refreshPromiseRef.current = null;
      }
    })();
    
    // Store the promise so we can reuse it for duplicate calls
    refreshPromiseRef.current = fetchPromise;
    
    return fetchPromise;
  }, [userId]);

  return {
    error,
    refreshGuests
  };
}
