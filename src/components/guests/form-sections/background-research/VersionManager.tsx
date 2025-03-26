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
        source: 'manual'
      };
      onVersionsChange([initialVersion]);
      setActiveVersionId(initialVersion.id);
      setPreviousContent(content);
    } else if (!activeVersionId && versions.length > 0) {
      const sortedVersions = [...versions].sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
      setActiveVersionId(sortedVersions[0].id);
      setPreviousContent(sortedVersions[0].content);
    }
  }, [versions, content, onVersionsChange, activeVersionId]);

  useEffect(() => {
    if (content !== previousContent) {
      setHasChangedSinceLastSave(true);
    }
  }, [content, previousContent]);

  const selectVersion = (version: ContentVersion) => {
    setActiveVersionId(version.id);
    onContentChange(version.content);
    setPreviousContent(version.content);
    setHasChangedSinceLastSave(false);
  };

  const handleClearAllVersions = () => {
    // Keep only the active version
    const activeVersion = versions.find(v => v.id === activeVersionId);
    
    if (activeVersion) {
      // Keep only the active version
      onVersionsChange([activeVersion]);
    } else {
      // If no active version found, create a new version with current content
      onVersionsChange([]);
      
      // Create a new initial version if there's content
      if (content.trim()) {
        const initialVersion: ContentVersion = {
          id: uuidv4(),
          content: content,
          timestamp: new Date().toISOString(),
          source: 'manual'
        };
        onVersionsChange([initialVersion]);
        setActiveVersionId(initialVersion.id);
        setPreviousContent(content);
      }
    }
    
    // Reset states
    setHasChangedSinceLastSave(false);
    setVersionCreatedSinceFormOpen(false);
  };

  const saveCurrentVersion = () => {
    if (!content.trim()) return;
    if (content === previousContent) return;
    if (versionCreatedSinceFormOpen) return;
    
    const newVersion: ContentVersion = {
      id: uuidv4(),
      content: content,
      timestamp: new Date().toISOString(),
      source: 'manual'
    };
    
    const updatedVersions = [...versions, newVersion];
    onVersionsChange(updatedVersions);
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
    const newVersion: ContentVersion = {
      id: uuidv4(),
      content: newContent,
      timestamp: new Date().toISOString(),
      source: 'ai'
    };
    
    const updatedVersions = [...versions, newVersion];
    onVersionsChange(updatedVersions);
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
