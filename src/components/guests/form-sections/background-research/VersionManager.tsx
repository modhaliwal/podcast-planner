
import { useState, useEffect } from "react";
import { ContentVersion } from "@/lib/types";
import { v4 as uuidv4 } from "uuid";

interface VersionManagerProps {
  content: string;
  versions: ContentVersion[];
  onVersionsChange: (versions: ContentVersion[]) => void;
  onContentChange: (content: string) => void;
}

/**
 * Find the highest version number in an array of content versions
 */
const findHighestVersionNumber = (versions: ContentVersion[]): number => {
  if (!versions.length) return 0;
  return Math.max(...versions.map(v => v.versionNumber || 0));
};

export function VersionManager({
  content,
  versions = [],
  onVersionsChange,
  onContentChange
}: VersionManagerProps) {
  const [activeVersionId, setActiveVersionId] = useState<string | undefined>(undefined);
  const [previousContent, setPreviousContent] = useState<string>("");
  const [hasChangedSinceLastSave, setHasChangedSinceLastSave] = useState<boolean>(false);
  const [versionCreatedSinceFormOpen, setVersionCreatedSinceFormOpen] = useState<boolean>(false);

  // Ensure all versions have version numbers and active flag
  useEffect(() => {
    if (versions.length > 0) {
      const needsUpdate = versions.some(v => 
        v.versionNumber === undefined || v.active === undefined
      );
      
      if (needsUpdate) {
        // Sort versions by timestamp (oldest first)
        const sortedVersions = [...versions].sort(
          (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );
        
        // Add sequential version numbers and ensure active flag exists
        const versionsWithUpdates = sortedVersions.map((v, index) => ({
          ...v,
          versionNumber: v.versionNumber || (index + 1),
          active: v.active || false
        }));
        
        onVersionsChange(versionsWithUpdates);
      }
    }
  }, [versions, onVersionsChange]);

  // Initialize the active version and content
  useEffect(() => {
    if (versions.length === 0 && content) {
      // Create initial version if none exists
      const initialVersion: ContentVersion = {
        id: uuidv4(),
        content: content,
        timestamp: new Date().toISOString(),
        source: 'manual',
        active: true,
        versionNumber: 1
      };
      onVersionsChange([initialVersion]);
      setActiveVersionId(initialVersion.id);
      setPreviousContent(content);
    } else if (!activeVersionId && versions.length > 0) {
      // Find active version or use the most recent one
      const activeVersion = versions.find(v => v.active === true);
      
      if (activeVersion) {
        setActiveVersionId(activeVersion.id);
        setPreviousContent(activeVersion.content);
        onContentChange(activeVersion.content);
      } else {
        // If no active version, use the most recent one and mark it as active
        const sortedVersions = [...versions].sort(
          (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
        
        // Update all versions to set the first one as active
        const updatedVersions = versions.map(v => ({
          ...v,
          active: v.id === sortedVersions[0].id
        }));
        
        onVersionsChange(updatedVersions);
        setActiveVersionId(sortedVersions[0].id);
        setPreviousContent(sortedVersions[0].content);
        onContentChange(sortedVersions[0].content);
      }
    }
  }, [versions, content, onVersionsChange, activeVersionId, onContentChange]);

  // Track content changes
  useEffect(() => {
    if (content !== previousContent) {
      setHasChangedSinceLastSave(true);
    }
  }, [content, previousContent]);

  // Function to select a specific version
  const selectVersion = (version: ContentVersion) => {
    // Update all versions to set the selected one as active
    const updatedVersions = versions.map(v => ({
      ...v,
      active: v.id === version.id
    }));
    
    onVersionsChange(updatedVersions);
    setActiveVersionId(version.id);
    onContentChange(version.content);
    setPreviousContent(version.content);
    setHasChangedSinceLastSave(false);
  };

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
    activeVersionId,
    handleEditorBlur,
    addAIVersion,
    versionSelectorProps: {
      versions,
      onSelectVersion: selectVersion,
      activeVersionId,
      onClearAllVersions: handleClearAllVersions
    }
  };
}
