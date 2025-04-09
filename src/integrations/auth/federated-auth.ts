
import { LaunchpadConfig } from '@/config/launchpad';

/**
 * Initiates the federated sign-in process by redirecting to the auth provider
 * @param callbackUrl URL to redirect to after successful authentication
 */
export const federatedSignIn = (callbackUrl: string) => {
  // Create the full URL with callback parameter
  const authUrl = new URL(LaunchpadConfig.authUrl);
  authUrl.searchParams.set("callbackUrl", callbackUrl);
  
  // Redirect to the auth page
  window.location.href = authUrl.toString();
};

/**
 * Signs out the user from the federated session
 */
export const federatedSignOut = () => {
  // Clear tokens from localStorage
  localStorage.removeItem(LaunchpadConfig.storageKeys.token);
  localStorage.removeItem(LaunchpadConfig.storageKeys.refreshToken);
  
  // Redirect to the home page
  window.location.href = "/";
};

/**
 * Creates a simulated authentication session for development
 * @returns Object containing tokens for the dev user
 */
export const signInAsDevUser = () => {
  // Create a mock token that expires in 1 hour
  const mockToken = {
    access_token: "dev-user-token-" + Date.now(),
    refresh_token: "dev-user-refresh-" + Date.now(),
    expires_at: Date.now() + (3600 * 1000) // 1 hour from now
  };
  
  // Store tokens in localStorage
  localStorage.setItem("auth_token", JSON.stringify(mockToken));
  
  return mockToken;
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
