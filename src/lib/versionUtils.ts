
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
    versionNumber: version.versionNumber || (index + 1)
  }));
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
  
  const result = { ...obj };
  
  // Process each field that might contain content versions
  versionFields.forEach(field => {
    if (result[field] && Array.isArray(result[field])) {
      result[field] = ensureVersionNumbers(result[field]);
    }
  });
  
  return result;
}
