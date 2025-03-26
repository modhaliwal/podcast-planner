
import { useState, useEffect } from "react";
import { ContentVersion } from "@/lib/types";
import { v4 as uuidv4 } from "uuid";
import { UseFormReturn, Path, PathValue } from "react-hook-form";

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
      const currentContent = form.getValues(fieldName as unknown as Path<T>) || "";
      const existingVersions = form.getValues(versionsFieldName as unknown as Path<T>) || [];

      if (Array.isArray(existingVersions) && existingVersions.length === 0 && currentContent) {
        const initialVersion: ContentVersion = {
          id: uuidv4(),
          content: String(currentContent),
          timestamp: new Date().toISOString(),
          source: "manual",
          active: true
        };
        
        // Update both the local state and the form value
        setVersions([initialVersion]);
        form.setValue(
          versionsFieldName as unknown as Path<T>, 
          [initialVersion] as unknown as PathValue<T, Path<T>>
        );
        setActiveVersionId(initialVersion.id);
      } else if (Array.isArray(existingVersions) && existingVersions.length > 0) {
        // Find active version or use the most recent one
        const activeVersion = existingVersions.find(v => v.active === true);
        
        if (activeVersion) {
          setVersions(existingVersions);
          setActiveVersionId(activeVersion.id);
          form.setValue(
            fieldName as unknown as Path<T>,
            activeVersion.content as unknown as PathValue<T, Path<T>>
          );
        } else {
          // If no active version found, mark the most recent one as active
          const sortedVersions = [...existingVersions].sort(
            (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          );
          
          // Update all versions to set the first one as active
          const updatedVersions = existingVersions.map(v => ({
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
