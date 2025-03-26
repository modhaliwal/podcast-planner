
// This file is now deprecated, but kept for backward compatibility
// We're now using the centralized version management system from @/hooks/versions

import { useVersionManager as useVersionManagerCore } from "@/hooks/versions/useVersionManager";
import { ContentVersion } from "@/lib/types";

interface UseVersionManagerProps {
  content: string;
  versions: ContentVersion[];
  onVersionsChange: (versions: ContentVersion[]) => void;
  onContentChange: (content: string) => void;
}

export function useVersionManager(props: UseVersionManagerProps) {
  return useVersionManagerCore(props);
}
