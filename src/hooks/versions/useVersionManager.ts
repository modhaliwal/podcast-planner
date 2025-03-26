
import { useCallback, useState, useEffect } from "react";
import { ContentVersion } from "@/lib/types";
import { useVersionInitialization } from "./hooks/useVersionInitialization";
import { useVersionActions } from "./hooks/useVersionActions";
import { useSelectorProps } from "./hooks/useSelectorProps";

interface UseVersionManagerProps {
  content: string;
  versions?: ContentVersion[] | null;
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
  // Ensure versions is always an array
  const safeVersions = Array.isArray(versions) ? versions : [];
  
  // For backward compatibility
  const [internalContent, setInternalContent] = useState(content);
  
  // Initialize version state
  const {
    activeVersionId,
    setActiveVersionId,
    previousContent,
    setPreviousContent,
    hasInitialized
  } = useVersionInitialization(content, safeVersions, onVersionsChange, onContentChange);

  // Use memo to avoid unnecessary rerenders
  const activeVersion = useCallback(() => {
    return safeVersions.find(v => v.id === activeVersionId) || null;
  }, [safeVersions, activeVersionId]);

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
    safeVersions,
    activeVersionId,
    previousContent,
    setPreviousContent,
    setActiveVersionId,
    onVersionsChange,
    onContentChange
  );

  // Prepare props for VersionSelector component
  const versionSelectorProps = useSelectorProps(
    safeVersions,
    activeVersionId,
    selectVersion,
    clearAllVersions
  );
  
  // Check if the active version is the latest version
  const isLatestVersionActive = useCallback(() => {
    if (!safeVersions.length || !activeVersionId) return true;
    
    const sortedVersions = [...safeVersions].sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
    
    return sortedVersions[0]?.id === activeVersionId;
  }, [safeVersions, activeVersionId]);
  
  // Function to set content and update state
  const setContent = useCallback((newContent: string) => {
    setInternalContent(newContent);
    onContentChange(newContent);
  }, [onContentChange]);
  
  // Function to add version that returns the new versions array
  const addVersion = useCallback((newContent: string): ContentVersion[] => {
    const result = addNewVersion(newContent);
    return [...safeVersions.filter(v => !v.active), result];
  }, [addNewVersion, safeVersions]);
  
  // Revert to a specific version
  const revertToVersion = useCallback((versionId: string): ContentVersion[] => {
    const version = safeVersions.find(v => v.id === versionId);
    if (!version) return safeVersions;
    
    // Create a new version based on the reverted content
    const newVersions = addVersion(version.content);
    return newVersions;
  }, [safeVersions, addVersion]);

  // Log props for debugging
  useEffect(() => {
    console.log("VersionManager:", {
      content,
      versionsCount: safeVersions.length,
      activeVersionId,
      activeVersion: activeVersion(),
      hasInitialized
    });
  }, [content, safeVersions, activeVersionId, activeVersion, hasInitialized]);

  return {
    activeVersionId,
    activeVersion: activeVersion(),
    versions: safeVersions,
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
