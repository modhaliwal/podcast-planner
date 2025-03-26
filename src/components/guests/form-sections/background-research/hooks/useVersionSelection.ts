
import { ContentVersion } from "@/lib/types";

/**
 * Hook for version selection functionality
 */
export function useVersionSelection(
  versions: ContentVersion[],
  onVersionsChange: (versions: ContentVersion[]) => void,
  onContentChange: (content: string) => void,
  setActiveVersionId: (id: string | undefined) => void
) {
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
  };

  return { selectVersion };
}
