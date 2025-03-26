
import { ContentVersion } from '@/lib/types';

/**
 * Ensures all versions in an array have version numbers
 * @param versions Array of ContentVersion objects
 * @returns Array with version numbers added where missing
 */
export function ensureVersionNumbers(versions: ContentVersion[]): ContentVersion[] {
  if (!versions || !Array.isArray(versions) || versions.length === 0) return [];
  
  // Log incoming versions to check structure
  console.log("ensureVersionNumbers input:", JSON.stringify(versions));
  
  try {
    // Sort versions by timestamp to ensure consistent numbering
    const sortedVersions = [...versions].sort(
      (a, b) => {
        const aTime = a.timestamp ? new Date(a.timestamp).getTime() : 0;
        const bTime = b.timestamp ? new Date(b.timestamp).getTime() : 0;
        return aTime - bTime;
      }
    );
    
    // Assign version numbers based on timestamp order if missing
    return sortedVersions.map((version, index) => ({
      ...version,
      id: version.id || `generated-${Date.now()}-${index}`,
      versionNumber: version.versionNumber || (index + 1),
      active: typeof version.active === 'boolean' ? version.active : false,
      content: version.content || '',
      timestamp: version.timestamp || new Date().toISOString(),
      source: version.source || 'manual'
    }));
  } catch (error) {
    console.error("Error in ensureVersionNumbers:", error);
    return [];
  }
}

/**
 * Ensure at least one version is marked as active
 * @param versions Array of ContentVersion objects
 * @returns Array with at least one active version
 */
export function ensureActiveVersion(versions: ContentVersion[]): ContentVersion[] {
  if (!versions || !Array.isArray(versions) || versions.length === 0) return [];
  
  try {
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
  } catch (error) {
    console.error("Error in ensureActiveVersion:", error);
    return versions;
  }
}

/**
 * Fully process versions to ensure validity
 * @param versions Array of ContentVersion objects
 * @returns Processed versions with numbers and active flag
 */
export function processVersions(versions: any[]): ContentVersion[] {
  if (!versions || !Array.isArray(versions) || versions.length === 0) {
    console.log("processVersions: empty or invalid input", versions);
    return [];
  }
  
  try {
    // If input is a string (possibly JSON), try to parse it
    if (versions.length === 1 && typeof versions[0] === 'string') {
      try {
        const parsed = JSON.parse(versions[0]);
        if (Array.isArray(parsed)) {
          versions = parsed;
        }
      } catch (e) {
        console.error("Failed to parse version string:", e);
      }
    }
    
    // Filter out invalid entries (non-objects, primitives)
    const validVersions = versions.filter(v => 
      v && typeof v === 'object' && !Array.isArray(v) && (v.content !== undefined || v.id !== undefined)
    );
    
    if (validVersions.length === 0) {
      console.log("No valid versions found after filtering");
      return [];
    }
    
    // Convert each version to proper ContentVersion format
    const normalizedVersions = validVersions.map(v => ({
      id: v.id || `generated-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      content: v.content || '',
      timestamp: v.timestamp || new Date().toISOString(),
      source: v.source || 'manual',
      active: Boolean(v.active),
      versionNumber: Number(v.versionNumber) || 0
    }));
    
    const withNumbers = ensureVersionNumbers(normalizedVersions);
    const withActive = ensureActiveVersion(withNumbers);
    
    console.log("processVersions result:", withActive);
    return withActive;
  } catch (error) {
    console.error("Error in processVersions:", error);
    return [];
  }
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
    if (result[field as keyof T]) {
      // Handle case where versions might be a string (JSON)
      if (typeof result[field as keyof T] === 'string') {
        try {
          const parsed = JSON.parse(result[field as keyof T] as string);
          result[field as keyof T] = processVersions(Array.isArray(parsed) ? parsed : [parsed]) as any;
        } catch (e) {
          console.error(`Error parsing ${field} as JSON:`, e);
          result[field as keyof T] = [] as any;
        }
      } else if (Array.isArray(result[field as keyof T])) {
        result[field as keyof T] = processVersions(result[field as keyof T] as unknown as ContentVersion[]) as any;
      } else {
        // For non-string, non-array values, convert to empty array
        result[field as keyof T] = [] as any;
      }
    }
  });
  
  return result;
}
