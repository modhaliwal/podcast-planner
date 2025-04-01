
import { useState, useEffect, ReactNode } from "react";
import { ContentVersion } from "@/lib/types";
import { useVersionManager } from "@/hooks/versions";

interface VersionManagerProps {
  content: string;
  versions: ContentVersion[];
  onVersionsChange: (versions: ContentVersion[]) => void;
  onContentChange: (content: string) => void;
  source?: string;
  children: (props: {
    activeVersionId: string | null;
    handleEditorBlur: () => void;
    handleContentChange: (content: string) => void;
    selectVersion: (versionId: string) => void;
    addNewVersion: (content: string) => void;
    addAIVersion: (content: string) => void;
    clearAllVersions: () => void;
    versionSelectorProps: any;
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
  const [localContent, setLocalContent] = useState(content);
  
  // Update local content when prop changes
  useEffect(() => {
    setLocalContent(content);
  }, [content]);
  
  // Use the version manager hook
  const versionManager = useVersionManager({
    content: localContent,
    versions,
    onVersionsChange,
    onContentChange: (newContent) => {
      setLocalContent(newContent);
      onContentChange(newContent);
    },
    source
  });
  
  // Handle content changes
  const handleContentChange = (newContent: string) => {
    setLocalContent(newContent);
    onContentChange(newContent);
  };
  
  // Render children with version manager props
  return (
    <>
      {children({
        ...versionManager,
        handleContentChange
      })}
    </>
  );
}
