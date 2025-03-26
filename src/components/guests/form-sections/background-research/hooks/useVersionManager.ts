
import { ContentVersion } from "@/lib/types";
import { useVersionInitialization } from "./useVersionInitialization";
import { useVersionSelection } from "./useVersionSelection";
import { useVersionCreation } from "./useVersionCreation";

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
  // Initialize versions and get the active version
  const {
    activeVersionId,
    setActiveVersionId,
    previousContent,
    setPreviousContent
  } = useVersionInitialization(content, versions, onVersionsChange, onContentChange);

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
