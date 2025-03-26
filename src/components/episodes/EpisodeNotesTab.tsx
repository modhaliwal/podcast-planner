
import { useState } from "react";
import { Episode, ContentVersion } from "@/lib/types";
import { FileText } from "lucide-react";
import { useVersionManager } from "@/hooks/versions";
import { Editor } from "@/components/editor/Editor";
import { VersionSelector } from "@/components/guests/form-sections/VersionSelector";
import { Button } from "@/components/ui/button";

interface EpisodeNotesTabProps {
  episode: Episode;
  onVersionChange?: (versions: ContentVersion[]) => Promise<void>;
}

export function EpisodeNotesTab({ episode, onVersionChange }: EpisodeNotesTabProps) {
  const [content, setContent] = useState(episode.notes || "");
  
  // Use version manager hook for handling versions
  const { 
    versions, 
    activeVersion, 
    activeVersionId,
    addVersion, 
    selectVersion,
    clearAllVersions,
    handleEditorBlur,
    versionSelectorProps
  } = useVersionManager({
    content,
    versions: (episode.notesVersions || []) as ContentVersion[],
    onVersionsChange: async (updatedVersions) => {
      try {
        if (onVersionChange) {
          await onVersionChange(updatedVersions);
        }
      } catch (error) {
        console.error("Error saving versions:", error);
      }
    },
    onContentChange: setContent,
  });
  
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          <span className="font-medium">Episode Notes</span>
        </div>
        
        {versions.length > 0 && (
          <VersionSelector {...versionSelectorProps} />
        )}
      </div>
      
      <Editor
        value={content}
        onChange={setContent}
        onBlur={handleEditorBlur}
        placeholder="No notes available for this episode."
      />
    </div>
  );
}
