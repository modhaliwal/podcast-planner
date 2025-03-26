
import { ContentVersion } from '@/lib/types';

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

/**
 * Fully process versions to ensure validity
 * @param versions Array of ContentVersion objects
 * @returns Processed versions with numbers and active flag
 */
export function processVersions(versions: ContentVersion[]): ContentVersion[] {
  if (!versions || versions.length === 0) return [];
  
  const withNumbers = ensureVersionNumbers(versions);
  const withActive = ensureActiveVersion(withNumbers);
  
  return withActive;
}

/**
 * Updates all content versions in database objects (guests and episodes)
 * when loading them from the database
 */
export function migrateContentVersions<T extends Record<string, any>>(
  obj: T, 
  versionFields: string[]
): T {
  if (!obj) return obj;
  
  const result = { ...obj } as T;
  
  // Process each field that might contain content versions
  versionFields.forEach(field => {
    if (result[field as keyof T] && Array.isArray(result[field as keyof T])) {
      result[field as keyof T] = processVersions(result[field as keyof T] as unknown as ContentVersion[]) as any;
    }
  });
  
  return result;
}
