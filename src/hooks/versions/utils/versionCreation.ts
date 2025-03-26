
import { ContentVersion } from "@/lib/types";
import { v4 as uuidv4 } from "uuid";
import { UseFormReturn, Path, PathValue } from "react-hook-form";
import { findHighestVersionNumber } from "./versionNumberUtils";

/**
 * Create a new version based on content
 */
export const createVersionFromContent = <T extends Record<string, any>>(
  form: UseFormReturn<T>,
  fieldName: keyof T,
  versionsFieldName: keyof T,
  activeVersionId: string | null,
  versions: ContentVersion[],
  setVersions: (versions: ContentVersion[]) => void,
  setActiveVersionId: (id: string | null) => void
): void => {
  const currentContent = form.getValues(fieldName as unknown as Path<T>) || "";
  
  if (typeof currentContent === "string" && currentContent.trim() && activeVersionId) {
    const activeVersion = versions.find(v => v.id === activeVersionId);
    
    // Only create a new version if content has changed from the active version
    if (activeVersion && currentContent !== activeVersion.content) {
      // Calculate next version number
      const nextVersionNumber = findHighestVersionNumber(versions) + 1;
      
      const newVersion: ContentVersion = {
        id: uuidv4(),
        content: currentContent,
        timestamp: new Date().toISOString(),
        source: "manual",
        active: true, // Mark the new version as active
        versionNumber: nextVersionNumber
      };
      
      // Remove active flag from other versions
      const updatedVersions = versions.map(v => ({
        ...v,
        active: false // Remove active flag from all existing versions
      }));
      
      // Add the new version to the collection
      const newVersions = [...updatedVersions, newVersion];
      
      // Update state and form values
      setVersions(newVersions);
      setActiveVersionId(newVersion.id);
      form.setValue(
        versionsFieldName as unknown as Path<T>, 
        newVersions as unknown as PathValue<T, Path<T>>,
        { shouldDirty: true }
      );
    }
  }
};

/**
 * Creates a new version with the specified content
 */
export const addNewVersionUtil = <T extends Record<string, any>>(
  form: UseFormReturn<T>,
  fieldName: keyof T,
  versionsFieldName: keyof T,
  content: string,
  source: "manual" | "ai" | "import",
  versions: ContentVersion[],
  setVersions: (versions: ContentVersion[]) => void,
  setActiveVersionId: (id: string | null) => void
): ContentVersion => {
  // Calculate next version number
  const nextVersionNumber = findHighestVersionNumber(versions) + 1;
  
  // Create a new version
  const newVersion: ContentVersion = {
    id: uuidv4(),
    content,
    timestamp: new Date().toISOString(),
    source,
    active: true, // Mark as active
    versionNumber: nextVersionNumber
  };
  
  // Remove active flag from other versions
  const updatedVersions = versions.map(v => ({
    ...v,
    active: false
  }));
  
  // Add the new version
  const newVersions = [...updatedVersions, newVersion];
  
  // Update state and form values
  setVersions(newVersions);
  setActiveVersionId(newVersion.id);
  form.setValue(
    fieldName as unknown as Path<T>, 
    content as unknown as PathValue<T, Path<T>>,
    { shouldDirty: true }
  );
  form.setValue(
    versionsFieldName as unknown as Path<T>, 
    newVersions as unknown as PathValue<T, Path<T>>,
    { shouldDirty: true }
  );
  
  return newVersion;
};

/**
 * Removes all versions except for a new one based on the current content
 */
export const clearAllVersionsUtil = <T extends Record<string, any>>(
  form: UseFormReturn<T>,
  fieldName: keyof T,
  versionsFieldName: keyof T,
  setVersions: (versions: ContentVersion[]) => void,
  setActiveVersionId: (id: string | null) => void
): void => {
  const currentContent = form.getValues(fieldName as unknown as Path<T>) || "";
  
  // Create a single new version with the current content
  const newVersion: ContentVersion = {
    id: uuidv4(),
    content: typeof currentContent === "string" ? currentContent : "",
    timestamp: new Date().toISOString(),
    source: "manual",
    active: true, // Mark as active
    versionNumber: 1 // Reset to version 1
  };
  
  // Update state and form values
  setVersions([newVersion]);
  setActiveVersionId(newVersion.id);
  form.setValue(
    versionsFieldName as unknown as Path<T>,
    [newVersion] as unknown as PathValue<T, Path<T>>,
    { shouldDirty: true }
  );
};
