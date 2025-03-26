
import { ContentVersion } from "@/lib/types";
import { v4 as uuidv4 } from "uuid";
import { findHighestVersionNumber } from "@/hooks/versions";

interface UseVersionCreationProps {
  content: string;
  versions: ContentVersion[];
  activeVersionId: string | null;
  setVersions: (versions: ContentVersion[]) => void;
  setActiveVersionId: (id: string | null) => void;
  onContentChange: (content: string) => void;
  onVersionsChange: (versions: ContentVersion[]) => void;
}

export function useVersionCreation({
  content,
  versions,
  activeVersionId,
  setVersions,
  setActiveVersionId,
  onContentChange,
  onVersionsChange
}: UseVersionCreationProps) {
  // Create a new version when editor loses focus
  const handleEditorBlur = () => {
    if (!content || !activeVersionId) return;
    
    const activeVersion = versions.find(v => v.id === activeVersionId);
    
    // Only create a new version if content has changed
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
      
      // Add the new version
      const newVersions = [...updatedVersions, newVersion];
      
      setVersions(newVersions);
      setActiveVersionId(newVersion.id);
      onVersionsChange(newVersions);
    }
  };
  
  // Add a new version programmatically
  const addNewVersion = (newContent: string, source: "manual" | "ai" | "import" = "manual") => {
    const nextVersionNumber = findHighestVersionNumber(versions) + 1;
    
    const newVersion: ContentVersion = {
      id: uuidv4(),
      content: newContent,
      timestamp: new Date().toISOString(),
      source: source,
      active: true,
      versionNumber: nextVersionNumber
    };
    
    // Remove active flag from other versions
    const updatedVersions = versions.map(v => ({
      ...v,
      active: false
    }));
    
    // Add the new version
    const newVersions = [...updatedVersions, newVersion];
    
    setVersions(newVersions);
    setActiveVersionId(newVersion.id);
    onContentChange(newContent);
    onVersionsChange(newVersions);
    
    return newVersion;
  };
  
  // Add an AI-generated version
  const addAIVersion = (newContent: string) => {
    return addNewVersion(newContent, "ai");
  };
  
  // Clear all versions except a new one with current content
  const clearAllVersions = () => {
    // Create a new version with current content as version 1
    const newVersion: ContentVersion = {
      id: uuidv4(),
      content: content,
      timestamp: new Date().toISOString(),
      source: "manual",
      active: true,
      versionNumber: 1
    };
    
    setVersions([newVersion]);
    setActiveVersionId(newVersion.id);
    onVersionsChange([newVersion]);
  };
  
  return {
    handleEditorBlur,
    addNewVersion,
    addAIVersion,
    clearAllVersions
  };
}
