
import { useCallback, useState } from "react";
import { ContentVersion } from "@/lib/types";
import { useVersionInitialization } from "./hooks/useVersionInitialization";
import { useVersionActions } from "./hooks/useVersionActions";
import { useSelectorProps } from "./hooks/useSelectorProps";

interface UseVersionManagerProps {
  content: string;
  versions?: ContentVersion[];
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
  // For backward compatibility
  const [internalContent, setInternalContent] = useState(content);
  
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
  
  // Find the active version for convenience
  const activeVersion = versions.find(v => v.id === activeVersionId) || null;
  
  // Check if the active version is the latest version
  const isLatestVersionActive = useCallback(() => {
    if (!versions.length || !activeVersionId) return true;
    
    const sortedVersions = [...versions].sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
    
    return sortedVersions[0].id === activeVersionId;
  }, [versions, activeVersionId]);
  
  // Function to set content and update state
  const setContent = useCallback((newContent: string) => {
    setInternalContent(newContent);
    onContentChange(newContent);
  }, [onContentChange]);
  
  // Function to add version that returns the new versions array
  const addVersion = useCallback((newContent: string): ContentVersion[] => {
    const result = addNewVersion(newContent);
    return [...versions.filter(v => !v.active), result];
  }, [addNewVersion, versions]);
  
  // Revert to a specific version
  const revertToVersion = useCallback((versionId: string): ContentVersion[] => {
    const version = versions.find(v => v.id === versionId);
    if (!version) return versions;
    
    // Create a new version based on the reverted content
    const newVersions = addVersion(version.content);
    return newVersions;
  }, [versions, addVersion]);

  return {
    activeVersionId,
    activeVersion,
    versions,
    handleEditorBlur,
    handleContentChange,
    selectVersion,
    addNewVersion,
    addVersion,
    addAIVersion,
    clearAllVersions,
    revertToVersion,
    setContent,
    versionSelectorProps,
    hasInitialized,
    isLatestVersionActive: isLatestVersionActive()
  };
}
