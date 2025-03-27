
import { ContentVersion } from "@/lib/types";
import { v4 as uuidv4 } from "uuid";
import { findHighestVersionNumber } from "./versionNumberUtils";
import { UseFormReturn, Path } from "react-hook-form";

/**
 * Helper function to determine if a change is significant
 * Used across the app to prevent creating unnecessary versions
 */
export function isSignificantChange(newContent: string, oldContent: string): boolean {
  // If they're identical, no change
  if (newContent === oldContent) return false;
  
  // Always consider it significant if lengths differ by more than a small amount
  const lengthDifference = Math.abs(newContent.length - oldContent.length);
  if (lengthDifference > 10) return true;
  
  // Normalize whitespace
  const normalizedNew = newContent.replace(/\s+/g, ' ').trim();
  const normalizedOld = oldContent.replace(/\s+/g, ' ').trim();
  
  // If only whitespace changed, not significant
  if (normalizedNew === normalizedOld) return false;
  
  // Consider significant if more than minor whitespace changes
  return true;
}

/**
 * Creates a new version based on the current content if it has changed
 */
export function createVersionFromContent<T extends Record<string, any>>(
  form: UseFormReturn<T>,
  fieldName: keyof T,
  versionsFieldName: keyof T,
  activeVersionId: string | null,
  versions: ContentVersion[],
  setVersions: (versions: ContentVersion[]) => void,
  setActiveVersionId: (id: string | null) => void
) {
  // Get current content from form - use proper Path<T> typing
  const currentContent = form.getValues(fieldName as Path<T>) as string;
  
  if (!currentContent?.trim()) return;
  
  // Find active version
  const activeVersion = versions.find(v => v.id === activeVersionId);
  
  // Only create a new version if content has changed from active version
  if (activeVersion && isSignificantChange(currentContent, activeVersion.content)) {
    const nextVersionNumber = findHighestVersionNumber(versions) + 1;
    
    const newVersion: ContentVersion = {
      id: uuidv4(),
      content: currentContent,
      timestamp: new Date().toISOString(),
      source: "manual",
      active: true,
      versionNumber: nextVersionNumber
    };
    
    // Mark all versions as inactive
    const updatedVersions = versions.map(v => ({
      ...v,
      active: false
    }));
    
    // Add new version
    const newVersions = [...updatedVersions, newVersion];
    
    // Update state
    setVersions(newVersions);
    setActiveVersionId(newVersion.id);
    
    // Update form values - use proper Path<T> typing
    form.setValue(versionsFieldName as Path<T>, newVersions as any, { shouldDirty: true });
  }
}

/**
 * Adds a new version with specified content
 */
export function addNewVersionUtil<T extends Record<string, any>>(
  form: UseFormReturn<T>,
  fieldName: keyof T,
  versionsFieldName: keyof T,
  content: string,
  source: string = "manual",
  versions: ContentVersion[],
  setVersions: (versions: ContentVersion[]) => void,
  setActiveVersionId: (id: string | null) => void
): ContentVersion {
  const nextVersionNumber = findHighestVersionNumber(versions) + 1;
  
  // Create new version
  const newVersion: ContentVersion = {
    id: uuidv4(),
    content,
    timestamp: new Date().toISOString(),
    source,
    active: true,
    versionNumber: nextVersionNumber
  };
  
  // Set all versions to inactive
  const updatedVersions = versions.map(v => ({
    ...v,
    active: false
  }));
  
  // Add new version to list
  const newVersions = [...updatedVersions, newVersion];
  
  // Update state
  setVersions(newVersions);
  setActiveVersionId(newVersion.id);
  
  // Update form values - fix both setValue calls with proper Path<T> typing
  form.setValue(fieldName as Path<T>, content as any, { shouldDirty: true });
  form.setValue(versionsFieldName as Path<T>, newVersions as any, { shouldDirty: true });
  
  return newVersion;
}

/**
 * Clears all versions except the currently active one
 * Preserves the active version's version number and content
 */
export function clearAllVersionsUtil<T extends Record<string, any>>(
  form: UseFormReturn<T>,
  fieldName: keyof T,
  versionsFieldName: keyof T,
  setVersions: (versions: ContentVersion[]) => void,
  setActiveVersionId: (id: string | null) => void
) {
  // Get versions from form - use proper Path<T> typing
  const versions = form.getValues(versionsFieldName as Path<T>) as ContentVersion[];
  
  // Find the active version to preserve its version number and content
  const activeVersion = versions.find(v => v.active);
  
  if (!activeVersion) {
    console.warn("No active version found when clearing versions");
    return;
  }
  
  // Create a new version with the active version's content (NOT the current form content)
  const newVersion: ContentVersion = {
    id: uuidv4(),
    content: activeVersion.content, // Use the active version's content, not the current form content
    timestamp: new Date().toISOString(),
    source: activeVersion.source,
    active: true,
    versionNumber: activeVersion.versionNumber
  };
  
  // Update state
  setVersions([newVersion]);
  setActiveVersionId(newVersion.id);
  
  // Update the versions in the form, but DO NOT modify the content field
  form.setValue(versionsFieldName as Path<T>, [newVersion] as any, { shouldDirty: true });
  
  // Also update the content field to match the active version
  form.setValue(fieldName as Path<T>, activeVersion.content as any, { shouldDirty: true });
}
