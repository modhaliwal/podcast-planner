
import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useGuestsData } from "@/hooks/guests/useGuestsData";
import { default as useEpisodesData } from "@/hooks/episodes/useEpisodesData";
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
  refreshAllData: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [appUser, setAppUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Pass the user ID directly to data hooks
  const { 
    guests, 
    isLoadingGuests, 
    refreshGuests 
  } = useGuestsData(user?.id);
  
  const { 
    episodes, 
    isLoadingEpisodes, 
    refreshEpisodes 
  } = useEpisodesData(user?.id);
  
  const isDataLoading = isLoadingGuests || isLoadingEpisodes;

  // Unified data refresh function
  const refreshAllData = useCallback(async () => {
    if (!user?.id) {
      console.log("Cannot refresh data: No user ID available");
      return;
    }
    
    console.log("Refreshing all data for user:", user.id);
    
    try {
      // First refresh guests with force=true
      const refreshedGuests = await refreshGuests(true);
      console.log(`Refreshed ${refreshedGuests.length} guests`);
      
      // Then refresh episodes with force=true
      const refreshedEpisodes = await refreshEpisodes(true);
      console.log(`Refreshed ${refreshedEpisodes.length} episodes`);
    } catch (error) {
      console.error("Error refreshing all data:", error);
    }
  }, [user, refreshGuests, refreshEpisodes]);

  const refreshUserProfile = async () => {
    if (user) {
      try {
        const { user: profile } = await getCurrentUserProfile();
        if (profile) {
          setAppUser(profile);
        }
      } catch (error) {
        console.error("Error refreshing user profile:", error);
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
          // Data loading will happen in the useEffect hooks of the data hooks
          toast({
            title: "Success",
            description: "Signed in successfully"
          });
        }
        
        if (event === 'SIGNED_OUT') {
          setAppUser(null);
          toast({
            title: "Info",
            description: "Signed out successfully"
          });
        }

        setLoading(false);
      }
    );

    // Get the initial session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        await refreshUserProfile();
        // Data loading will happen in the useEffect hooks of the data hooks
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
        toast({
          title: "Error",
          description: `Sign out error: ${error.message}`,
          variant: "destructive"
        });
      } else {
        window.location.href = "/";
      }
    } catch (error: any) {
      console.error("Unexpected error during sign out:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while signing out",
        variant: "destructive"
      });
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
    isDataLoading,
    refreshAllData
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
