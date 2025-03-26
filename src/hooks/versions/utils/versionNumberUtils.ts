
import { ContentVersion } from "@/lib/types";

/**
 * Ensure all versions have a version number
 */
export const ensureVersionNumbers = (versions: ContentVersion[]): ContentVersion[] => {
  if (!versions.length) return versions;
  
  // Sort versions by timestamp to ensure consistent numbering
  const sortedVersions = [...versions].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );
  
  // Assign version numbers based on timestamp order if missing
  return sortedVersions.map((version, index) => ({
    ...version,
    versionNumber: version.versionNumber || (index + 1)
  }));
};

/**
 * Find the highest version number in an array of content versions
 */
export const findHighestVersionNumber = (versions: ContentVersion[]): number => {
  if (!versions.length) return 0;
  return Math.max(...versions.map(v => v.versionNumber || 0));
};
