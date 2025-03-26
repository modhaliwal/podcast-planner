
import { createContext, useContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useGuestsData } from "@/hooks/guests/useGuestsData";
import { useEpisodesData } from "@/hooks/useEpisodesData";
import { User as AppUser } from "@/lib/types";
import { getCurrentUserProfile } from "@/services/userService";

type AuthContextType = {
  session: Session | null;
  user: User | null;
  appUser: AppUser | null;
  signOut: () => Promise<void>;
  loading: boolean;
  guests: ReturnType<typeof useGuestsData>['guests'];
  episodes: ReturnType<typeof useEpisodesData>['episodes'];
  refreshGuests: ReturnType<typeof useGuestsData>['refreshGuests'];
  refreshEpisodes: ReturnType<typeof useEpisodesData>['refreshEpisodes'];
  refreshUserProfile: () => Promise<void>;
  isDataLoading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [appUser, setAppUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Pass the user ID directly without using useAuth
  const { guests, isLoadingGuests, refreshGuests } = useGuestsData(user?.id);
  const { episodes, isLoadingEpisodes, refreshEpisodes } = useEpisodesData(user?.id);
  
  const isDataLoading = isLoadingGuests || isLoadingEpisodes;

  const refreshUserProfile = async () => {
    if (user) {
      const { user: profile } = await getCurrentUserProfile();
      if (profile) {
        setAppUser(profile);
      }
    }
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (event === 'SIGNED_IN' && session) {
          await refreshUserProfile();
          refreshGuests();
          refreshEpisodes();
          toast.success("Signed in successfully!");
        }
        
        if (event === 'SIGNED_OUT') {
          setAppUser(null);
          toast.info("Signed out successfully");
        }

        setLoading(false);
      }
    );

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        await refreshUserProfile();
        refreshGuests();
        refreshEpisodes();
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    try {
      setUser(null);
      setSession(null);
      setAppUser(null);
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("Error during sign out:", error);
        toast.error(`Sign out error: ${error.message}`);
      } else {
        window.location.href = "/";
      }
    } catch (error) {
      console.error("Unexpected error during sign out:", error);
      toast.error("An unexpected error occurred while signing out");
    }
  };

  const value = {
    session,
    user,
    appUser,
    signOut,
    loading,
    guests,
    episodes,
    refreshGuests,
    refreshEpisodes,
    refreshUserProfile,
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
