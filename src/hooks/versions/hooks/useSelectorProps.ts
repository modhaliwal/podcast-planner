
import { ContentVersion } from "@/lib/types";
import { useMemo } from "react";

/**
 * Hook that prepares props for the VersionSelector component
 */
export function useSelectorProps(
  versions: ContentVersion[],
  activeVersionId: string | null,
  selectVersion: (version: ContentVersion) => void,
  clearAllVersions: () => void
) {
  // Use memoization to prevent unnecessary re-renders
  return useMemo(() => {
    // Ensure versions is an array and has valid entries
    const safeVersions = Array.isArray(versions) ? versions : [];
    
    // Ensure each version has required properties to avoid runtime errors
    const validVersions = safeVersions.filter(v => 
      v && typeof v === 'object' && v.id && v.content !== undefined
    );
    
    // Sort versions by version number for display
    const sortedVersions = [...validVersions].sort((a, b) => {
      // Sort by versionNumber if available
      if (a.versionNumber && b.versionNumber) {
        return b.versionNumber - a.versionNumber;
      }
      // Fallback to timestamp sort
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });
    
    return {
      versions: sortedVersions,
      onSelectVersion: selectVersion,
      activeVersionId: activeVersionId || undefined,
      onClearAllVersions: clearAllVersions
    };
  }, [versions, activeVersionId, selectVersion, clearAllVersions]);
}
