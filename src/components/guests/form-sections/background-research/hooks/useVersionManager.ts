
import { ContentVersion } from "@/lib/types";
import { useVersionInitialization } from "./useVersionInitialization";
import { useVersionSelection } from "./useVersionSelection";
import { useVersionCreation } from "./useVersionCreation";
import { useState, useEffect } from "react";

interface VersionManagerProps {
  content: string;
  versions: ContentVersion[];
  onVersionsChange: (versions: ContentVersion[]) => void;
  onContentChange: (content: string) => void;
}

/**
 * Main hook that composes all version management functionality
 */
export function useVersionManager({
  content,
  versions = [],
  onVersionsChange,
  onContentChange
}: VersionManagerProps) {
  // Initialize state for tracking previous content
  const [previousContent, setPreviousContent] = useState<string>(content);
  const [activeVersionId, setActiveVersionId] = useState<string | undefined>(undefined);
  const [hasInitialized, setHasInitialized] = useState(false);
  
  // Initialize versions and get the active version
  useEffect(() => {
    if (hasInitialized) return;
    
    // Find active version or use latest
    if (versions.length > 0) {
      const activeVersion = versions.find(v => v.active === true);
      
      if (activeVersion) {
        setActiveVersionId(activeVersion.id);
        setPreviousContent(activeVersion.content);
        
        // Only update content if it's different to avoid render loops
        if (content !== activeVersion.content) {
          onContentChange(activeVersion.content);
        }
      } else {
        // If no active version, use the most recent one
        const sortedVersions = [...versions].sort(
          (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
        
        if (sortedVersions.length > 0) {
          // Update all versions to set the first one as active
          const updatedVersions = versions.map(v => ({
            ...v,
            active: v.id === sortedVersions[0].id
          }));
          
          onVersionsChange(updatedVersions);
          setActiveVersionId(sortedVersions[0].id);
          setPreviousContent(sortedVersions[0].content);
          
          // Only update content if it's different
          if (content !== sortedVersions[0].content) {
            onContentChange(sortedVersions[0].content);
          }
        }
      }
    } else if (content) {
      // We'll handle initialization through the useVersionCreation hook
      // which will create an initial version if none exists
    }
    
    setHasInitialized(true);
  }, [versions, content, onVersionsChange, onContentChange, hasInitialized]);

  // Handle version selection
  const { selectVersion } = useVersionSelection(
    versions,
    onVersionsChange,
    onContentChange,
    setActiveVersionId
  );

  // Handle version creation
  const {
    handleEditorBlur,
    addAIVersion,
    handleClearAllVersions
  } = useVersionCreation(
    content,
    versions,
    onVersionsChange,
    setActiveVersionId,
    previousContent,
    setPreviousContent
  );

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
