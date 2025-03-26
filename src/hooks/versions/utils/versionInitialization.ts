
import { ContentVersion } from "@/lib/types";
import { v4 as uuidv4 } from "uuid";
import { UseFormReturn, Path, PathValue } from "react-hook-form";
import { ensureVersionNumbers } from "./versionNumberUtils";

/**
 * Initialize versions if they don't exist
 */
export const initializeVersions = <T extends Record<string, any>>(
  form: UseFormReturn<T>,
  fieldName: keyof T,
  versionsFieldName: keyof T,
  setVersions: (versions: ContentVersion[]) => void,
  setActiveVersionId: (id: string | null) => void
): void => {
  const currentContent = form.getValues(fieldName as unknown as Path<T>) || "";
  const existingVersions = form.getValues(versionsFieldName as unknown as Path<T>) || [];

  if (Array.isArray(existingVersions) && existingVersions.length === 0 && currentContent) {
    const initialVersion: ContentVersion = {
      id: uuidv4(),
      content: String(currentContent),
      timestamp: new Date().toISOString(),
      source: "manual",
      active: true,
      versionNumber: 1 // Initialize with version 1
    };
    
    // Update both the local state and the form value
    setVersions([initialVersion]);
    form.setValue(
      versionsFieldName as unknown as Path<T>, 
      [initialVersion] as unknown as PathValue<T, Path<T>>
    );
    setActiveVersionId(initialVersion.id);
  }
};

/**
 * Process existing versions
 */
export const processExistingVersions = <T extends Record<string, any>>(
  form: UseFormReturn<T>,
  fieldName: keyof T,
  versionsFieldName: keyof T,
  existingVersions: ContentVersion[],
  setVersions: (versions: ContentVersion[]) => void,
  setActiveVersionId: (id: string | null) => void
): void => {
  if (!Array.isArray(existingVersions) || existingVersions.length === 0) return;
  
  // Ensure all versions have version numbers
  const versionsWithNumbers = ensureVersionNumbers(existingVersions);
  
  // Find active version or use the most recent one
  const activeVersion = versionsWithNumbers.find(v => v.active === true);
  
  if (activeVersion) {
    // If we found a version marked as active, use it
    setVersions(versionsWithNumbers);
    setActiveVersionId(activeVersion.id);
    form.setValue(
      fieldName as unknown as Path<T>,
      activeVersion.content as unknown as PathValue<T, Path<T>>
    );
    
    // Update form with versions that have version numbers
    if (JSON.stringify(existingVersions) !== JSON.stringify(versionsWithNumbers)) {
      form.setValue(
        versionsFieldName as unknown as Path<T>,
        versionsWithNumbers as unknown as PathValue<T, Path<T>>
      );
    }
  } else {
    // If no active version found, mark the most recent one as active
    const sortedVersions = [...versionsWithNumbers].sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
    
    // Update all versions to set the first one as active
    const updatedVersions = versionsWithNumbers.map(v => ({
      ...v,
      active: v.id === sortedVersions[0].id
    }));
    
    setVersions(updatedVersions);
    setActiveVersionId(sortedVersions[0].id);
    form.setValue(
      versionsFieldName as unknown as Path<T>,
      updatedVersions as unknown as PathValue<T, Path<T>>
    );
    form.setValue(
      fieldName as unknown as Path<T>,
      sortedVersions[0].content as unknown as PathValue<T, Path<T>>
    );
  }
};
