
import { Guest, Episode } from "@/lib/types";
import { ContentVersion } from "@/lib/types";

/**
 * Maps database guest record to domain Guest model
 */
export const mapDatabaseGuestToGuest = (dbGuest: any): Guest => {
  // Parse bioVersions and backgroundResearchVersions if they exist
  let bioVersions: ContentVersion[] = [];
  let backgroundResearchVersions: ContentVersion[] = [];
  
  try {
    if (dbGuest.bio_versions) {
      if (typeof dbGuest.bio_versions === 'string') {
        bioVersions = JSON.parse(dbGuest.bio_versions);
      } else if (Array.isArray(dbGuest.bio_versions)) {
        bioVersions = dbGuest.bio_versions as ContentVersion[];
      } else {
        console.warn('bio_versions is not an array:', dbGuest.bio_versions);
      }
    }
    
    if (dbGuest.background_research_versions) {
      if (typeof dbGuest.background_research_versions === 'string') {
        backgroundResearchVersions = JSON.parse(dbGuest.background_research_versions);
      } else if (Array.isArray(dbGuest.background_research_versions)) {
        backgroundResearchVersions = dbGuest.background_research_versions as ContentVersion[];
      } else {
        console.warn('background_research_versions is not an array:', dbGuest.background_research_versions);
      }
    }
  } catch (e) {
    console.error("Error parsing versions for guest", dbGuest.id, e);
  }
  
  return {
    id: dbGuest.id,
    name: dbGuest.name,
    title: dbGuest.title,
    company: dbGuest.company || undefined,
    email: dbGuest.email || undefined,
    phone: dbGuest.phone || undefined,
    bio: dbGuest.bio,
    bioVersions: bioVersions,
    imageUrl: dbGuest.image_url || undefined,
    socialLinks: dbGuest.social_links || {},
    notes: dbGuest.notes || undefined,
    backgroundResearch: dbGuest.background_research || undefined,
    backgroundResearchVersions: backgroundResearchVersions,
    status: (dbGuest.status as Guest['status']) || 'potential',
    createdAt: dbGuest.created_at,
    updatedAt: dbGuest.updated_at
  };
};
