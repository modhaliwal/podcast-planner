
import { useState, useEffect } from "react";
import { ContentVersion } from "@/lib/types";
import { UseFormReturn, Path } from "react-hook-form";
import { initializeVersions, processExistingVersions } from "./utils/versionInitialization";

interface UseVersionStateProps<T extends Record<string, any>> {
  form: UseFormReturn<T>;
  fieldName: keyof T;
  versionsFieldName: keyof T;
}

/**
 * Hook to manage the state of content versions
 */
export function useVersionState<T extends Record<string, any>>({
  form,
  fieldName,
  versionsFieldName
}: UseVersionStateProps<T>) {
  const [activeVersionId, setActiveVersionId] = useState<string | null>(null);
  const [versions, setVersions] = useState<ContentVersion[]>([]);
  const [hasInitialized, setHasInitialized] = useState<boolean>(false);

  // Initialize versions if they don't exist
  useEffect(() => {
    if (!hasInitialized) {
      const existingVersions = form.getValues(versionsFieldName as unknown as Path<T>) || [];
      
      if (Array.isArray(existingVersions) && existingVersions.length === 0) {
        // Initialize with current content if no versions exist
        initializeVersions(form, fieldName, versionsFieldName, setVersions, setActiveVersionId);
      } else if (Array.isArray(existingVersions) && existingVersions.length > 0) {
        // Process existing versions
        processExistingVersions(
          form, 
          fieldName, 
          versionsFieldName, 
          existingVersions, 
          setVersions, 
          setActiveVersionId
        );
      }
      
      setHasInitialized(true);
    }
  }, [form, fieldName, versionsFieldName, hasInitialized]);

  return {
    activeVersionId,
    versions,
    setVersions,
    setActiveVersionId,
    hasInitialized
  };
}
