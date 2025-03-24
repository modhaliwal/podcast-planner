
import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Guest, SocialLinks } from "@/lib/types";

export function useGuestsData(userId: string | undefined) {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [isLoadingGuests, setIsLoadingGuests] = useState(false);
  const [lastRefreshTime, setLastRefreshTime] = useState(0);

  const refreshGuests = useCallback(async () => {
    if (!userId) {
      console.log("No user found, skipping guest refresh");
      return;
    }
    
    // Prevent multiple rapid refreshes (must be at least 2 seconds apart)
    const now = Date.now();
    if (now - lastRefreshTime < 2000) {
      console.log("Skipping refresh, too soon since last refresh");
      return;
    }
    
    setIsLoadingGuests(true);
    setLastRefreshTime(now);
    
    try {
      console.log("Fetching guests from database...");
      
      const { data, error } = await supabase
        .from('guests')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error("Error fetching guests:", error);
        throw error;
      }
      
      if (!data || data.length === 0) {
        console.log("No guests found in database");
        setGuests([]);
        return;
      }
      
      const formattedGuests: Guest[] = data.map(guest => ({
        id: guest.id,
        name: guest.name,
        title: guest.title,
        company: guest.company || undefined,
        email: guest.email || undefined,
        phone: guest.phone || undefined,
        bio: guest.bio,
        imageUrl: guest.image_url || undefined,
        socialLinks: guest.social_links as SocialLinks || {},
        notes: guest.notes || undefined,
        backgroundResearch: guest.background_research || undefined,
        status: (guest.status as Guest['status']) || 'potential',
        createdAt: guest.created_at,
        updatedAt: guest.updated_at
      }));
      
      console.log("Formatted guests:", formattedGuests.length);
      setGuests(formattedGuests);
    } catch (error: any) {
      toast.error(`Error fetching guests: ${error.message}`);
      console.error("Error fetching guests:", error);
    } finally {
      setIsLoadingGuests(false);
    }
  }, [userId, lastRefreshTime]);

  // Add an effect to refresh guests on component mount, but only once
  useEffect(() => {
    if (userId && guests.length === 0) {
      console.log("Initial useGuestsData mount, refreshing guests");
      refreshGuests();
    }
  }, [userId, refreshGuests, guests.length]);

  return {
    guests,
    isLoadingGuests,
    refreshGuests
  };
}
