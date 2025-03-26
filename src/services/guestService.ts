
import { supabase } from "@/integrations/supabase/client";
import { Guest, SocialLinks, ContentVersion } from "@/lib/types";
import { Json } from "@/integrations/supabase/types";

// Function to get all guests for the current user
export const getUserGuests = async (): Promise<{ data: Guest[] | null; error: any }> => {
  try {
    const { data, error } = await supabase
      .from('guests')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    // Format the guests into our application's Guest type
    const formattedGuests: Guest[] = data?.map(guest => {
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
    }) || [];
    
    return { data: formattedGuests, error: null };
  } catch (error) {
    console.error("Error fetching user guests:", error);
    return { data: null, error };
  }
};

// Function to get a specific guest
export const getGuest = async (id: string): Promise<{ data: Guest | null; error: any }> => {
  try {
    const { data, error } = await supabase
      .from('guests')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
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
      console.error("Error parsing versions for guest", data.id, e);
    }
    
    // Format the guest into our application's Guest type
    const formattedGuest: Guest = {
      id: data.id,
      name: data.name,
      title: data.title,
      company: data.company || undefined,
      email: data.email || undefined,
      phone: data.phone || undefined,
      bio: data.bio,
      bioVersions: bioVersions,
      imageUrl: data.image_url || undefined,
      socialLinks: data.social_links as SocialLinks || {},
      notes: data.notes || undefined,
      backgroundResearch: data.background_research || undefined,
      backgroundResearchVersions: backgroundResearchVersions,
      status: (data.status as Guest['status']) || 'potential',
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
    
    return { data: formattedGuest, error: null };
  } catch (error) {
    console.error(`Error fetching guest with id ${id}:`, error);
    return { data: null, error };
  }
};

// Function to create a new guest
export const createGuest = async (guest: Partial<Guest>): Promise<{ data: any | null; error: any }> => {
  try {
    // Get current user ID from Supabase auth
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error("User not authenticated");
    }
    
    // Stringify the versions for database storage
    const bioVersionsString = guest.bioVersions ? 
      JSON.stringify(guest.bioVersions) : null;
    
    const backgroundResearchVersionsString = guest.backgroundResearchVersions ? 
      JSON.stringify(guest.backgroundResearchVersions) : null;
    
    const { data, error } = await supabase
      .from('guests')
      .insert({
        user_id: user.id,
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
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return { data, error: null };
  } catch (error) {
    console.error("Error creating guest:", error);
    return { data: null, error };
  }
};

// Function to update a guest
export const updateGuest = async (id: string, updates: Partial<Guest>): Promise<{ success: boolean; error?: any }> => {
  try {
    // Stringify the versions for database storage
    const bioVersionsString = updates.bioVersions ? 
      JSON.stringify(updates.bioVersions) : undefined;
    
    const backgroundResearchVersionsString = updates.backgroundResearchVersions ? 
      JSON.stringify(updates.backgroundResearchVersions) : undefined;
    
    const { error } = await supabase
      .from('guests')
      .update({
        name: updates.name,
        title: updates.title,
        company: updates.company,
        email: updates.email,
        phone: updates.phone,
        bio: updates.bio,
        bio_versions: bioVersionsString,
        image_url: updates.imageUrl,
        social_links: updates.socialLinks as unknown as Json,
        notes: updates.notes,
        background_research: updates.backgroundResearch,
        background_research_versions: backgroundResearchVersionsString,
        status: updates.status,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);
    
    if (error) throw error;
    
    return { success: true };
  } catch (error) {
    console.error(`Error updating guest with id ${id}:`, error);
    return { success: false, error };
  }
};

// Function to delete a guest
export const deleteGuest = async (id: string): Promise<{ success: boolean; error?: any }> => {
  try {
    const { error } = await supabase
      .from('guests')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    return { success: true };
  } catch (error) {
    console.error(`Error deleting guest with id ${id}:`, error);
    return { success: false, error };
  }
};
