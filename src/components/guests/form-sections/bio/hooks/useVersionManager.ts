
import { useState, useEffect } from "react";
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

  // Initialize versions if they don't exist - using the hook with useEffect inside
  const { } = useVersionInitialization({
    content,
    versions: versionsList,
    setVersions: setVersionsList,
    setActiveVersionId
  });

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
    onVersionsChange(versionsList);
  }, [versionsList, onVersionsChange]);

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
