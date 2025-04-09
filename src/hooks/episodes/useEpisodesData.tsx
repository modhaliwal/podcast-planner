
import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { Episode } from "@/lib/types";
import { useEpisodeRefresh } from "./useEpisodeRefresh";

export function useEpisodesData(userId: string | undefined) {
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [isLoadingEpisodes, setIsLoadingEpisodes] = useState(true);
  const { refreshEpisodes: fetchEpisodeData } = useEpisodeRefresh(userId);
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
        console.log("User ID became available, triggering initial episode data load");
        refreshEpisodes(true);
      }
    }
  }, [userId]);
  
  // Load episodes on initial mount, but only if userId is available
  useEffect(() => {
    const loadEpisodes = async () => {
      if (userId && !hasLoadedInitialDataRef.current) {
        console.log("Initial useEpisodesData mount, loading episodes for user:", userId);
        setIsLoadingEpisodes(true);
        
        try {
          const fetchedEpisodes = await fetchEpisodeData(true);
          setEpisodes(fetchedEpisodes);
          hasLoadedInitialDataRef.current = true;
          lastFetchTimeRef.current = Date.now();
        } catch (error) {
          console.error("Error loading episodes:", error);
        } finally {
          setIsLoadingEpisodes(false);
          isInitialMountRef.current = false;
        }
      } else if (!userId) {
        console.log("No userId available, skipping initial episodes load");
      }
    };
    
    loadEpisodes();
  }, [fetchEpisodeData, userId]);

  // Create a function that wraps refreshEpisodes and updates the episodes state
  const refreshEpisodes = useCallback(async (force = false) => {
    // Check cache validity if not forced
    if (!force) {
      const now = Date.now();
      const cacheAge = now - lastFetchTimeRef.current;
      
      // If cache is still valid and we have data, return existing data
      if (cacheAge < cacheTTL && episodes.length > 0) {
        console.log("Using cached episode data, age:", Math.round(cacheAge / 1000), "seconds");
        return episodes;
      }
    }
    
    // Throttle refreshes to prevent too many calls
    const now = Date.now();
    if (!force && now - lastFetchTimeRef.current < 2000) {
      console.log("Skipping refresh, too soon since last refresh");
      return episodes;
    }
    
    if (!userId) {
      console.log("Cannot refresh episodes: No user ID available");
      return episodes;
    }
    
    setIsLoadingEpisodes(true);
    lastFetchTimeRef.current = now;
    
    try {
      console.log("Refreshing episodes for user:", userId);
      const fetchedEpisodes = await fetchEpisodeData(force);
      console.log(`Fetched ${fetchedEpisodes.length} episodes`);
      setEpisodes(fetchedEpisodes);
      return fetchedEpisodes;
    } catch (error) {
      console.error("Error refreshing episodes:", error);
      return episodes;
    } finally {
      setIsLoadingEpisodes(false);
    }
  }, [fetchEpisodeData, episodes, userId]);

  // Memoize episodes to prevent unnecessary re-renders
  const memoizedEpisodes = useMemo(() => episodes, [episodes]);

  return {
    episodes: memoizedEpisodes,
    refreshEpisodes,
    isLoadingEpisodes,
    isInitialMount: isInitialMountRef.current,
    setIsInitialMount: (value: boolean) => {
      isInitialMountRef.current = value;
    }
  };
}

// Add a default export as well to maintain backward compatibility
export default useEpisodesData;
