
import { useState, useRef, useEffect, useCallback } from "react";
import { Guest } from "@/lib/types";
import { useGuestsRefresh } from "./useGuestsRefresh";

export function useGuestsData(userId: string | undefined) {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [isLoadingGuests, setIsLoadingGuests] = useState(true);
  const { refreshGuests: fetchGuestData } = useGuestsRefresh(userId);
  const isInitialMountRef = useRef(true);
  const lastFetchTimeRef = useRef<number>(0);
  const hasLoadedInitialDataRef = useRef(false);

  // Load guests on initial mount, but only if not already loaded and userId is available
  useEffect(() => {
    const loadGuests = async () => {
      if (userId && isInitialMountRef.current && !hasLoadedInitialDataRef.current) {
        console.log("Initial useGuestsData mount, refreshing guests for user:", userId);
        setIsLoadingGuests(true);
        
        try {
          const fetchedGuests = await fetchGuestData();
          setGuests(fetchedGuests);
          hasLoadedInitialDataRef.current = true;
        } catch (error) {
          console.error("Error loading guests:", error);
        } finally {
          setIsLoadingGuests(false);
          isInitialMountRef.current = false;
        }
      }
    };
    
    loadGuests();
  }, [fetchGuestData, userId]);

  // Create a function that wraps refreshGuests and updates the guests state
  const refreshGuests = useCallback(async (force = false) => {
    // Throttle refreshes to prevent too many calls
    const now = Date.now();
    if (!force && now - lastFetchTimeRef.current < 2000) {
      console.log("Skipping refresh, too soon since last refresh");
      return guests;
    }
    
    setIsLoadingGuests(true);
    lastFetchTimeRef.current = now;
    
    try {
      console.log("Refreshing guests for user:", userId);
      const fetchedGuests = await fetchGuestData();
      setGuests(fetchedGuests);
      return fetchedGuests;
    } catch (error) {
      console.error("Error refreshing guests:", error);
      return guests;
    } finally {
      setIsLoadingGuests(false);
    }
  }, [fetchGuestData, guests, userId]);

  return {
    guests,
    isLoadingGuests,
    refreshGuests,
    isInitialMount: isInitialMountRef.current,
    setIsInitialMount: (value: boolean) => {
      isInitialMountRef.current = value;
    }
  };
}
