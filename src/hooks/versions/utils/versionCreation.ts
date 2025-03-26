
import { ContentVersion } from "@/lib/types";
import { v4 as uuidv4 } from "uuid";
import { findHighestVersionNumber } from "./versionNumberUtils";
import { UseFormReturn, Path } from "react-hook-form";

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
  if (activeVersion && currentContent !== activeVersion.content) {
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
  source: "manual" | "ai" | "import" = "manual",
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
 * Clears all versions except a new one based on current content
 */
export function clearAllVersionsUtil<T extends Record<string, any>>(
  form: UseFormReturn<T>,
  fieldName: keyof T,
  versionsFieldName: keyof T,
  setVersions: (versions: ContentVersion[]) => void,
  setActiveVersionId: (id: string | null) => void
) {
  // Get current content - use proper Path<T> typing
  const currentContent = form.getValues(fieldName as Path<T>) as string;
  
  // Create new version
  const newVersion: ContentVersion = {
    id: uuidv4(),
    content: currentContent,
    timestamp: new Date().toISOString(),
    source: "manual",
    active: true,
    versionNumber: 1
  };
  
  // Update state
  setVersions([newVersion]);
  setActiveVersionId(newVersion.id);
  
  // Update form - use proper Path<T> typing
  form.setValue(versionsFieldName as Path<T>, [newVersion] as any, { shouldDirty: true });
}

