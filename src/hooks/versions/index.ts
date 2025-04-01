
import { ContentVersion } from "@/lib/types";

// Export utility functions
export * from "./utils/versionNumberUtils";
export * from "./utils/versionInitialization";
export * from "./utils/versionSelection";
export * from "./utils/versionCreation";

/**
 * Ensures all versions have sequential version numbers
 */
export const ensureVersionNumbers = (versions: ContentVersion[]): ContentVersion[] => {
  if (!versions || !Array.isArray(versions) || versions.length === 0) {
    return [];
  }
  
  // Sort by timestamp (oldest first)
  const sortedVersions = [...versions].sort((a, b) => 
    new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );
  
  // Ensure each version has a sequential version number
  return sortedVersions.map((version, index) => ({
    ...version,
    versionNumber: index + 1
  }));
};
