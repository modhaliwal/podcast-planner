
import { useState, useCallback, useRef } from "react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Episode, ContentVersion } from "@/lib/types";
import { Json } from "@/integrations/supabase/types";

// Helper function to safely convert Json array to ContentVersion array
const convertToContentVersions = (data: Json | null): ContentVersion[] | undefined => {
  if (!data) return undefined;
  
  try {
    // Check if the data is an array
    if (Array.isArray(data)) {
      // Verify each item has the required ContentVersion properties
      const isValidContentVersionArray = data.every(item => 
        typeof item === 'object' && 
        item !== null && 
        'id' in item && 
        'content' in item && 
        'timestamp' in item && 
        'source' in item
      );
      
      if (isValidContentVersionArray) {
        return data as ContentVersion[];
      }
    }
    return undefined;
  } catch (err) {
    console.error("Error converting to ContentVersion array:", err);
    return undefined;
  }
};

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
        const formattedEpisodes: Episode[] = data.map(episode => {
          // Safely parse complex JSON fields
          const notesVersions = convertToContentVersions(episode.notes_versions);
          const introductionVersions = convertToContentVersions(episode.introduction_versions);
          
          let podcastUrls: Record<string, string | null> | undefined = undefined;
          let resources: any[] | undefined = undefined;
          let recordingLinks: any | undefined = undefined;
          
          try {
            // Handle podcast_urls
            if (episode.podcast_urls) {
              podcastUrls = episode.podcast_urls as Record<string, string | null>;
            }
            
            // Handle resources
            if (episode.resources) {
              resources = Array.isArray(episode.resources) ? episode.resources : [];
            }
            
            // Handle recording links
            if (episode.recording_links) {
              recordingLinks = episode.recording_links;
            }
          } catch (err) {
            console.error("Error parsing JSON fields:", err);
          }
          
          return {
            id: episode.id,
            title: episode.title || '',
            topic: episode.topic || '',
            episodeNumber: episode.episode_number,
            status: episode.status as "scheduled" | "recorded" | "published",
            scheduled: episode.scheduled,
            publishDate: episode.publish_date,
            notes: episode.notes || '',
            guestIds: [], // Initialize with empty array, will be filled later
            coverArt: episode.cover_art,
            introduction: episode.introduction,
            podcastUrls: podcastUrls || {},
            resources: resources || [],
            recordingLinks: recordingLinks,
            createdAt: episode.created_at,
            updatedAt: episode.updated_at,
            notesVersions,
            introductionVersions
          };
        });
        
        // Now fetch episode-guest relationships
        const { data: episodeGuests, error: epGuestsError } = await supabase
          .from('episode_guests')
          .select('episode_id, guest_id');
          
        if (!epGuestsError && episodeGuests) {
          // Group guest IDs by episode ID
          const guestsByEpisode: Record<string, string[]> = {};
          episodeGuests.forEach(item => {
            if (!guestsByEpisode[item.episode_id]) {
              guestsByEpisode[item.episode_id] = [];
            }
            guestsByEpisode[item.episode_id].push(item.guest_id);
          });
          
          // Assign guest IDs to each episode
          formattedEpisodes.forEach(episode => {
            episode.guestIds = guestsByEpisode[episode.id] || [];
          });
        }
        
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
