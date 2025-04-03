
import { supabase } from '@/integrations/supabase/client';
import { User, UsersRoleKey, UserRole } from '@/lib/types';

// Create a type that extends the User type with roles
export type UserWithRoles = User & {
  roles?: UserRole[];
};

// Check if a user has a specific role
export async function hasUserRole(role: UsersRoleKey): Promise<boolean> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return false;
    }
    
    // Fetch roles for this user
    const { data: roles, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id);
    
    if (error || !roles) {
      console.error('Error fetching user roles:', error);
      return false;
    }
    
    // Check if the user has the required role
    return roles.some(r => r.role === role);
  } catch (error) {
    console.error('Error checking user role:', error);
    return false;
  }
}

// Fetch all users with their roles
export async function getUsers(): Promise<UserWithRoles[] | null> {
  try {
    // First, fetch all users from auth.users through the edge function
    const { data: usersResponse, error: usersError } = await supabase
      .functions
      .invoke('admin-users', {
        method: 'GET',
      });
    
    if (usersError || !usersResponse.users) {
      console.error('Error fetching users:', usersError || 'No users returned');
      return null;
    }
    
    // Then fetch all user roles
    // In production, this would be better handled on the server side
    const { data: roles, error: rolesError } = await supabase
      .from('user_roles')
      .select('*');
    
    if (rolesError) {
      console.error('Error fetching roles:', rolesError);
      // Continue without roles
    }
    
    // Combine users with their roles
    const usersWithRoles: UserWithRoles[] = usersResponse.users.map((user: any) => {
      return {
        id: user.id,
        email: user.email,
        full_name: user.user_metadata?.full_name,
        avatar_url: user.user_metadata?.avatar_url,
        created_at: user.created_at,
        last_sign_in: user.last_sign_in_at,
        roles: roles ? roles.filter((r: UserRole) => r.user_id === user.id) : []
      };
    });
    
    return usersWithRoles;
  } catch (error) {
    console.error('Error in getUsers:', error);
    return null;
  }
}

// Create a new user
export async function createUser({
  email,
  password,
  full_name,
  role = UsersRoleKey.STANDARD,
}: {
  email: string;
  password: string;
  full_name?: string;
  role: UsersRoleKey;
}): Promise<{ user: User | null; error: Error | null }> {
  try {
    // Create the user through the edge function
    const response = await supabase.functions.invoke('admin-users', {
      method: 'POST',
      body: { email, password, full_name, role }
    });
    
    if (response.error) {
      return { user: null, error: new Error(response.error.message) };
    }
    
    return { user: response.data, error: null };
  } catch (error: any) {
    console.error('Error creating user:', error);
    return { user: null, error };
  }
}

// Delete a user
export async function deleteUser(userId: string): Promise<boolean> {
  try {
    const response = await supabase.functions.invoke('admin-users', {
      method: 'DELETE',
      body: { userId }
    });
    
    if (response.error) {
      console.error('Error deleting user:', response.error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting user:', error);
    return false;
  }
}

// Fetch user roles
export async function getUserRoles(userId: string): Promise<UserRole[] | null> {
  try {
    const { data, error } = await supabase
      .from('user_roles')
      .select('*')
      .eq('user_id', userId);
    
    if (error) {
      console.error('Error fetching user roles:', error);
      return null;
    }
    
    return data as UserRole[];
  } catch (error) {
    console.error('Error in getUserRoles:', error);
    return null;
  }
}

// Assign a role to a user
export async function assignUserRole(userId: string, role: UsersRoleKey): Promise<boolean> {
  try {
    const response = await supabase.functions.invoke('admin-users', {
      method: 'POST',
      body: { userId, role, action: 'assignRole' }
    });
    
    if (response.error) {
      console.error('Error assigning role:', response.error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error assigning role:', error);
    return false;
  }
}

// Remove a role from a user
export async function removeUserRole(userId: string, role: UsersRoleKey): Promise<boolean> {
  try {
    const response = await supabase.functions.invoke('admin-users', {
      method: 'POST',
      body: { userId, role, action: 'removeRole' }
    });
    
    if (response.error) {
      console.error('Error removing role:', response.error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error removing role:', error);
    return false;
  }
}
