
import { useVersionState } from "./useVersionState";
import { useVersionActions } from "./useVersionActions";
import { useSelectorProps } from "./useSelectorProps";
import { UseFormReturn } from "react-hook-form";
import { ContentVersion } from "@/lib/types";
import { useVersionManager } from "./useVersionManager";

// Export utility functions
export * from "./utils/versionNumberUtils";
export * from "./utils/versionInitialization";
export * from "./utils/versionSelection";
export * from "./utils/versionCreation";

interface UseContentVersionsProps<T extends Record<string, any>> {
  form: UseFormReturn<T>;
  fieldName: keyof T;
  versionsFieldName: keyof T;
}

/**
 * Hook to manage content versions for form fields
 * This hook uses the consolidated version manager
 */
export function useContentVersions<T extends Record<string, any>>({
  form,
  fieldName,
  versionsFieldName
}: UseContentVersionsProps<T>) {
  // Get current values
  const content = form.getValues(fieldName as any) || '';
  const versions = form.getValues(versionsFieldName as any) || [];
  
  // Use the consolidated version manager
  const versionManager = useVersionManager({
    content,
    versions,
    onVersionsChange: (newVersions) => {
      form.setValue(versionsFieldName as any, newVersions as any, { shouldDirty: true });
    },
    onContentChange: (newContent) => {
      form.setValue(fieldName as any, newContent as any, { shouldDirty: true });
    }
  });
  
  return versionManager;
}

export * from "./useVersionState";
export * from "./useVersionActions";
export * from "./useSelectorProps";
export * from "./useVersionManager";
