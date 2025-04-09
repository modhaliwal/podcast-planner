
import { DataMapper } from "../core/DataMapper";
import { Guest, SocialLinks, ContentVersion } from "@/lib/types";
import { Json } from "@/integrations/supabase/types";
import { DBGuest } from "./GuestRepository";

/**
 * Maps between Guest domain models and database models
 */
export class GuestMapper implements DataMapper<Guest, DBGuest> {
  /**
   * Maps a database model to a domain model
   */
  toDomain(dbGuest: DBGuest): Guest {
    // Parse bioVersions and backgroundResearchVersions if they exist
    let bioVersions: ContentVersion[] = [];
    let backgroundResearchVersions: ContentVersion[] = [];
    
    try {
      if (dbGuest.bio_versions) {
        if (typeof dbGuest.bio_versions === 'string') {
          bioVersions = JSON.parse(dbGuest.bio_versions as string);
        } else {
          bioVersions = dbGuest.bio_versions as any;
        }
      }
      
      if (dbGuest.background_research_versions) {
        if (typeof dbGuest.background_research_versions === 'string') {
          backgroundResearchVersions = JSON.parse(dbGuest.background_research_versions as string);
        } else {
          backgroundResearchVersions = dbGuest.background_research_versions as any;
        }
      }
    } catch (e) {
      console.error("Error parsing versions for guest", dbGuest.id, e);
    }
    
    // Parse social links and ensure categories are properly formatted
    let socialLinks: SocialLinks = dbGuest.social_links as unknown as SocialLinks || {};
    
    // Ensure categories is an array if it exists
    if (socialLinks.categories && !Array.isArray(socialLinks.categories)) {
      console.error("Categories is not an array for guest", dbGuest.id);
      socialLinks.categories = [];
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
      socialLinks,
      notes: dbGuest.notes || undefined,
      backgroundResearch: dbGuest.background_research || undefined,
      backgroundResearchVersions: backgroundResearchVersions,
      status: (dbGuest.status as Guest['status']) || 'potential',
      createdAt: dbGuest.created_at,
      updatedAt: dbGuest.updated_at
    };
  }
  
  // Alias for backward compatibility
  mapFromDB(dbGuest: DBGuest): Guest {
    return this.toDomain(dbGuest);
  }
  
  /**
   * Maps a domain model to a database model
   */
  toDB(guest: Partial<Guest>): Partial<DBGuest> {
    const dbGuest: Partial<DBGuest> = {};
    
    if (guest.name !== undefined) dbGuest.name = guest.name;
    if (guest.title !== undefined) dbGuest.title = guest.title;
    if (guest.company !== undefined) dbGuest.company = guest.company;
    if (guest.email !== undefined) dbGuest.email = guest.email;
    if (guest.phone !== undefined) dbGuest.phone = guest.phone;
    if (guest.bio !== undefined) dbGuest.bio = guest.bio;
    if (guest.imageUrl !== undefined) dbGuest.image_url = guest.imageUrl;
    if (guest.socialLinks !== undefined) dbGuest.social_links = guest.socialLinks as unknown as Json;
    if (guest.notes !== undefined) dbGuest.notes = guest.notes;
    if (guest.backgroundResearch !== undefined) dbGuest.background_research = guest.backgroundResearch;
    if (guest.status !== undefined) dbGuest.status = guest.status;
    
    // Convert complex JSON objects for database storage
    if (guest.bioVersions) {
      dbGuest.bio_versions = guest.bioVersions as unknown as Json;
    }
    
    if (guest.backgroundResearchVersions) {
      dbGuest.background_research_versions = guest.backgroundResearchVersions as unknown as Json;
    }
    
    return dbGuest;
  }
  
  /**
   * Map from creation DTO to database model
   */
  createDtoToDB(dto: any): Partial<DBGuest> {
    return this.toDB(dto);
  }
  
  /**
   * Map from update DTO to database model
   */
  updateDtoToDB(dto: any): Partial<DBGuest> {
    return this.toDB(dto);
  }
}

// Create a singleton instance
export const guestMapper = new GuestMapper();
