
import { ContentVersion } from "@/lib/types";

interface UseVersionSelectionProps {
  versions: ContentVersion[];
  setVersions: (versions: ContentVersion[]) => void;
  setActiveVersionId: (id: string | null) => void;
  onContentChange: (content: string) => void;
}

export function useVersionSelection({
  versions,
  setVersions,
  setActiveVersionId,
  onContentChange
}: UseVersionSelectionProps) {
  const selectVersion = (version: ContentVersion) => {
    // Update the content in the parent component
    onContentChange(version.content);
    
    // Update the active version ID
    setActiveVersionId(version.id);
    
    // Update the active status in the versions array
    const updatedVersions = versions.map(v => ({
      ...v,
      active: v.id === version.id
    }));
    
    setVersions(updatedVersions);
  };

  return { selectVersion };
}
