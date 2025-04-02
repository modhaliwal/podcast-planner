
import { ContentVersion } from "@/lib/types";
import { v4 as uuidv4 } from "uuid";

/**
 * Creates a new ContentVersion object with required fields
 */
export function createContentVersion(
  content: string,
  source: string,
  versionNumber?: number
): ContentVersion {
  return {
    id: uuidv4(),
    content,
    timestamp: new Date().toISOString(),
    source,
    active: true,
    versionNumber: versionNumber || 1
  };
}

/**
 * Adds a new version to an array of ContentVersion objects
 */
export function addVersion(
  currentVersions: ContentVersion[],
  content: string,
  source: string
): ContentVersion[] {
  // Deactivate all existing versions
  const updatedVersions = currentVersions.map(v => ({ ...v, active: false }));
  
  // Create a new version with the next version number
  const nextVersionNumber = currentVersions.length ? 
    Math.max(...currentVersions.map(v => v.versionNumber || 0)) + 1 : 
    1;
  
  // Add the new version to the array
  return [
    ...updatedVersions,
    createContentVersion(content, source, nextVersionNumber)
  ];
}
