
/**
 * Initiates the federated sign-in process by redirecting to the auth provider
 * @param callbackUrl URL to redirect to after successful authentication
 */
export const federatedSignIn = (callbackUrl: string) => {
  // Create the full URL with callback parameter
  const authUrl = new URL(`${window.location.origin}/auth`);
  authUrl.searchParams.set("callbackUrl", callbackUrl);
  
  // Redirect to the auth page
  window.location.href = authUrl.toString();
};

/**
 * Signs out the user from the federated session
 */
export const federatedSignOut = () => {
  // Clear tokens from localStorage
  localStorage.removeItem("federation_token");
  localStorage.removeItem("federation_refresh_token");
  
  // Redirect to the home page
  window.location.href = "/";
};

// Exported function to get the auth module
export const getAuthModule = (): [any, null] => {
  // Return a simple fallback implementation
  return [{ 
    useAuth: () => ({
      user: null,
      isLoading: false,
      error: null,
      signIn: async () => ({ error: { message: "Auth module unavailable" } }),
      signOut: async () => {},
    })
  }, null];
};

