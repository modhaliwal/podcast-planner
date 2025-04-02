
import { supabase } from "@/integrations/supabase/client";
import { EpisodeStatus } from "@/lib/enums";
import { User as AppUser, Episode, ContentVersion } from "@/lib/types";
import { User as SupabaseUser } from "@supabase/supabase-js";
import { EpisodeFormData } from "@/components/episodes/CreateEpisodeForm/types";

interface DBEpisode {
  id: string;
  title: string;
  episode_number: number;
  scheduled: string;
  publish_date?: string;
  status: string;
  introduction: string;
  notes?: string;
  notes_versions?: any;
  cover_art?: string;
  topic?: string;
  podcast_urls?: {
    spotify?: string;
    applePodcasts?: string;
    amazonPodcasts?: string;
    youtube?: string;
  };
  resources?: Array<{
    label: string;
    url: string;
    description?: string;
  }>;
  created_at: string;
  updated_at: string;
  // Legacy fields
  podcast_url?: string;
  youtube_url?: string;
  spotify_url?: string;
  apple_url?: string;
  google_url?: string;
}

// Map from database structure to application structure
export function mapEpisodeFromDB(dbEpisode: any): Episode {
  // Process notes versions if they exist
  let notesVersions: ContentVersion[] | undefined;
  
  try {
    if (dbEpisode.notes_versions) {
      // Handle various input formats for notes_versions
      notesVersions = Array.isArray(dbEpisode.notes_versions) 
        ? dbEpisode.notes_versions 
        : typeof dbEpisode.notes_versions === 'string'
          ? JSON.parse(dbEpisode.notes_versions)
          : [dbEpisode.notes_versions];
    }
  } catch (error) {
    console.error("Error processing notes_versions:", error);
    notesVersions = [];
  }

  // Map podcast URLs from legacy fields if needed
  let podcastUrls = dbEpisode.podcast_urls || {};
  
  // Handle legacy URL fields if present
  if (dbEpisode.podcast_url || dbEpisode.youtube_url || dbEpisode.spotify_url || 
      dbEpisode.apple_url || dbEpisode.google_url) {
    podcastUrls = {
      ...podcastUrls,
      spotify: dbEpisode.spotify_url || podcastUrls.spotify,
      youtube: dbEpisode.youtube_url || podcastUrls.youtube,
      applePodcasts: dbEpisode.apple_url || podcastUrls.applePodcasts,
      amazonPodcasts: dbEpisode.google_url || podcastUrls.amazonPodcasts
    };
  }

  return {
    id: dbEpisode.id,
    title: dbEpisode.title || '',
    episodeNumber: dbEpisode.episode_number,
    scheduled: dbEpisode.scheduled || '',
    publishDate: dbEpisode.publish_date,
    status: dbEpisode.status as EpisodeStatus || EpisodeStatus.SCHEDULED,
    introduction: dbEpisode.introduction || '',
    notes: dbEpisode.notes || '',
    notesVersions: notesVersions,
    topic: dbEpisode.topic,
    guestIds: dbEpisode.guestIds || [],
    coverArt: dbEpisode.cover_art,
    podcastUrls: podcastUrls,
    resources: dbEpisode.resources || [],
    createdAt: dbEpisode.created_at,
    updatedAt: dbEpisode.updated_at
  };
}

// Map from application structure to database structure
export function mapEpisodeToDB(episode: Partial<Episode>): Record<string, any> {
  return {
    title: episode.title,
    episode_number: episode.episodeNumber,
    scheduled: episode.scheduled,
    publish_date: episode.publishDate,
    status: episode.status,
    introduction: episode.introduction,
    notes: episode.notes,
    notes_versions: episode.notesVersions,
    cover_art: episode.coverArt,
    topic: episode.topic,
    podcast_urls: episode.podcastUrls,
    resources: episode.resources
  };
}

// Create a type that accepts either User type
type UserParam = AppUser | SupabaseUser;

/**
 * Create multiple episodes
 */
export const createEpisodes = async (
  episodes: EpisodeFormData[],
  user: UserParam
): Promise<{ success: boolean; error?: any }> => {
  try {
    // Ensure we have a user ID
    if (!user || !user.id) {
      throw new Error("User ID is required");
    }

    // Save each episode to the database
    for (const episode of episodes) {
      const { error } = await supabase
        .from('episodes')
        .insert({
          user_id: user.id,
          episode_number: episode.episodeNumber,
          title: episode.title || `Episode #${episode.episodeNumber}`,
          topic: episode.topic || null,
          scheduled: episode.scheduled.toISOString(),
          status: EpisodeStatus.SCHEDULED,
          introduction: `Introduction for Episode #${episode.episodeNumber}`,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
    }
    
    return { success: true };
  } catch (error) {
    console.error("Error creating episodes:", error);
    return { success: false, error };
  }
};

/**
 * Get all episodes for the current user
 */
export const getUserEpisodes = async (): Promise<{ data: Episode[] | null; error: any }> => {
  try {
    const { data, error } = await supabase
      .from('episodes')
      .select('*')
      .order('episode_number', { ascending: false });
    
    if (error) throw error;
    
    // Map DB episodes to application episodes
    const episodes = data.map(mapEpisodeFromDB);
    
    return { data: episodes, error: null };
  } catch (error) {
    console.error("Error fetching episodes:", error);
    return { data: null, error };
  }
};

/**
 * Get a specific episode by ID
 */
export const getEpisode = async (id: string): Promise<{ data: Episode | null; error: any }> => {
  try {
    const { data, error } = await supabase
      .from('episodes')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    // Map DB episode to application episode
    const episode = mapEpisodeFromDB(data);
    
    return { data: episode, error: null };
  } catch (error) {
    console.error(`Error fetching episode with id ${id}:`, error);
    return { data: null, error };
  }
};

/**
 * Update an episode by ID
 */
export const updateEpisode = async (id: string, updates: Partial<Episode>): Promise<{ success: boolean; error?: any }> => {
  try {
    // Convert application model to DB model
    const dbUpdates = mapEpisodeToDB(updates);
    
    const { error } = await supabase
      .from('episodes')
      .update({
        ...dbUpdates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);
    
    if (error) throw error;
    
    return { success: true };
  } catch (error) {
    console.error(`Error updating episode with id ${id}:`, error);
    return { success: false, error };
  }
};

/**
 * Delete an episode by ID
 */
export const deleteEpisode = async (id: string): Promise<{ success: boolean; error?: any }> => {
  try {
    const { error } = await supabase
      .from('episodes')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    return { success: true };
  } catch (error) {
    console.error(`Error deleting episode with id ${id}:`, error);
    return { success: false, error };
  }
};
