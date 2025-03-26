
import { useState } from "react";
import { ContentVersion } from "@/lib/types";
import { v4 as uuidv4 } from "uuid";

/**
 * Find the highest version number in an array of content versions
 */
const findHighestVersionNumber = (versions: ContentVersion[]): number => {
  if (!versions.length) return 0;
  return Math.max(...versions.map(v => v.versionNumber || 0));
};

/**
 * Hook for creating new versions
 */
export function useVersionCreation(
  content: string,
  versions: ContentVersion[],
  onVersionsChange: (versions: ContentVersion[]) => void,
  setActiveVersionId: (id: string | undefined) => void,
  previousContent: string,
  setPreviousContent: (content: string) => void
) {
  const [hasChangedSinceLastSave, setHasChangedSinceLastSave] = useState<boolean>(false);
  const [versionCreatedSinceFormOpen, setVersionCreatedSinceFormOpen] = useState<boolean>(false);

  // Track content changes
  if (content !== previousContent) {
    setHasChangedSinceLastSave(true);
  }

  // Function to clear all versions and create a new one with current content
  const handleClearAllVersions = () => {
    // Create a single active version with current content
    const newVersion: ContentVersion = {
      id: uuidv4(),
      content: content,
      timestamp: new Date().toISOString(),
      source: 'manual',
      active: true,
      versionNumber: 1
    };
    
    onVersionsChange([newVersion]);
    setActiveVersionId(newVersion.id);
    setPreviousContent(content);
    
    // Reset states
    setHasChangedSinceLastSave(false);
    setVersionCreatedSinceFormOpen(false);
  };

  // Function to save the current content as a new version
  const saveCurrentVersion = () => {
    if (!content.trim()) return;
    if (content === previousContent) return;
    if (versionCreatedSinceFormOpen) return;
    
    // Calculate next version number
    const nextVersionNumber = findHighestVersionNumber(versions) + 1;
    
    // Set all versions as inactive
    const updatedVersions = versions.map(v => ({
      ...v,
      active: false
    }));
    
    // Create new active version
    const newVersion: ContentVersion = {
      id: uuidv4(),
      content: content,
      timestamp: new Date().toISOString(),
      source: 'manual',
      active: true,
      versionNumber: nextVersionNumber
    };
    
    const finalVersions = [...updatedVersions, newVersion];
    onVersionsChange(finalVersions);
    setActiveVersionId(newVersion.id);
    setPreviousContent(content);
    setHasChangedSinceLastSave(false);
    setVersionCreatedSinceFormOpen(true);
    
    return newVersion;
  };

  // Function to handle editor blur event
  const handleEditorBlur = () => {
    if (hasChangedSinceLastSave && content !== previousContent && content.trim() && !versionCreatedSinceFormOpen) {
      saveCurrentVersion();
    }
  };

  // Function to add an AI-generated version
  const addAIVersion = (newContent: string) => {
    // Calculate next version number
    const nextVersionNumber = findHighestVersionNumber(versions) + 1;
    
    // Set all versions as inactive
    const updatedVersions = versions.map(v => ({
      ...v,
      active: false
    }));
    
    // Create new active version
    const newVersion: ContentVersion = {
      id: uuidv4(),
      content: newContent,
      timestamp: new Date().toISOString(),
      source: 'ai',
      active: true,
      versionNumber: nextVersionNumber
    };
    
    const finalVersions = [...updatedVersions, newVersion];
    onVersionsChange(finalVersions);
    setActiveVersionId(newVersion.id);
    setPreviousContent(newContent);
    setHasChangedSinceLastSave(false);
    setVersionCreatedSinceFormOpen(true);
  };

  return {
    hasChangedSinceLastSave,
    versionCreatedSinceFormOpen,
    handleEditorBlur,
    addAIVersion,
    handleClearAllVersions
  };
}
