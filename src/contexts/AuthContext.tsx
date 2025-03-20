import { createContext, useContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { Guest, Episode, SocialLinks, RecordingLinks } from "@/lib/types";
import { toast } from "sonner";

type AuthContextType = {
  session: Session | null;
  user: User | null;
  signOut: () => Promise<void>;
  loading: boolean;
  guests: Guest[];
  episodes: Episode[];
  refreshGuests: () => Promise<void>;
  refreshEpisodes: () => Promise<void>;
  isDataLoading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
        
        if (event === 'SIGNED_IN' && session) {
          refreshGuests();
          refreshEpisodes();
        }
        
        if (event === 'SIGNED_OUT') {
          setGuests([]);
          setEpisodes([]);
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      
      if (session) {
        refreshGuests();
        refreshEpisodes();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const refreshGuests = async () => {
    if (!user) return;
    
    setIsDataLoading(true);
    try {
      const { data, error } = await supabase
        .from('guests')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      const formattedGuests: Guest[] = data.map(guest => ({
        id: guest.id,
        name: guest.name,
        title: guest.title,
        company: guest.company || undefined,
        email: guest.email || undefined,
        phone: guest.phone || undefined,
        bio: guest.bio,
        imageUrl: guest.image_url || undefined,
        socialLinks: guest.social_links as SocialLinks,
        notes: guest.notes || undefined,
        backgroundResearch: guest.background_research || undefined,
        status: (guest.status as Guest['status']) || 'potential',
        createdAt: guest.created_at,
        updatedAt: guest.updated_at
      }));
      
      setGuests(formattedGuests);
    } catch (error: any) {
      toast.error(`Error fetching guests: ${error.message}`);
      console.error("Error fetching guests:", error);
    } finally {
      setIsDataLoading(false);
    }
  };

  const refreshEpisodes = async () => {
    if (!user) return;
    
    setIsDataLoading(true);
    try {
      const { data: episodesData, error: episodesError } = await supabase
        .from('episodes')
        .select('*')
        .order('episode_number', { ascending: false });
      
      if (episodesError) throw episodesError;
      
      const { data: episodeGuestsData, error: episodeGuestsError } = await supabase
        .from('episode_guests')
        .select('episode_id, guest_id');
      
      if (episodeGuestsError) throw episodeGuestsError;
      
      const guestsByEpisode: Record<string, string[]> = {};
      
      episodeGuestsData.forEach(({ episode_id, guest_id }) => {
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
        status: episode.status as 'scheduled' | 'recorded' | 'published',
        coverArt: episode.cover_art || undefined,
        guestIds: guestsByEpisode[episode.id] || [],
        introduction: episode.introduction,
        notes: episode.notes || '',
        recordingLinks: episode.recording_links as RecordingLinks || {},
        createdAt: episode.created_at,
        updatedAt: episode.updated_at
      }));
      
      setEpisodes(formattedEpisodes);
    } catch (error: any) {
      toast.error(`Error fetching episodes: ${error.message}`);
      console.error("Error fetching episodes:", error);
    } finally {
      setIsDataLoading(false);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const value = {
    session,
    user,
    signOut,
    loading,
    guests,
    episodes,
    refreshGuests,
    refreshEpisodes,
    isDataLoading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
