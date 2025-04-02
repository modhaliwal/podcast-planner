
import { ContentVersion } from './types';
import { v4 as uuidv4 } from 'uuid';

/**
 * Adds a new version to an existing array of versions
 * @param versions Current array of versions
 * @param content The new content
 * @param source Source of the content (AI generator name, 'manual', etc.)
 * @returns Updated array with new version added
 */
export function addVersion(
  versions: ContentVersion[] = [], 
  content: string, 
  source: string = 'manual'
): ContentVersion[] {
  // Deactivate all existing versions
  const updatedVersions = versions.map(v => ({
    ...v,
    active: false
  }));
  
  // Add new version as active
  const newVersion: ContentVersion = {
    id: uuidv4(),
    content,
    timestamp: new Date().toISOString(),
    source,
    active: true,
    versionNumber: (versions.length > 0 ? Math.max(...versions.map(v => v.versionNumber || 0)) : 0) + 1
  };
  
  return [...updatedVersions, newVersion];
}

/**
 * Set a specific version as active
 * @param versions Array of content versions
 * @param versionId ID of the version to make active
 * @returns Updated array with specified version as active
 */
export function setActiveVersion(versions: ContentVersion[], versionId: string): ContentVersion[] {
  return versions.map(version => ({
    ...version,
    active: version.id === versionId
  }));
}

/**
 * Gets the active version from an array of versions
 * @param versions Array of content versions
 * @returns The active version or the latest version if none is marked active
 */
export function getActiveVersion(versions: ContentVersion[]): ContentVersion | null {
  if (!versions || versions.length === 0) {
    return null;
  }
  
  // Find the active version
  const activeVersion = versions.find(v => v.active);
  
  // If no version is marked as active, return the latest version
  if (!activeVersion) {
    // Sort by version number descending and take the first
    const sortedVersions = [...versions].sort((a, b) => 
      (b.versionNumber || 0) - (a.versionNumber || 0)
    );
    return sortedVersions[0];
  }
  
  return activeVersion;
}
