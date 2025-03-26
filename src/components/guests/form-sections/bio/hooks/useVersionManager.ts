
import { useState, useEffect, useCallback } from "react";
import { ContentVersion } from "@/lib/types";
import { useVersionInitialization } from "./useVersionInitialization";
import { useVersionSelection } from "./useVersionSelection";
import { useVersionCreation } from "./useVersionCreation";

interface UseVersionManagerProps {
  content: string;
  versions: ContentVersion[];
  onVersionsChange: (versions: ContentVersion[]) => void;
  onContentChange: (content: string) => void;
}

export function useVersionManager({
  content,
  versions: initialVersions,
  onVersionsChange,
  onContentChange
}: UseVersionManagerProps) {
  const [activeVersionId, setActiveVersionId] = useState<string | null>(null);
  const [versionsList, setVersionsList] = useState<ContentVersion[]>(initialVersions || []);
  const [hasInitialized, setHasInitialized] = useState(false);

  // Initialize versions if they don't exist - implemented inside useEffect
  useEffect(() => {
    if (hasInitialized) return;
    
    if (versionsList.length === 0 && content) {
      // This will be handled by useVersionCreation
    } else if (versionsList.length > 0) {
      // Find the active version
      const activeVersion = versionsList.find(v => v.active);
      
      if (activeVersion) {
        setActiveVersionId(activeVersion.id);
      } else {
        // If no version is marked as active, use the most recent one
        const sortedVersions = [...versionsList].sort(
          (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
        
        if (sortedVersions.length > 0) {
          const updatedVersions = versionsList.map(v => ({
            ...v,
            active: v.id === sortedVersions[0].id
          }));
          
          setVersionsList(updatedVersions);
          setActiveVersionId(sortedVersions[0].id);
        }
      }
    }
    
    setHasInitialized(true);
  }, [versionsList, content, hasInitialized]);

  // Handle version selection
  const { selectVersion } = useVersionSelection({
    versions: versionsList,
    setVersions: setVersionsList,
    setActiveVersionId,
    onContentChange
  });

  // Handle version creation methods
  const { 
    handleEditorBlur,
    addNewVersion,
    addAIVersion,
    clearAllVersions
  } = useVersionCreation({
    content,
    versions: versionsList, 
    activeVersionId,
    setVersions: setVersionsList,
    setActiveVersionId,
    onContentChange,
    onVersionsChange
  });

  // Sync versions with parent component when they change
  useEffect(() => {
    if (JSON.stringify(initialVersions) !== JSON.stringify(versionsList)) {
      onVersionsChange(versionsList);
    }
  }, [versionsList, onVersionsChange, initialVersions]);

  // Prepare props for VersionSelector component
  const versionSelectorProps = {
    versions: versionsList,
    onSelectVersion: selectVersion,
    activeVersionId: activeVersionId || undefined,
    onClearAllVersions: clearAllVersions
  };

  return {
    activeVersionId,
    versions: versionsList,
    handleEditorBlur,
    selectVersion,
    addNewVersion,
    addAIVersion,
    clearAllVersions,
    versionSelectorProps
  };
}
