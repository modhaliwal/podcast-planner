
import { useState, useRef, useEffect, useCallback } from "react";
import { Guest } from "@/lib/types";
import { useGuestsRefresh } from "./useGuestsRefresh";

export function useGuestsData(userId: string | undefined) {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [isLoadingGuests, setIsLoadingGuests] = useState(true);
  const { refreshGuests: fetchGuestData } = useGuestsRefresh(userId);
  const isInitialMountRef = useRef(true);
  const lastFetchTimeRef = useRef<number>(0);

  // Load guests on initial mount
  useEffect(() => {
    const loadGuests = async () => {
      if (isInitialMountRef.current) {
        setIsLoadingGuests(true);
        console.log("Initial useGuestsData mount, refreshing guests");
        try {
          const fetchedGuests = await fetchGuestData();
          setGuests(fetchedGuests);
        } catch (error) {
          console.error("Error loading guests:", error);
        } finally {
          setIsLoadingGuests(false);
          isInitialMountRef.current = false;
        }
      }
    };
    
    if (userId) {
      loadGuests();
    }
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
      const fetchedGuests = await fetchGuestData();
      setGuests(fetchedGuests);
      return fetchedGuests;
    } catch (error) {
      console.error("Error refreshing guests:", error);
      return guests;
    } finally {
      setIsLoadingGuests(false);
    }
  }, [fetchGuestData, guests]);

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
