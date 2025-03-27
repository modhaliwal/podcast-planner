import { useCallback } from "react";
import { ContentVersion } from "@/lib/types";
import { v4 as uuidv4 } from "uuid";
import { findHighestVersionNumber } from "../utils/versionNumberUtils";
import { isSignificantChange } from "../utils/versionCreation";

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

  // Handle editor blur - create a new version ONLY if content has changed significantly
  const handleEditorBlur = useCallback(() => {
    if (!content.trim()) return;
    
    // Only create a new version if content has changed from previous content
    if (content === previousContent) return;
    
    const activeVersion = versions.find(v => v.id === activeVersionId);
    
    // Only create a new version if content has changed significantly from active version
    if (activeVersion && content !== activeVersion.content) {
      // Check if the change is significant using the utility function
      const contentChanged = isSignificantChange(content, activeVersion.content);
      
      if (contentChanged) {
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
      }
      
      // Always update previousContent to avoid repeated version creation
      setPreviousContent(content);
    } else {
      // No active version or no change, just update previous content
      setPreviousContent(content);
    }
  }, [content, versions, activeVersionId, previousContent, onVersionsChange, setActiveVersionId, setPreviousContent]);

  // Maps content changes to handleEditorBlur for backward compatibility
  const handleContentChange = useCallback(() => {
    handleEditorBlur();
  }, [handleEditorBlur]);

  // Add a new version with specified content
  const addNewVersion = useCallback((newContent: string, newSource: "manual" | "ai" | "import" = "manual") => {
    // Skip if the content is identical to the previous content
    if (newContent === previousContent) return;
    
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
  }, [versions, onVersionsChange, onContentChange, setActiveVersionId, setPreviousContent, previousContent]);

  // Add an AI-generated version
  const addAIVersion = useCallback((newContent: string) => {
    return addNewVersion(newContent, "ai");
  }, [addNewVersion]);

  // Clear all versions except the currently active one, preserving its version number and content
  const clearAllVersions = useCallback(() => {
    // Find the active version
    const activeVersion = versions.find(v => v.id === activeVersionId);
    
    if (!activeVersion) {
      console.warn("No active version found when clearing versions");
      return;
    }
    
    // Create a new version with the active version's content (not the current content)
    const newVersion: ContentVersion = {
      id: uuidv4(),
      content: activeVersion.content, // Use active version's content, not current content
      timestamp: new Date().toISOString(),
      source: activeVersion.source,
      active: true,
      versionNumber: activeVersion.versionNumber
    };
    
    // Update state with just this single version
    onVersionsChange([newVersion]);
    setActiveVersionId(newVersion.id);
    setPreviousContent(activeVersion.content);
    
    // Update the editor content to match the active version
    onContentChange(activeVersion.content);
  }, [versions, activeVersionId, onVersionsChange, setActiveVersionId, setPreviousContent, onContentChange]);

  return {
    selectVersion,
    handleEditorBlur,
    handleContentChange,
    addNewVersion,
    addAIVersion,
    clearAllVersions
  };
}
