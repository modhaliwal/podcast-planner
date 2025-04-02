import { supabase } from "@/integrations/supabase/client";
import { User, UsersRoleKey } from "@/lib/types";

// Get the current user profile
export const getCurrentUserProfile = async (): Promise<{ user: User | null; error: any }> => {
  try {
    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
    
    if (authError) throw authError;
    if (!authUser) return { user: null, error: null };
    
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authUser.id)
      .single();
    
    if (profileError && profileError.code !== 'PGRST116') {
      throw profileError;
    }
    
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
    if (updates.full_name) {
      const { error: authError } = await supabase.auth.updateUser({
        data: { full_name: updates.full_name }
      });
      
      if (authError) throw authError;
    }
    
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

// New admin user management functions
export const hasUserRole = async (role: UsersRoleKey): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('user_roles')
      .select('*')
      .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
      .eq('role', role)
      .single();
    
    if (error && error.code !== 'PGRST116') {
      console.error("Error checking role:", error);
    }
    
    return !!data;
  } catch (error) {
    console.error("Error checking user role:", error);
    return false;
  }
};

export const listUsers = async (): Promise<{ users: User[]; error?: any }> => {
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    
    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionData.session?.access_token}`,
      },
      body: JSON.stringify({ action: 'listUsers' }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to list users');
    }
    
    const { users } = await response.json();
    return { users };
  } catch (error) {
    console.error("Error listing users:", error);
    return { users: [], error };
  }
};

export const createUser = async (userData: { 
  email: string; 
  password: string; 
  full_name?: string; 
  role?: UsersRoleKey;
}): Promise<{ user?: User; error?: any }> => {
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    
    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionData.session?.access_token}`,
      },
      body: JSON.stringify({
        action: 'createUser',
        userData
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create user');
    }
    
    const data = await response.json();
    return { user: data.user };
  } catch (error) {
    console.error("Error creating user:", error);
    return { error };
  }
};

export const deleteUser = async (userId: string): Promise<{ success: boolean; error?: any }> => {
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    
    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionData.session?.access_token}`,
      },
      body: JSON.stringify({
        action: 'deleteUser',
        userData: { id: userId }
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to delete user');
    }
    
    return { success: true };
  } catch (error) {
    console.error("Error deleting user:", error);
    return { success: false, error };
  }
};

export const assignRole = async (userId: string, role: UsersRoleKey): Promise<{ success: boolean; error?: any }> => {
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    
    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionData.session?.access_token}`,
      },
      body: JSON.stringify({
        action: 'assignRole',
        userData: { userId, role }
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to assign role');
    }
    
    return { success: true };
  } catch (error) {
    console.error("Error assigning role:", error);
    return { success: false, error };
  }
};

export const removeRole = async (userId: string, role: UsersRoleKey): Promise<{ success: boolean; error?: any }> => {
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    
    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionData.session?.access_token}`,
      },
      body: JSON.stringify({
        action: 'removeRole',
        userData: { userId, role }
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to remove role');
    }
    
    return { success: true };
  } catch (error) {
    console.error("Error removing role:", error);
    return { success: false, error };
  }
};
