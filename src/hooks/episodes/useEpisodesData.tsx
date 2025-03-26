
import { useState, useRef, useCallback, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Episode, RecordingLinks, PodcastUrls, Resource } from "@/lib/types";
import { EpisodeStatus } from "@/lib/enums";

function useEpisodesData(userId: string | undefined) {
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [isLoadingEpisodes, setIsLoadingEpisodes] = useState(true);
  const refreshTimerRef = useRef<number>(0);
  const isInitialMountRef = useRef(true);

  // Load episodes on initial mount
  useEffect(() => {
    const loadEpisodes = async () => {
      if (isInitialMountRef.current && userId) {
        console.log("Initial useEpisodesData mount, loading episodes");
        await refreshEpisodes(true);
        isInitialMountRef.current = false;
      }
    };
    
    if (userId) {
      loadEpisodes();
    }
  }, [userId]);

  const refreshEpisodes = useCallback(async (force = false) => {
    if (!userId) {
      console.log("No user found, skipping episode refresh");
      return episodes;
    }
    
    // Prevent rapid refreshes unless forced
    const now = Date.now();
    if (!force && now - refreshTimerRef.current < 2000) {
      console.log("Skipping episodes refresh, too soon since last refresh");
      return episodes;
    }
    
    setIsLoadingEpisodes(true);
    refreshTimerRef.current = now;
    
    try {
      console.log("Fetching episodes from database...");
      
      // Fetch episodes - no user_id filter
      const { data: episodesData, error: episodesError } = await supabase
        .from('episodes')
        .select('*');
      
      if (episodesError) throw episodesError;
      
      if (!episodesData || episodesData.length === 0) {
        console.log("No episodes found in database");
        setEpisodes([]);
        setIsLoadingEpisodes(false);
        return episodes;
      }
      
      // Fetch guest relationships
      const { data: episodeGuestsData, error: episodeGuestsError } = await supabase
        .from('episode_guests')
        .select('episode_id, guest_id');
      
      if (episodeGuestsError) throw episodeGuestsError;
      
      // Organize guest IDs by episode
      const guestsByEpisode: Record<string, string[]> = {};
      
      episodeGuestsData?.forEach(({ episode_id, guest_id }) => {
        if (!guestsByEpisode[episode_id]) {
          guestsByEpisode[episode_id] = [];
        }
        guestsByEpisode[episode_id].push(guest_id);
      });
      
      // Format episodes data
      const formattedEpisodes: Episode[] = episodesData.map(episode => {
        // Add extra debugging for topic field
        console.log(`Processing episode ${episode.id}, topic:`, episode.topic);
        
        // Parse resources safely
        let typedResources: Resource[] = [];
        if (episode.resources && Array.isArray(episode.resources)) {
          typedResources = episode.resources.map((resource: any) => ({
            label: resource.label || '',
            url: resource.url || '',
            description: resource.description || undefined
          }));
        }
        
        return {
          id: episode.id,
          episodeNumber: episode.episode_number,
          title: episode.title,
          topic: episode.topic, 
          scheduled: episode.scheduled,
          publishDate: episode.publish_date || undefined,
          status: episode.status as EpisodeStatus,
          coverArt: episode.cover_art || undefined,
          guestIds: guestsByEpisode[episode.id] || [],
          introduction: episode.introduction,
          notes: episode.notes || '',
          recordingLinks: episode.recording_links ? (episode.recording_links as RecordingLinks) : {},
          podcastUrls: episode.podcast_urls ? (episode.podcast_urls as PodcastUrls) : {},
          resources: typedResources,
          createdAt: episode.created_at,
          updatedAt: episode.updated_at
        };
      });
      
      console.log(`Loaded ${formattedEpisodes.length} episodes`);
      setEpisodes(formattedEpisodes);
      return formattedEpisodes;
      
    } catch (error: any) {
      toast.error(`Error fetching episodes: ${error.message}`);
      console.error("Error fetching episodes:", error);
      return episodes;
    } finally {
      setIsLoadingEpisodes(false);
    }
  }, [userId, episodes]);

  return {
    episodes,
    isLoadingEpisodes,
    refreshEpisodes,
    isInitialMount: isInitialMountRef.current,
    setIsInitialMount: (value: boolean) => {
      isInitialMountRef.current = value;
    }
  };
}

export default useEpisodesData;
