// Define UserWithRoles interface for type checking
export interface UserWithRoles {
  id: string;
  email: string;
  roles: string[];
}

/**
 * Get all users - only for backward compatibility
 */
export const getUsers = async (): Promise<UserWithRoles[]> => {
  try {
    console.log("This function is deprecated and will be removed in a future update");
    // Return empty array - this function is deprecated
    return [];
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
};

// This is an empty service since user management has been removed
export const userService = {
  // Empty placeholder for now
};
