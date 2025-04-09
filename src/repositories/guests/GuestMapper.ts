import { Guest, SocialLinks } from "@/lib/types";
import { DBGuest } from "./GuestRepository";
import { DataMapper } from "../core/DataMapper";
import { Json } from "@/integrations/supabase/types";

export class GuestMapper implements DataMapper<Guest, DBGuest> {
  toDomain(dbGuest: DBGuest): Guest {
    // Parse social links from JSON
    let socialLinks: SocialLinks = { };
    
    if (dbGuest.social_links) {
      if (typeof dbGuest.social_links === 'string') {
        try {
          socialLinks = JSON.parse(dbGuest.social_links as string);
        } catch (e) {
          console.error('Error parsing social_links JSON:', e);
        }
      } else {
        socialLinks = dbGuest.social_links as unknown as SocialLinks;
      }
    }
    
    return {
      id: dbGuest.id,
      name: dbGuest.name,
      title: dbGuest.title || '',
      company: dbGuest.company || undefined,
      email: dbGuest.email || undefined,
      phone: dbGuest.phone || undefined,
      location: dbGuest.location || undefined,
      bio: dbGuest.bio || '',
      imageUrl: dbGuest.image_url || undefined,
      website: dbGuest.website || undefined,
      twitter: dbGuest.twitter || undefined,
      linkedin: dbGuest.linkedin || undefined,
      notes: dbGuest.notes || undefined,
      backgroundResearch: dbGuest.background_research || undefined,
      status: dbGuest.status as Guest['status'] || 'potential',
      socialLinks,
      createdAt: dbGuest.created_at,
      updatedAt: dbGuest.updated_at,
    };
  }
  
  toDB(guest: Partial<Guest>): Partial<DBGuest> {
    const dbGuest: Partial<DBGuest> = {};
    
    if (guest.id !== undefined) dbGuest.id = guest.id;
    if (guest.name !== undefined) dbGuest.name = guest.name;
    if (guest.title !== undefined) dbGuest.title = guest.title;
    if (guest.company !== undefined) dbGuest.company = guest.company || null;
    if (guest.email !== undefined) dbGuest.email = guest.email || null;
    if (guest.phone !== undefined) dbGuest.phone = guest.phone || null;
    if (guest.bio !== undefined) dbGuest.bio = guest.bio;
    if (guest.imageUrl !== undefined) dbGuest.image_url = guest.imageUrl || null;
    if (guest.notes !== undefined) dbGuest.notes = guest.notes || null;
    if (guest.backgroundResearch !== undefined) dbGuest.background_research = guest.backgroundResearch || null;
    if (guest.status !== undefined) dbGuest.status = guest.status || null;
    
    // Convert socialLinks object to JSON
    if (guest.socialLinks !== undefined) {
      dbGuest.social_links = guest.socialLinks as unknown as Json;
    }
    
    return dbGuest;
  }
  
  createDtoToDB(dto: any): Partial<DBGuest> {
    const { name, title, company, email, phone, bio, imageUrl, website, twitter, linkedin, notes, backgroundResearch, status, socialLinks } = dto;
    
    // Process social links to include website, twitter, linkedin if provided
    const processedSocialLinks = { ...socialLinks } as any;
    if (website) processedSocialLinks.website = website;
    if (twitter) processedSocialLinks.twitter = twitter;
    if (linkedin) processedSocialLinks.linkedin = linkedin;
    
    return {
      name,
      title,
      company: company || null,
      email: email || null,
      phone: phone || null,
      bio: bio || '',
      image_url: imageUrl || null,
      notes: notes || null,
      background_research: backgroundResearch || null,
      status: status || 'potential',
      social_links: processedSocialLinks as unknown as Json,
    };
  }
  
  updateDtoToDB(dto: any): Partial<DBGuest> {
    const dbGuest: Partial<DBGuest> = {};
    
    if (dto.name !== undefined) dbGuest.name = dto.name;
    if (dto.title !== undefined) dbGuest.title = dto.title;
    if (dto.company !== undefined) dbGuest.company = dto.company || null;
    if (dto.email !== undefined) dbGuest.email = dto.email || null;
    if (dto.phone !== undefined) dbGuest.phone = dto.phone || null;
    if (dto.bio !== undefined) dbGuest.bio = dto.bio;
    if (dto.imageUrl !== undefined) dbGuest.image_url = dto.imageUrl || null;
    if (dto.notes !== undefined) dbGuest.notes = dto.notes || null;
    if (dto.backgroundResearch !== undefined) dbGuest.background_research = dto.backgroundResearch || null;
    if (dto.status !== undefined) dbGuest.status = dto.status || null;
    
    // Process social links
    if (dto.socialLinks !== undefined) {
      const processedSocialLinks = { ...dto.socialLinks } as any;
      
      // Add optional fields if present
      if (dto.website !== undefined) processedSocialLinks.website = dto.website;
      if (dto.twitter !== undefined) processedSocialLinks.twitter = dto.twitter;
      if (dto.linkedin !== undefined) processedSocialLinks.linkedin = dto.linkedin;
      
      dbGuest.social_links = processedSocialLinks as unknown as Json;
    } else {
      // Handle individual social link updates
      if (dto.website !== undefined || dto.twitter !== undefined || dto.linkedin !== undefined) {
        dbGuest.social_links = {
          website: dto.website,
          twitter: dto.twitter,
          linkedin: dto.linkedin
        } as unknown as Json;
      }
    }
    
    return dbGuest;
  }
}
