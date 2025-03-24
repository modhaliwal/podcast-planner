import { createContext, useContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useGuestsData } from "@/hooks/useGuestsData";
import { useEpisodesData } from "@/hooks/useEpisodesData";

type AuthContextType = {
  session: Session | null;
  user: User | null;
  signOut: () => Promise<void>;
  loading: boolean;
  guests: ReturnType<typeof useGuestsData>['guests'];
  episodes: ReturnType<typeof useEpisodesData>['episodes'];
  refreshGuests: ReturnType<typeof useGuestsData>['refreshGuests'];
  refreshEpisodes: ReturnType<typeof useEpisodesData>['refreshEpisodes'];
  isDataLoading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  const { guests, isLoadingGuests, refreshGuests } = useGuestsData(user?.id);
  const { episodes, isLoadingEpisodes, refreshEpisodes } = useEpisodesData(user?.id);
  
  const isDataLoading = isLoadingGuests || isLoadingEpisodes;

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
          // No need to clear guests and episodes, the hooks will handle that
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
