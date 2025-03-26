
import { useCallback } from "react";
import { ContentVersion } from "@/lib/types";
import { v4 as uuidv4 } from "uuid";
import { findHighestVersionNumber } from "../utils/versionNumberUtils";

/**
 * Hook that provides actions for managing versions
 */
export function useVersionActions(
  content: string,
  versions: ContentVersion[],
  activeVersionId: string | null,
  previousContent: string,
  setPreviousContent: (content: string) => void,
  setActiveVersionId: (id: string | null) => void,
  onVersionsChange: (versions: ContentVersion[]) => void,
  onContentChange: (content: string) => void
) {
  // Handle version selection
  const selectVersion = useCallback((version: ContentVersion) => {
    // Update content with selected version
    onContentChange(version.content);
    
    // Update all versions to set the selected one as active
    const updatedVersions = versions.map(v => ({
      ...v,
      active: v.id === version.id
    }));
    
    onVersionsChange(updatedVersions);
    setActiveVersionId(version.id);
    setPreviousContent(version.content);
  }, [versions, onVersionsChange, onContentChange, setActiveVersionId, setPreviousContent]);

  // Handle editor blur - create a new version if content has changed
  const handleEditorBlur = useCallback(() => {
    if (!content.trim() || content === previousContent) return;
    
    const activeVersion = versions.find(v => v.id === activeVersionId);
    
    // Only create a new version if content has changed from active version
    if (activeVersion && content !== activeVersion.content) {
      const nextVersionNumber = findHighestVersionNumber(versions) + 1;
      
      const newVersion: ContentVersion = {
        id: uuidv4(),
        content: content,
        timestamp: new Date().toISOString(),
        source: "manual",
        active: true,
        versionNumber: nextVersionNumber
      };
      
      // Remove active flag from other versions
      const updatedVersions = versions.map(v => ({
        ...v,
        active: false
      }));
      
      const newVersions = [...updatedVersions, newVersion];
      onVersionsChange(newVersions);
      setActiveVersionId(newVersion.id);
      setPreviousContent(content);
    }
  }, [content, versions, activeVersionId, previousContent, onVersionsChange, setActiveVersionId, setPreviousContent]);

  // Maps content changes to handleEditorBlur for backward compatibility
  const handleContentChange = useCallback(() => {
    handleEditorBlur();
  }, [handleEditorBlur]);

  // Add a new version with specified content
  const addNewVersion = useCallback((newContent: string, newSource: "manual" | "ai" | "import" = "manual") => {
    const nextVersionNumber = findHighestVersionNumber(versions) + 1;
    
    const newVersion: ContentVersion = {
      id: uuidv4(),
      content: newContent,
      timestamp: new Date().toISOString(),
      source: newSource,
      active: true,
      versionNumber: nextVersionNumber
    };
    
    // Remove active flag from other versions
    const updatedVersions = versions.map(v => ({
      ...v,
      active: false
    }));
    
    const newVersions = [...updatedVersions, newVersion];
    onVersionsChange(newVersions);
    setActiveVersionId(newVersion.id);
    onContentChange(newContent);
    setPreviousContent(newContent);
    
    return newVersion;
  }, [versions, onVersionsChange, onContentChange, setActiveVersionId, setPreviousContent]);

  // Add an AI-generated version
  const addAIVersion = useCallback((newContent: string) => {
    return addNewVersion(newContent, "ai");
  }, [addNewVersion]);

  // Clear all versions except a new one with current content
  const clearAllVersions = useCallback(() => {
    const newVersion: ContentVersion = {
      id: uuidv4(),
      content: content,
      timestamp: new Date().toISOString(),
      source: "manual",
      active: true,
      versionNumber: 1
    };
    
    onVersionsChange([newVersion]);
    setActiveVersionId(newVersion.id);
    setPreviousContent(content);
  }, [content, onVersionsChange, setActiveVersionId, setPreviousContent]);

  return {
    selectVersion,
    handleEditorBlur,
    handleContentChange,
    addNewVersion,
    addAIVersion,
    clearAllVersions
  };
}
