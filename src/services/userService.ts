
import { UsersRoleKey } from '@/lib/types';

export interface UserWithRoles {
  id: string;
  email: string;
  full_name?: string;
  last_sign_in?: Date;
  roles?: { role: string }[];
}

interface CreateUserParams {
  email: string;
  password: string;
  full_name?: string;
  role: UsersRoleKey;
}

// Mock user service implementation
// In a real app, this would interact with the authentication module
export const getUsers = async (): Promise<UserWithRoles[]> => {
  // In a production app, this would call the auth service
  console.log('Fetching users from authentication service');
  
  // Return mock data for now
  return [
    {
      id: '1',
      email: 'admin@example.com',
      full_name: 'Admin User',
      last_sign_in: new Date(),
      roles: [{ role: UsersRoleKey.ADMIN }]
    },
    {
      id: '2',
      email: 'user@example.com',
      full_name: 'Regular User',
      last_sign_in: new Date(Date.now() - 86400000), // Yesterday
      roles: [{ role: UsersRoleKey.STANDARD }]
    }
  ];
};

export const createUser = async (params: CreateUserParams): Promise<{ user?: UserWithRoles, error?: Error }> => {
  try {
    console.log('Creating user with authentication service', params);
    
    // Mock successful creation
    return {
      user: {
        id: Math.random().toString(36).substring(2, 11),
        email: params.email,
        full_name: params.full_name,
        roles: [{ role: params.role }]
      }
    };
  } catch (error) {
    console.error('Error creating user:', error);
    return { error: error as Error };
  }
};

export const deleteUser = async (userId: string): Promise<boolean> => {
  try {
    console.log('Deleting user from authentication service', userId);
    // Mock successful deletion
    return true;
  } catch (error) {
    console.error('Error deleting user:', error);
    return false;
  }
};

// Add the missing assignUserRole function
export const assignUserRole = async (userId: string, role: UsersRoleKey): Promise<boolean> => {
  try {
    console.log(`Assigning role ${role} to user ${userId}`);
    // Mock successful role assignment
    return true;
  } catch (error) {
    console.error('Error assigning role:', error);
    return false;
  }
};
