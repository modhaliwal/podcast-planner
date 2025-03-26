
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Editor } from "@/components/editor/Editor";
import { Button } from "@/components/ui/button";
import { useState, useCallback } from "react";
import { Separator } from "@/components/ui/separator";
import { FileText, Clock, RotateCcw } from "lucide-react";
import { useVersionManager } from "@/hooks/versions";
import { Episode, ContentVersion } from "@/lib/types";
import { useEpisodeData } from "@/hooks/episodes";

interface EpisodeNotesTabProps {
  episode: Episode;
  onVersionChange?: (versions: ContentVersion[]) => Promise<void>;
}

export function EpisodeNotesTab({ episode, onVersionChange }: EpisodeNotesTabProps) {
  const [content, setContent] = useState(episode.notes || "");
  const [isLoading, setIsLoading] = useState(false);
  
  // Use version manager hook for handling versions
  const { 
    versions, 
    activeVersion, 
    addVersion, 
    selectVersion, 
    revertToVersion,
    isLatestVersionActive
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
  
  // Save function for version changes
  const handleVersionChange = useCallback(
    async (updatedVersions: ContentVersion[]) => {
      try {
        setIsLoading(true);
        
        if (onVersionChange) {
          await onVersionChange(updatedVersions);
        }
      } catch (error) {
        console.error("Error saving version:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [onVersionChange]
  );
  
  // Save content changes
  const handleSaveContent = useCallback(
    async (newContent: string) => {
      try {
        setIsLoading(true);
        setContent(newContent);
        
        // Add new version
        const updatedVersions = addVersion(newContent);
        
        // Save to database
        if (onVersionChange) {
          await onVersionChange(updatedVersions);
        }
      } catch (error) {
        console.error("Error saving content:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [addVersion, onVersionChange]
  );
  
  // Handle selecting a different version
  const handleSelectVersion = useCallback(
    async (versionId: string) => {
      try {
        setIsLoading(true);
        const version = versions.find(v => v.id === versionId);
        if (!version) return;
        
        const updatedVersions = selectVersion(version);
        
        if (onVersionChange) {
          await onVersionChange(updatedVersions as ContentVersion[]);
        }
      } catch (error) {
        console.error("Error selecting version:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [selectVersion, versions, onVersionChange]
  );
  
  // Handle reverting to a previous version
  const handleRevert = useCallback(
    async (versionId: string) => {
      try {
        setIsLoading(true);
        const updatedVersions = revertToVersion(versionId);
        
        if (onVersionChange) {
          await onVersionChange(updatedVersions);
        }
      } catch (error) {
        console.error("Error reverting version:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [revertToVersion, onVersionChange]
  );
  
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
          <Editor
            value={content}
            onChange={setContent}
            onSave={handleSaveContent}
            placeholder="Start typing your notes here..."
            key={`editor-${activeVersion?.id || 'default'}`}
          />
          
          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              {activeVersion ? (
                <>
                  Editing version from {new Date(activeVersion.timestamp).toLocaleString()}
                  {!isLatestVersionActive && (
                    <span className="ml-2 text-yellow-500">
                      (This is not the latest version)
                    </span>
                  )}
                </>
              ) : (
                "Create your first version by saving"
              )}
            </div>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handleSaveContent(content)}
              disabled={isLoading}
            >
              Save Version
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="versions" className="mt-0">
          <div className="rounded-md border">
            <div className="p-4">
              <h3 className="font-medium">Version History</h3>
              <p className="text-sm text-muted-foreground">
                View and restore previous versions of your notes.
              </p>
            </div>
            
            <Separator />
            
            <div className="max-h-[400px] overflow-y-auto p-0">
              {versions.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">
                  No versions saved yet. Save your first version to start tracking changes.
                </div>
              ) : (
                <div className="space-y-0">
                  {versions.map((version, index) => (
                    <div key={version.id} className={`flex items-start justify-between p-4 ${
                      version.active ? 'bg-muted/50' : ''
                    } ${index !== versions.length - 1 ? 'border-b' : ''}`}>
                      <div className="flex-1">
                        <div className="flex items-center">
                          <h4 className="text-sm font-medium">
                            Version {version.versionNumber || index + 1}
                            {version.active && (
                              <span className="ml-2 text-xs text-primary">(Current)</span>
                            )}
                          </h4>
                        </div>
                        <div className="mt-1 text-xs text-muted-foreground">
                          {new Date(version.timestamp).toLocaleString()}
                        </div>
                        <div className="mt-2 line-clamp-2 text-xs text-muted-foreground">
                          {version.content.substring(0, 120)}...
                        </div>
                      </div>
                      
                      <div className="ml-4 flex items-center gap-2">
                        {!version.active && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleSelectVersion(version.id)}
                            disabled={isLoading}
                          >
                            View
                          </Button>
                        )}
                        
                        {!version.active && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-1"
                            onClick={() => handleRevert(version.id)}
                            disabled={isLoading}
                          >
                            <RotateCcw className="h-3 w-3" />
                            Revert
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
