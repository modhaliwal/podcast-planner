
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Episode, RecordingLinks } from "@/lib/types";
import { EpisodeStatus } from "@/lib/enums";

export function useEpisodesData(userId: string | undefined) {
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [isLoadingEpisodes, setIsLoadingEpisodes] = useState(false);

  const refreshEpisodes = async () => {
    if (!userId) {
      console.log("No user found, skipping episode refresh");
      return;
    }
    
    setIsLoadingEpisodes(true);
    try {
      console.log("Fetching episodes from database...");
      
      const { data: episodesData, error: episodesError } = await supabase
        .from('episodes')
        .select('*');
      
      if (episodesError) {
        console.error("Error fetching episodes:", episodesError);
        throw episodesError;
      }
      
      if (!episodesData || episodesData.length === 0) {
        console.log("No episodes found in database");
        setEpisodes([]);
        return;
      }
      
      const { data: episodeGuestsData, error: episodeGuestsError } = await supabase
        .from('episode_guests')
        .select('episode_id, guest_id');
      
      if (episodeGuestsError) throw episodeGuestsError;
      
      const guestsByEpisode: Record<string, string[]> = {};
      
      episodeGuestsData?.forEach(({ episode_id, guest_id }) => {
        if (!guestsByEpisode[episode_id]) {
          guestsByEpisode[episode_id] = [];
        }
        guestsByEpisode[episode_id].push(guest_id);
      });
      
      const formattedEpisodes: Episode[] = episodesData.map(episode => ({
        id: episode.id,
        episodeNumber: episode.episode_number,
        title: episode.title,
        scheduled: episode.scheduled,
        publishDate: episode.publish_date || undefined,
        status: episode.status as EpisodeStatus,
        coverArt: episode.cover_art || undefined,
        guestIds: guestsByEpisode[episode.id] || [],
        introduction: episode.introduction,
        notes: episode.notes || '',
        recordingLinks: episode.recording_links ? (episode.recording_links as RecordingLinks) : {},
        createdAt: episode.created_at,
        updatedAt: episode.updated_at
      }));
      
      console.log("Formatted episodes:", formattedEpisodes.length);
      setEpisodes(formattedEpisodes);
      
    } catch (error: any) {
      toast.error(`Error fetching episodes: ${error.message}`);
      console.error("Error fetching episodes:", error);
    } finally {
      setIsLoadingEpisodes(false);
    }
  };

  return {
    episodes,
    isLoadingEpisodes,
    refreshEpisodes
  };
}
