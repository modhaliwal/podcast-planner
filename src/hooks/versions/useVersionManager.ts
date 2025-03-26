
import { useState, useEffect, useCallback } from "react";
import { ContentVersion } from "@/lib/types";
import { v4 as uuidv4 } from "uuid";
import { findHighestVersionNumber } from "./utils/versionNumberUtils";

interface UseVersionManagerProps {
  content: string;
  versions: ContentVersion[];
  onVersionsChange: (versions: ContentVersion[]) => void;
  onContentChange: (content: string) => void;
  source?: "manual" | "ai" | "import";
}

/**
 * Universal hook for managing content versions across the application
 * This replaces various separate version management implementations
 */
export function useVersionManager({
  content,
  versions = [],
  onVersionsChange,
  onContentChange,
  source = "manual"
}: UseVersionManagerProps) {
  const [activeVersionId, setActiveVersionId] = useState<string | null>(null);
  const [previousContent, setPreviousContent] = useState<string>(content);
  const [hasInitialized, setHasInitialized] = useState(false);

  // Initialize versions if they don't exist or set active version
  useEffect(() => {
    if (hasInitialized) return;
    
    const timer = setTimeout(() => {
      if (versions.length === 0 && content) {
        // Create initial version if none exists
        const initialVersion: ContentVersion = {
          id: uuidv4(),
          content: content,
          timestamp: new Date().toISOString(),
          source: source,
          active: true,
          versionNumber: 1
        };
        
        onVersionsChange([initialVersion]);
        setActiveVersionId(initialVersion.id);
        setPreviousContent(content);
      } else if (versions.length > 0) {
        // Find the active version
        const activeVersion = versions.find(v => v.active);
        
        if (activeVersion) {
          setActiveVersionId(activeVersion.id);
          
          // Only update content if it's different to avoid render loops
          if (content !== activeVersion.content) {
            onContentChange(activeVersion.content);
          }
          setPreviousContent(activeVersion.content);
        } else {
          // If no version is marked as active, use the most recent one
          const sortedVersions = [...versions].sort(
            (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          );
          
          if (sortedVersions.length > 0) {
            const updatedVersions = versions.map(v => ({
              ...v,
              active: v.id === sortedVersions[0].id
            }));
            
            onVersionsChange(updatedVersions);
            setActiveVersionId(sortedVersions[0].id);
            setPreviousContent(sortedVersions[0].content);
            if (content !== sortedVersions[0].content) {
              onContentChange(sortedVersions[0].content);
            }
          }
        }
      }
      
      setHasInitialized(true);
    }, 0);
    
    return () => clearTimeout(timer);
  }, [hasInitialized, versions, content, onVersionsChange, onContentChange, source]);

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
  }, [versions, onVersionsChange, onContentChange]);

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
  }, [content, versions, activeVersionId, previousContent, onVersionsChange]);

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
  }, [versions, onVersionsChange, onContentChange]);

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
  }, [content, onVersionsChange]);

  // Maps content changes to handleEditorBlur for backward compatibility
  const handleContentChange = useCallback(() => {
    handleEditorBlur();
  }, [handleEditorBlur]);

  // Prepare props for VersionSelector component
  const versionSelectorProps = {
    versions,
    onSelectVersion: selectVersion,
    activeVersionId: activeVersionId || undefined,
    onClearAllVersions: clearAllVersions
  };

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
