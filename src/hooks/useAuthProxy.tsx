
// A minimal hook to serve as a placeholder for future authentication implementation
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
    episodes: []
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
