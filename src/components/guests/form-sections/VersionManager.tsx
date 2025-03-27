
import { ReactNode } from "react";
import { ContentVersion } from "@/lib/types";
import { useVersionManager } from "@/hooks/versions/useVersionManager";

interface VersionManagerProps {
  content: string;
  versions: ContentVersion[];
  onVersionsChange: (versions: ContentVersion[]) => void;
  onContentChange: (content: string) => void;
  source?: string; // Changed from union type to string
  children: (props: {
    activeVersionId: string | null;
    handleEditorBlur: () => void;
    handleContentChange: () => void;
    selectVersion: (version: ContentVersion) => void;
    addNewVersion: (content: string, source?: string) => ContentVersion; // Changed parameter type
    addAIVersion: (content: string) => ContentVersion;
    clearAllVersions: () => void;
    versionSelectorProps: {
      versions: ContentVersion[];
      onSelectVersion: (version: ContentVersion) => void;
      activeVersionId?: string;
      onClearAllVersions?: () => void;
    };
    hasInitialized: boolean;
  }) => ReactNode;
}

export function VersionManager({
  content,
  versions,
  onVersionsChange,
  onContentChange,
  source = "manual",
  children
}: VersionManagerProps) {
  const versionManager = useVersionManager({
    content,
    versions,
    onVersionsChange,
    onContentChange,
    source
  });

  return <>{children(versionManager)}</>;
}
