
/**
 * Launchpad Federation Configuration
 * Contains settings for integration with Skyrocket's Launchpad authentication system
 */

export const LaunchpadConfig = {
  // Base URL for Launchpad authentication
  authUrl: "https://admin.skyrocketdigital.com/auth/login",
  
  // Local storage keys
  storageKeys: {
    token: "federation_token",
    refreshToken: "federation_refresh_token",
  },
  
  // Token refresh settings
  tokenRefresh: {
    // Minutes before token expiry to refresh
    refreshBeforeExpiryMinutes: 5
  }
};

export default LaunchpadConfig;
