
import { ContentVersion } from "@/lib/types";
import { v4 as uuidv4 } from "uuid";

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
 * Ensures all versions in an array have version numbers and required properties
 * @param versions Array of ContentVersion objects or partial version objects
 * @returns Array with all required properties added where missing
 */
export function ensureVersionNumbers(versions: any[]): ContentVersion[] {
  if (!versions || versions.length === 0) return [];
  
  // Sort versions by timestamp to ensure consistent numbering
  const sortedVersions = [...versions].sort((a, b) => {
    const aTime = a.timestamp ? new Date(a.timestamp).getTime() : 0;
    const bTime = b.timestamp ? new Date(b.timestamp).getTime() : 0;
    return aTime - bTime;
  });
  
  // Assign version numbers based on timestamp order and ensure all required properties
  return sortedVersions.map((version, index) => ({
    id: version.id || uuidv4(), // Ensure id is never undefined
    content: version.content || '',
    timestamp: version.timestamp || new Date().toISOString(),
    source: version.source || 'manual',
    active: typeof version.active === 'boolean' ? version.active : false,
    versionNumber: version.versionNumber || (index + 1)
  })) as ContentVersion[];
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
