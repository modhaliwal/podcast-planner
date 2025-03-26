
import { v4 as uuidv4 } from "uuid";
import { ContentVersion } from "@/lib/types";
import { UseFormReturn, Path, PathValue } from "react-hook-form";

interface UseVersionActionsProps<T extends Record<string, any>> {
  form: UseFormReturn<T>;
  fieldName: keyof T;
  versionsFieldName: keyof T;
  activeVersionId: string | null;
  versions: ContentVersion[];
  setVersions: (versions: ContentVersion[]) => void;
  setActiveVersionId: (id: string | null) => void;
}

/**
 * Find the highest version number in an array of content versions
 */
const findHighestVersionNumber = (versions: ContentVersion[]): number => {
  if (!versions.length) return 0;
  return Math.max(...versions.map(v => v.versionNumber || 0));
};

/**
 * Hook to provide actions for interacting with content versions
 */
export function useVersionActions<T extends Record<string, any>>({
  form,
  fieldName,
  versionsFieldName,
  activeVersionId,
  versions,
  setVersions,
  setActiveVersionId
}: UseVersionActionsProps<T>) {
  /**
   * Creates a new version based on the current content
   */
  const handleContentChange = () => {
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
   * Selects a specific version as active
   */
  const selectVersion = (version: ContentVersion) => {
    if (!versions.length) return;
    
    // Update form with the selected version content
    form.setValue(
      fieldName as unknown as Path<T>, 
      version.content as unknown as PathValue<T, Path<T>>,
      { shouldDirty: true }
    );
    
    // Update the active version ID in state
    setActiveVersionId(version.id);
    
    // Update active flags in the versions array
    const updatedVersions = versions.map(v => ({
      ...v,
      active: v.id === version.id
    }));
    
    // Update state and form values
    setVersions(updatedVersions);
    form.setValue(
      versionsFieldName as unknown as Path<T>, 
      updatedVersions as unknown as PathValue<T, Path<T>>,
      { shouldDirty: true }
    );
  };

  /**
   * Removes all versions except for a new one based on the current content
   */
  const clearAllVersions = () => {
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

  /**
   * Adds a new version with specified content and optionally marks it as active
   */
  const addNewVersion = (content: string, source: "manual" | "ai" | "import" = "manual") => {
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

  return {
    handleContentChange,
    selectVersion,
    clearAllVersions,
    addNewVersion
  };
}
