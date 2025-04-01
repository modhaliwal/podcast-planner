
import { useState, useCallback, useEffect } from "react";
import { ContentVersion } from "@/lib/types";
import { v4 as uuidv4 } from "uuid";
import { ensureVersionNumbers } from ".";

interface UseVersionManagerProps {
  content: string;
  versions: ContentVersion[];
  onVersionsChange: (versions: ContentVersion[]) => void;
  onContentChange: (content: string) => void;
  source?: string;
}

/**
 * Hook to manage content versions
 */
export const useVersionManager = ({
  content,
  versions,
  onVersionsChange,
  onContentChange,
  source = "manual"
}: UseVersionManagerProps) => {
  const [activeVersionId, setActiveVersionId] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);
  const [hasBlurred, setHasBlurred] = useState(false);

  // Find the active version
  const activeVersion = versions.find(v => v.id === activeVersionId);

  // Initialize on first render - set active version if none is active
  useEffect(() => {
    if (!initialized && versions.length > 0) {
      const active = versions.find(v => v.active);
      if (active) {
        setActiveVersionId(active.id);
      } else {
        // Set the most recent version as active
        const mostRecent = [...versions].sort((a, b) => 
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        )[0];
        
        if (mostRecent) {
          setActiveVersionId(mostRecent.id);
          // Update the versions array to mark this version as active
          onVersionsChange(
            versions.map(v => ({
              ...v,
              active: v.id === mostRecent.id
            }))
          );
        }
      }
      setInitialized(true);
    }
  }, [versions, initialized, onVersionsChange]);

  // Select a specific version
  const selectVersion = useCallback((versionId: string) => {
    const version = versions.find(v => v.id === versionId);
    if (version) {
      setActiveVersionId(versionId);
      
      // Update the content
      onContentChange(version.content);
      
      // Update active state in versions
      onVersionsChange(
        versions.map(v => ({
          ...v,
          active: v.id === versionId
        }))
      );
    }
  }, [versions, onContentChange, onVersionsChange]);

  // Add a new version on blur if content has changed
  const handleEditorBlur = useCallback(() => {
    setHasBlurred(true);
    
    // Only create a new version if content has been changed and we have a previous version
    if (versions.length > 0 && activeVersion && content !== activeVersion.content) {
      addNewVersion(content);
    }
  }, [content, activeVersion, versions.length]);

  // Add a new version with the current content
  const addNewVersion = useCallback((newContent: string) => {
    const timestamp = new Date().toISOString();
    const newVersionId = uuidv4();
    
    // Create new version
    const newVersion: ContentVersion = {
      id: newVersionId,
      content: newContent,
      timestamp,
      source,
      active: true,
      versionNumber: versions.length + 1
    };
    
    // Add the new version and mark it as active
    const updatedVersions = ensureVersionNumbers([
      ...versions.map(v => ({ ...v, active: false })),
      newVersion
    ]);
    
    onVersionsChange(updatedVersions);
    setActiveVersionId(newVersionId);
  }, [versions, source, onVersionsChange]);

  // Add a new AI-generated version
  const addAIVersion = useCallback((aiContent: string) => {
    const timestamp = new Date().toISOString();
    const newVersionId = uuidv4();
    
    // Create new version
    const newVersion: ContentVersion = {
      id: newVersionId,
      content: aiContent,
      timestamp,
      source: "ai",
      active: true,
      versionNumber: versions.length + 1
    };
    
    // Add the new version and mark it as active
    const updatedVersions = ensureVersionNumbers([
      ...versions.map(v => ({ ...v, active: false })),
      newVersion
    ]);
    
    onVersionsChange(updatedVersions);
    setActiveVersionId(newVersionId);
  }, [versions, onVersionsChange]);

  // Clear all versions
  const clearAllVersions = useCallback(() => {
    onVersionsChange([]);
    setActiveVersionId(null);
  }, [onVersionsChange]);

  // Build props for the VersionSelector component
  const versionSelectorProps = {
    versions,
    activeVersionId,
    onVersionSelect: selectVersion
  };

  return {
    versions,
    activeVersion,
    activeVersionId,
    selectVersion,
    addNewVersion,
    addAIVersion,
    clearAllVersions,
    handleEditorBlur,
    hasInitialized: initialized,
    versionSelectorProps
  };
};
