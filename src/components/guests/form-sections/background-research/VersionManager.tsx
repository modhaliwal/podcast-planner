
import { useState, useEffect } from "react";
import { ContentVersion } from "@/lib/types";
import { v4 as uuidv4 } from "uuid";
import { VersionSelector } from "../VersionSelector";

interface VersionManagerProps {
  content: string;
  versions: ContentVersion[];
  onVersionsChange: (versions: ContentVersion[]) => void;
  onContentChange: (content: string) => void;
}

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

  useEffect(() => {
    if (versions.length === 0 && content) {
      const initialVersion: ContentVersion = {
        id: uuidv4(),
        content: content,
        timestamp: new Date().toISOString(),
        source: 'manual',
        active: true
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
        const updatedVersions = versions.map((v, i) => ({
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

  useEffect(() => {
    if (content !== previousContent) {
      setHasChangedSinceLastSave(true);
    }
  }, [content, previousContent]);

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

  const handleClearAllVersions = () => {
    // Create a single active version with current content
    const newVersion: ContentVersion = {
      id: uuidv4(),
      content: content,
      timestamp: new Date().toISOString(),
      source: 'manual',
      active: true
    };
    
    onVersionsChange([newVersion]);
    setActiveVersionId(newVersion.id);
    setPreviousContent(content);
    
    // Reset states
    setHasChangedSinceLastSave(false);
    setVersionCreatedSinceFormOpen(false);
  };

  const saveCurrentVersion = () => {
    if (!content.trim()) return;
    if (content === previousContent) return;
    if (versionCreatedSinceFormOpen) return;
    
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
      active: true
    };
    
    const finalVersions = [...updatedVersions, newVersion];
    onVersionsChange(finalVersions);
    setActiveVersionId(newVersion.id);
    setPreviousContent(content);
    setHasChangedSinceLastSave(false);
    setVersionCreatedSinceFormOpen(true);
    
    return newVersion;
  };

  const handleEditorBlur = () => {
    if (hasChangedSinceLastSave && content !== previousContent && content.trim() && !versionCreatedSinceFormOpen) {
      saveCurrentVersion();
    }
  };

  const addAIVersion = (newContent: string) => {
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
      active: true
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
