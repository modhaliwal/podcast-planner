
import { ContentVersion } from "@/lib/types";

interface UseSelectorPropsParams {
  versions: ContentVersion[];
  activeVersionId: string | null;
  selectVersion: (version: ContentVersion) => void;
  clearAllVersions: () => void;
}

/**
 * Hook to create props for the VersionSelector component
 */
export function useSelectorProps({
  versions,
  activeVersionId,
  selectVersion,
  clearAllVersions
}: UseSelectorPropsParams) {
  const versionSelectorProps = {
    versions,
    onSelectVersion: selectVersion,
    activeVersionId: activeVersionId || undefined,
    onClearAllVersions: clearAllVersions
  };

  return { versionSelectorProps };
}
