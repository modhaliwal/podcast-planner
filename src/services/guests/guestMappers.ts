
import { Guest, SocialLinks, ContentVersion } from "@/lib/types";
import { Json } from "@/integrations/supabase/types";

/**
 * Maps a guest record from the database to our application's Guest type
 */
export const mapDatabaseGuestToGuest = (guest: any): Guest => {
  // Parse bioVersions and backgroundResearchVersions if they exist
  let bioVersions: ContentVersion[] = [];
  let backgroundResearchVersions: ContentVersion[] = [];
  
  try {
    if (guest.bio_versions && typeof guest.bio_versions === 'string') {
      bioVersions = JSON.parse(guest.bio_versions);
    } else if (guest.bio_versions) {
      // If it's already an object, assign directly
      bioVersions = guest.bio_versions as unknown as ContentVersion[];
    }
    
    if (guest.background_research_versions && typeof guest.background_research_versions === 'string') {
      backgroundResearchVersions = JSON.parse(guest.background_research_versions);
    } else if (guest.background_research_versions) {
      // If it's already an object, assign directly
      backgroundResearchVersions = guest.background_research_versions as unknown as ContentVersion[];
    }
  } catch (e) {
    console.error("Error parsing versions for guest", guest.id, e);
  }
  
  return {
    id: guest.id,
    name: guest.name,
    title: guest.title,
    company: guest.company || undefined,
    email: guest.email || undefined,
    phone: guest.phone || undefined,
    bio: guest.bio,
    bioVersions: bioVersions,
    imageUrl: guest.image_url || undefined,
    socialLinks: guest.social_links as SocialLinks || {},
    notes: guest.notes || undefined,
    backgroundResearch: guest.background_research || undefined,
    backgroundResearchVersions: backgroundResearchVersions,
    status: (guest.status as Guest['status']) || 'potential',
    createdAt: guest.created_at,
    updatedAt: guest.updated_at
  };
};

/**
 * Prepares guest data for database insert/update operations
 */
export const prepareGuestForDatabase = (guest: Partial<Guest>) => {
  // Stringify the versions for database storage
  const bioVersionsString = guest.bioVersions ? 
    JSON.stringify(guest.bioVersions) : null;
  
  const backgroundResearchVersionsString = guest.backgroundResearchVersions ? 
    JSON.stringify(guest.backgroundResearchVersions) : null;
    
  return {
    name: guest.name,
    title: guest.title,
    company: guest.company,
    email: guest.email,
    phone: guest.phone,
    bio: guest.bio || '',
    bio_versions: bioVersionsString,
    image_url: guest.imageUrl,
    social_links: guest.socialLinks as unknown as Json || {},
    notes: guest.notes,
    background_research: guest.backgroundResearch,
    background_research_versions: backgroundResearchVersionsString,
    status: guest.status || 'potential',
    updated_at: new Date().toISOString()
  };
};
