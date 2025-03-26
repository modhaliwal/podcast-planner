
import { ContentVersion } from "@/lib/types";
import { useVersionManager } from "@/hooks/versions/useVersionManager";

interface VersionManagerProps {
  content: string;
  versions: ContentVersion[];
  onVersionsChange: (versions: ContentVersion[]) => void;
  onContentChange: (content: string) => void;
}

export function VersionManager(props: VersionManagerProps) {
  return useVersionManager(props);
}
