
import { useState, useCallback, useRef } from "react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Episode } from "@/lib/types";

export function useEpisodeRefresh(userId: string | undefined) {
  const [error, setError] = useState<Error | null>(null);
  const lastRefreshTimeRef = useRef<number>(0);
  const refreshPromiseRef = useRef<Promise<Episode[]> | null>(null);
  
  const refreshEpisodes = useCallback(async (force = false) => {
    if (!userId) {
      console.log("No user ID found, skipping episode refresh");
      return [];
    }
    
    // Prevent multiple rapid refreshes unless forced
    const now = Date.now();
    if (!force && now - lastRefreshTimeRef.current < 2000) {
      console.log("Skipping refresh, too soon since last refresh");
      
      // If we have an in-flight refresh, return that promise instead of starting a new one
      if (refreshPromiseRef.current) {
        console.log("Using in-flight episodes refresh promise");
        return refreshPromiseRef.current;
      }
      
      return [];
    }
    
    // Update last refresh time
    lastRefreshTimeRef.current = now;
    
    // Create a new refresh promise
    const fetchPromise = (async () => {
      try {
        console.log("Fetching episodes from database for user:", userId);
        setError(null);
        
        // Fetch all episodes
        const { data, error } = await supabase
          .from('episodes')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) {
          throw error;
        }
        
        if (!data || data.length === 0) {
          console.log("No episodes found in database");
          return [];
        }
        
        // Map database data to Episode type
        const formattedEpisodes: Episode[] = data.map(episode => ({
          id: episode.id,
          title: episode.title || '',
          topic: episode.topic || '',
          episodeNumber: episode.episode_number,
          status: episode.status as "scheduled" | "recorded" | "published",
          scheduled: episode.scheduled,
          publishDate: episode.publish_date,
          notes: episode.notes || '',
          guestIds: episode.guest_ids ? episode.guest_ids : [],
          coverArt: episode.cover_art,
          introduction: episode.introduction,
          podcastUrls: episode.podcast_urls ? episode.podcast_urls : {},
          resources: episode.resources ? episode.resources : [],
          createdAt: episode.created_at,
          updatedAt: episode.updated_at
        }));
        
        console.log(`Loaded ${formattedEpisodes.length} episodes`);
        return formattedEpisodes;
      } catch (error: any) {
        console.error("Error fetching episodes:", error);
        setError(error);
        toast({
          title: "Error fetching episodes",
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
    refreshEpisodes
  };
}
