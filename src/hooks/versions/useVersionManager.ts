
import { useCallback } from "react";
import { ContentVersion } from "@/lib/types";
import { useVersionInitialization } from "./hooks/useVersionInitialization";
import { useVersionActions } from "./hooks/useVersionActions";
import { useSelectorProps } from "./hooks/useSelectorProps";

interface UseVersionManagerProps {
  content: string;
  versions: ContentVersion[];
  onVersionsChange: (versions: ContentVersion[]) => void;
  onContentChange: (content: string) => void;
  source?: "manual" | "ai" | "import";
}

/**
 * Universal hook for managing content versions across the application
 * This integrates smaller, focused hooks for specific version management tasks
 */
export function useVersionManager({
  content,
  versions = [],
  onVersionsChange,
  onContentChange,
  source = "manual"
}: UseVersionManagerProps) {
  // Initialize version state
  const {
    activeVersionId,
    setActiveVersionId,
    previousContent,
    setPreviousContent,
    hasInitialized
  } = useVersionInitialization(content, versions, onVersionsChange, onContentChange);

  // Version actions (create, select, clear)
  const {
    selectVersion,
    handleEditorBlur,
    handleContentChange,
    addNewVersion,
    addAIVersion,
    clearAllVersions
  } = useVersionActions(
    content,
    versions,
    activeVersionId,
    previousContent,
    setPreviousContent,
    setActiveVersionId,
    onVersionsChange,
    onContentChange
  );

  // Prepare props for VersionSelector component
  const versionSelectorProps = useSelectorProps(
    versions,
    activeVersionId,
    selectVersion,
    clearAllVersions
  );

  return {
    activeVersionId,
    versions,
    handleEditorBlur,
    handleContentChange,
    selectVersion,
    addNewVersion,
    addAIVersion,
    clearAllVersions,
    versionSelectorProps
  };
}
