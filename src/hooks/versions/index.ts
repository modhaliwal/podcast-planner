
import { useVersionState } from "./useVersionState";
import { useVersionActions } from "./useVersionActions";
import { useSelectorProps } from "./useSelectorProps";
import { UseFormReturn } from "react-hook-form";
import { ContentVersion } from "@/lib/types";

interface UseContentVersionsProps<T extends Record<string, any>> {
  form: UseFormReturn<T>;
  fieldName: keyof T;
  versionsFieldName: keyof T;
}

/**
 * Hook to manage content versions for form fields
 */
export function useContentVersions<T extends Record<string, any>>({
  form,
  fieldName,
  versionsFieldName
}: UseContentVersionsProps<T>) {
  // Manage version state
  const {
    activeVersionId,
    versions,
    setVersions,
    setActiveVersionId
  } = useVersionState({
    form,
    fieldName,
    versionsFieldName
  });

  // Get version actions
  const {
    handleContentChange,
    selectVersion,
    clearAllVersions,
    addNewVersion
  } = useVersionActions({
    form,
    fieldName,
    versionsFieldName,
    activeVersionId,
    versions,
    setVersions,
    setActiveVersionId
  });

  // Get props for VersionSelector component
  const { versionSelectorProps } = useSelectorProps({
    versions,
    activeVersionId,
    selectVersion,
    clearAllVersions
  });

  return {
    activeVersionId,
    versions,
    handleContentChange,
    selectVersion,
    clearAllVersions,
    addNewVersion,
    versionSelectorProps
  };
}

export * from "./useVersionState";
export * from "./useVersionActions";
export * from "./useSelectorProps";
