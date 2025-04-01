
import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useGuestsData } from "@/hooks/guests/useGuestsData";
import { default as useEpisodesData } from "@/hooks/episodes/useEpisodesData";
import { User as AppUser, Guest, Episode } from "@/lib/types";
import { getCurrentUserProfile } from "@/services/userService";

type AuthContextType = {
  session: Session | null;
  user: User | null;
  appUser: AppUser | null;
  signOut: () => Promise<void>;
  loading: boolean;
  guests: Guest[];
  episodes: Episode[];
  refreshGuests: (force?: boolean) => Promise<Guest[]>;
  refreshEpisodes: (force?: boolean) => Promise<Episode[]>;
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
  const [initialAuthComplete, setInitialAuthComplete] = useState(false);
  
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
    // Track if this is the first auth state change
    let isFirstAuthEvent = true;
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log("Auth state changed:", event);
        
        // Only update state if there's an actual change needed
        const sessionChanged = JSON.stringify(newSession) !== JSON.stringify(session);
        const userChanged = newSession?.user?.id !== user?.id;
        
        if (sessionChanged) {
          setSession(newSession);
        }
        
        if (userChanged) {
          setUser(newSession?.user ?? null);
        }
        
        // Only show toasts and trigger profile refresh for actual sign in/out events
        // and only after the initial auth check has completed
        if (initialAuthComplete) {
          if (event === 'SIGNED_IN' && newSession) {
            // Only show toast on actual sign-in events, not token refreshes
            if (isFirstAuthEvent || !session) {
              toast({
                title: "Success",
                description: "Signed in successfully"
              });
            }
            
            if (userChanged && newSession.user) {
              await refreshUserProfile();
            }
          }
          
          if (event === 'SIGNED_OUT') {
            setAppUser(null);
            toast({
              title: "Info",
              description: "Signed out successfully"
            });
          }
        }
        
        isFirstAuthEvent = false;
      }
    );

    // Get the initial session
    supabase.auth.getSession().then(async ({ data: { session: initialSession } }) => {
      setSession(initialSession);
      setUser(initialSession?.user ?? null);
      
      if (initialSession?.user) {
        await refreshUserProfile();
      }
      
      setLoading(false);
      setInitialAuthComplete(true);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    try {
      // First complete the Supabase sign-out process
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("Error during sign out:", error);
        toast({
          title: "Error",
          description: `Sign out error: ${error.message}`,
          variant: "destructive"
        });
        return;
      }
      
      // Only after successful sign-out, clear the state
      setUser(null);
      setSession(null);
      setAppUser(null);
      
      // Then navigate
      window.location.href = "/";
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
