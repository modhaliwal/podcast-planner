
import { ContentVersion } from "@/lib/types";

/**
 * Find the highest version number in an array of content versions
 * @param versions Array of ContentVersion objects
 * @returns The highest version number found, or 0 if none
 */
export const findHighestVersionNumber = (versions: ContentVersion[]): number => {
  if (!versions || !versions.length) return 0;
  
  const numbers = versions
    .map(v => v.versionNumber || 0)
    .filter(n => typeof n === 'number' && !isNaN(n));
  
  return numbers.length ? Math.max(...numbers) : 0;
};

/**
 * Ensures all versions in an array have version numbers
 * @param versions Array of ContentVersion objects
 * @returns Array with version numbers added where missing
 */
export function ensureVersionNumbers(versions: ContentVersion[]): ContentVersion[] {
  if (!versions || versions.length === 0) return [];
  
  // Sort versions by timestamp to ensure consistent numbering
  const sortedVersions = [...versions].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );
  
  // Assign version numbers based on timestamp order if missing
  return sortedVersions.map((version, index) => ({
    ...version,
    versionNumber: version.versionNumber || (index + 1),
    active: typeof version.active === 'boolean' ? version.active : false
  }));
}

/**
 * Ensure at least one version is marked as active
 * @param versions Array of ContentVersion objects
 * @returns Array with at least one active version
 */
export function ensureActiveVersion(versions: ContentVersion[]): ContentVersion[] {
  if (!versions || versions.length === 0) return [];
  
  // Check if any version is already active
  const hasActiveVersion = versions.some(v => v.active === true);
  
  if (hasActiveVersion) {
    return versions;
  }
  
  // If no active version, use the latest one
  const sortedVersions = [...versions].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
  
  return versions.map(v => ({
    ...v,
    active: v.id === sortedVersions[0].id
  }));
}
