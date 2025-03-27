
import { ContentVersion } from "@/lib/types";
import { UseFormReturn } from "react-hook-form";
import { 
  createVersionFromContent,
  addNewVersionUtil,
  clearAllVersionsUtil
} from "./utils/versionCreation";
import { selectVersionUtil } from "./utils/versionSelection";

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
    createVersionFromContent(
      form,
      fieldName,
      versionsFieldName,
      activeVersionId,
      versions,
      setVersions,
      setActiveVersionId
    );
  };

  /**
   * Selects a specific version as active
   */
  const selectVersion = (version: ContentVersion) => {
    selectVersionUtil(
      form,
      fieldName,
      versionsFieldName,
      version,
      versions,
      setVersions,
      setActiveVersionId
    );
  };

  /**
   * Removes all versions except for a new one based on the current content
   */
  const clearAllVersions = () => {
    clearAllVersionsUtil(
      form,
      fieldName,
      versionsFieldName,
      setVersions,
      setActiveVersionId
    );
  };

  /**
   * Adds a new version with specified content and optionally marks it as active
   */
  const addNewVersion = (content: string, source: string = "manual") => {
    return addNewVersionUtil(
      form,
      fieldName,
      versionsFieldName,
      content,
      source,
      versions,
      setVersions,
      setActiveVersionId
    );
  };

  return {
    handleContentChange,
    selectVersion,
    clearAllVersions,
    addNewVersion
  };
}
