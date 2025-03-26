
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { Episode, ContentVersion } from "@/lib/types";
import { FileText, Clock } from "lucide-react";
import { NotesEditor } from "./notes/NotesEditor";
import { VersionHistory } from "./notes/VersionHistory";
import { useVersionManager } from "@/hooks/versions";

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
    addVersion, 
    selectVersion, 
    revertToVersion,
    isLatestVersionActive,
    setContent: updateContent
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
      <Tabs defaultValue="editor" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="editor" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span>Editor</span>
          </TabsTrigger>
          <TabsTrigger value="versions" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>Version History</span>
            {versions.length > 0 && (
              <span className="ml-1 rounded-full bg-primary/10 px-2 text-xs">
                {versions.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="editor" className="mt-0">
          <NotesEditor 
            content={content}
            setContent={setContent}
            activeVersion={activeVersion}
            isLatestVersionActive={isLatestVersionActive}
            onSaveContent={(newContent) => {
              updateContent(newContent);
              // Return the updated versions from addVersion
              const newVersions = addVersion(newContent);
              return newVersions;
            }}
          />
        </TabsContent>
        
        <TabsContent value="versions" className="mt-0">
          <VersionHistory 
            versions={versions}
            activeVersion={activeVersion}
            onSelectVersion={selectVersion}
            onRevertVersion={(versionId) => {
              const updatedVersions = revertToVersion(versionId);
              return updatedVersions;
            }}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
