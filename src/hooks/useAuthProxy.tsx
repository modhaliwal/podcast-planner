
// A minimal hook without any auth functionality
export function useAuthProxy() {
  return {
    signIn: async () => ({ success: true }),
    signOut: async () => true,
    isAuthenticated: true,
    isLoading: false,
    authError: null,
    token: null,
    user: null,
    guests: [],
    episodes: [],
    refreshEpisodes: async () => {
      console.log("Mock refreshEpisodes called");
      return [];
    },
    refreshGuests: async () => {
      console.log("Mock refreshGuests called");
      return [];
    }
  };
}

export function useIsAuthenticated() {
  return {
    isAuthenticated: true,
    isLoading: false,
    authError: null,
  };
}

export function useHasPermission() {
  return {
    hasPermission: true,
    isLoading: false,
    authError: null,
  };
}
