
import { useState, useEffect } from "react";
import { Episode, ContentVersion } from "@/lib/types";
import { FileText } from "lucide-react";
import { Editor } from "@/components/editor/Editor";
import { Button } from "@/components/ui/button";
import { processVersions } from "@/lib/versionUtils";
import { v4 as uuidv4 } from "uuid";

interface EpisodeNotesTabProps {
  episode: Episode;
  onVersionChange?: (versions: ContentVersion[]) => Promise<void>;
}

export function EpisodeNotesTab({ episode, onVersionChange }: EpisodeNotesTabProps) {
  const [content, setContent] = useState(episode.notes || "");
  const [versions, setVersions] = useState<ContentVersion[]>([]);
  const [activeVersionId, setActiveVersionId] = useState<string | null>(null);
  
  // Initialize versions
  useEffect(() => {
    const initialVersions = processVersions(episode.notesVersions || []);
    setVersions(initialVersions);
    
    // Set active version
    if (initialVersions.length > 0) {
      const active = initialVersions.find(v => v.active);
      if (active) {
        setActiveVersionId(active.id);
      } else {
        // Default to most recent
        const sortedVersions = [...initialVersions].sort(
          (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
        if (sortedVersions.length > 0) {
          setActiveVersionId(sortedVersions[0].id);
        }
      }
    }
  }, [episode.notesVersions]);
  
  // Update content when active version changes
  useEffect(() => {
    if (activeVersionId) {
      const activeVersion = versions.find(v => v.id === activeVersionId);
      if (activeVersion) {
        setContent(activeVersion.content);
      }
    }
  }, [activeVersionId, versions]);
  
  // Handler for editor blur - save version
  const handleEditorBlur = async () => {
    if (!content.trim()) return;
    
    // Check if content changed from active version
    const activeVersion = versions.find(v => v.id === activeVersionId);
    if (activeVersion && activeVersion.content === content) return;
    
    // Create new version
    const newVersion: ContentVersion = {
      id: uuidv4(),
      content,
      timestamp: new Date().toISOString(),
      source: "manual",
      active: true,
      versionNumber: versions.length + 1
    };
    
    // Mark all others as inactive
    const updatedVersions = [
      ...versions.map(v => ({ ...v, active: false })),
      newVersion
    ];
    
    setVersions(updatedVersions);
    setActiveVersionId(newVersion.id);
    
    // Notify parent
    if (onVersionChange) {
      await onVersionChange(updatedVersions);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          <span className="font-medium">Episode Notes</span>
        </div>
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
