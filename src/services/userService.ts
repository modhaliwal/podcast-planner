
import { supabase } from "@/integrations/supabase/client";
import { User } from "@/lib/types";

// Get the current user profile
export const getCurrentUserProfile = async (): Promise<{ user: User | null; error: any }> => {
  try {
    // First get the Supabase authenticated user
    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
    
    if (authError) throw authError;
    if (!authUser) return { user: null, error: null };
    
    // Then get the profile data
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authUser.id)
      .single();
    
    if (profileError && profileError.code !== 'PGRST116') { // Not found is ok, we'll return minimal user
      throw profileError;
    }
    
    // Combine auth data with profile data
    const user: User = {
      id: authUser.id,
      email: authUser.email || '',
      full_name: profileData?.full_name || authUser.user_metadata?.full_name || '',
      avatar_url: profileData?.avatar_url || authUser.user_metadata?.avatar_url || '',
      created_at: authUser.created_at || new Date().toISOString(),
      last_sign_in: authUser.last_sign_in_at || undefined
    };
    
    return { user, error: null };
  } catch (error) {
    console.error("Error fetching current user:", error);
    return { user: null, error };
  }
};

// Update the current user's profile
export const updateUserProfile = async (updates: Partial<User>): Promise<{ success: boolean; error?: any }> => {
  try {
    // Update auth metadata if name is provided
    if (updates.full_name) {
      const { error: authError } = await supabase.auth.updateUser({
        data: { full_name: updates.full_name }
      });
      
      if (authError) throw authError;
    }
    
    // Update profile data
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: (await supabase.auth.getUser()).data.user?.id,
        full_name: updates.full_name,
        avatar_url: updates.avatar_url,
        updated_at: new Date().toISOString()
      }, { onConflict: 'id' });
    
    if (profileError) throw profileError;
    
    return { success: true };
  } catch (error) {
    console.error("Error updating user profile:", error);
    return { success: false, error };
  }
};

// Helper function for signup
export const signUp = async (email: string, password: string, fullName?: string): Promise<{ data: any; error: any }> => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { 
          full_name: fullName || ''
        }
      }
    });
    
    return { data, error };
  } catch (error) {
    console.error("Error during signup:", error);
    return { data: null, error };
  }
};

// Helper function for signin
export const signIn = async (email: string, password: string): Promise<{ data: any; error: any }> => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    return { data, error };
  } catch (error) {
    console.error("Error during signin:", error);
    return { data: null, error };
  }
};

// Helper function for signout
export const signOut = async (): Promise<{ error: any }> => {
  try {
    const { error } = await supabase.auth.signOut();
    return { error };
  } catch (error) {
    console.error("Error during signout:", error);
    return { error };
  }
};
