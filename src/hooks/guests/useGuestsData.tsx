
import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { Guest } from "@/lib/types";
import { useGuestsRefresh } from "./useGuestsRefresh";

export function useGuestsData(userId: string | undefined) {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [isLoadingGuests, setIsLoadingGuests] = useState(true);
  const { refreshGuests: fetchGuestData } = useGuestsRefresh(userId);
  const hasLoadedInitialDataRef = useRef(false);
  const lastFetchTimeRef = useRef<number>(0);
  const isInitialMountRef = useRef(true);
  const userIdRef = useRef<string | undefined>(undefined);
  const cacheTTL = 60000; // 1 minute cache TTL

  // Track changes to userId
  useEffect(() => {
    if (userId && userId !== userIdRef.current) {
      console.log("User ID changed or became available:", userId);
      userIdRef.current = userId;
      
      // If we have a new userId but haven't loaded data yet, trigger a refresh
      if (!hasLoadedInitialDataRef.current && userId) {
        console.log("User ID became available, triggering initial guest data load");
        refreshGuests(true);
      }
    }
  }, [userId]);
  
  // Load guests on initial mount, but only if userId is available
  useEffect(() => {
    const loadGuests = async () => {
      if (userId && !hasLoadedInitialDataRef.current) {
        console.log("Initial useGuestsData mount, loading guests for user:", userId);
        setIsLoadingGuests(true);
        
        try {
          const fetchedGuests = await fetchGuestData(true);
          setGuests(fetchedGuests);
          hasLoadedInitialDataRef.current = true;
          lastFetchTimeRef.current = Date.now();
        } catch (error) {
          console.error("Error loading guests:", error);
        } finally {
          setIsLoadingGuests(false);
          isInitialMountRef.current = false;
        }
      } else if (!userId) {
        console.log("No userId available, skipping initial guests load");
      }
    };
    
    loadGuests();
  }, [fetchGuestData, userId]);

  // Create a function that wraps refreshGuests and updates the guests state
  const refreshGuests = useCallback(async (force = false) => {
    // Check cache validity if not forced
    if (!force) {
      const now = Date.now();
      const cacheAge = now - lastFetchTimeRef.current;
      
      // If cache is still valid and we have data, return existing data
      if (cacheAge < cacheTTL && guests.length > 0) {
        console.log("Using cached guest data, age:", Math.round(cacheAge / 1000), "seconds");
        return guests;
      }
    }
    
    // Throttle refreshes to prevent too many calls
    const now = Date.now();
    if (!force && now - lastFetchTimeRef.current < 2000) {
      console.log("Skipping refresh, too soon since last refresh");
      return guests;
    }
    
    if (!userId) {
      console.log("Cannot refresh guests: No user ID available");
      return guests;
    }
    
    setIsLoadingGuests(true);
    lastFetchTimeRef.current = now;
    
    try {
      console.log("Refreshing guests for user:", userId);
      const fetchedGuests = await fetchGuestData(force);
      console.log(`Fetched ${fetchedGuests.length} guests`);
      setGuests(fetchedGuests);
      return fetchedGuests;
    } catch (error) {
      console.error("Error refreshing guests:", error);
      return guests;
    } finally {
      setIsLoadingGuests(false);
    }
  }, [fetchGuestData, guests, userId]);

  // Memoize guests to prevent unnecessary re-renders
  const memoizedGuests = useMemo(() => guests, [guests]);

  return {
    guests: memoizedGuests,
    refreshGuests,
    isInitialMount: isInitialMountRef.current,
    setIsInitialMount: (value: boolean) => {
      isInitialMountRef.current = value;
    }
  };
}
