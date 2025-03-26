
import { ContentVersion } from "@/lib/types";

/**
 * Hook that prepares props for the VersionSelector component
 */
export function useSelectorProps(
  versions: ContentVersion[],
  activeVersionId: string | null,
  selectVersion: (version: ContentVersion) => void,
  clearAllVersions: () => void
) {
  // Prepare props for VersionSelector component
  const versionSelectorProps = {
    versions,
    onSelectVersion: selectVersion,
    activeVersionId: activeVersionId || undefined,
    onClearAllVersions: clearAllVersions
  };

  return versionSelectorProps;
}
