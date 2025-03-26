
import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Guest, ContentVersion } from '@/lib/types';
import { isBlobUrl } from '@/lib/imageUpload';

export function useFetchGuest(guestId: string | undefined) {
  const [isLoading, setIsLoading] = useState(true);
  const [guest, setGuest] = useState<Guest | undefined>(undefined);
  
  const fetchGuest = useCallback(async () => {
    if (!guestId) return;
    
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('guests')
        .select('*')
        .eq('id', guestId)
        .single();
      
      if (error) throw error;
      
      if (data) {
        console.log("Fetched guest data:", data.id);
        
        const imageUrl = data.image_url && !isBlobUrl(data.image_url) 
          ? data.image_url 
          : undefined;
        
        // Parse bioVersions and backgroundResearchVersions if they exist
        let bioVersions: ContentVersion[] = [];
        let backgroundResearchVersions: ContentVersion[] = [];
        
        try {
          if (data.bio_versions && typeof data.bio_versions === 'string') {
            bioVersions = JSON.parse(data.bio_versions);
          } else if (data.bio_versions) {
            // If it's already an object, assign directly
            bioVersions = data.bio_versions as unknown as ContentVersion[];
          }
          
          if (data.background_research_versions && typeof data.background_research_versions === 'string') {
            backgroundResearchVersions = JSON.parse(data.background_research_versions);
          } else if (data.background_research_versions) {
            // If it's already an object, assign directly
            backgroundResearchVersions = data.background_research_versions as unknown as ContentVersion[];
          }
        } catch (e) {
          console.error("Error parsing versions:", e);
        }
        
        const formattedGuest: Guest = {
          id: data.id,
          name: data.name,
          title: data.title,
          company: data.company || undefined,
          email: data.email || undefined,
          phone: data.phone || undefined,
          bio: data.bio,
          bioVersions: bioVersions,
          imageUrl: imageUrl,
          socialLinks: data.social_links as Guest['socialLinks'],
          notes: data.notes || undefined,
          backgroundResearch: data.background_research || undefined,
          backgroundResearchVersions: backgroundResearchVersions,
          status: (data.status as Guest['status']) || 'potential',
          createdAt: data.created_at,
          updatedAt: data.updated_at
        };
        
        setGuest(formattedGuest);
      }
    } catch (error: any) {
      toast.error(`Failed to fetch guest: ${error.message}`);
      console.error("Error fetching guest:", error);
    } finally {
      setIsLoading(false);
    }
  }, [guestId]);
  
  // Initial data loading
  useEffect(() => {
    fetchGuest();
  }, [fetchGuest]);

  return {
    isLoading,
    guest,
    setGuest,
    fetchGuest
  };
}
