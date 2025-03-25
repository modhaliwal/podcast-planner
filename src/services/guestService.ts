
import { supabase } from "@/integrations/supabase/client";
import { Guest, SocialLinks } from "@/lib/types";
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
    const formattedGuests: Guest[] = data?.map(guest => ({
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
    })) || [];
    
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
    
    // Format the guest into our application's Guest type
    const formattedGuest: Guest = {
      id: data.id,
      name: data.name,
      title: data.title,
      company: data.company || undefined,
      email: data.email || undefined,
      phone: data.phone || undefined,
      bio: data.bio,
      imageUrl: data.image_url || undefined,
      socialLinks: data.social_links as SocialLinks || {},
      notes: data.notes || undefined,
      backgroundResearch: data.background_research || undefined,
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
        image_url: guest.imageUrl,
        social_links: guest.socialLinks as unknown as Json || {},
        notes: guest.notes,
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
    const { error } = await supabase
      .from('guests')
      .update({
        name: updates.name,
        title: updates.title,
        company: updates.company,
        email: updates.email,
        phone: updates.phone,
        bio: updates.bio,
        image_url: updates.imageUrl,
        social_links: updates.socialLinks as unknown as Json,
        notes: updates.notes,
        background_research: updates.backgroundResearch,
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
