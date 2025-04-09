
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
