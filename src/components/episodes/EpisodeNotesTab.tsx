
import { BookText } from 'lucide-react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Episode, ContentVersion } from '@/lib/types';
import { VersionSelector } from '@/components/guests/form-sections/VersionSelector';
import { VersionManager } from '@/components/guests/form-sections/VersionManager';
import { v4 as uuidv4 } from 'uuid';

interface EpisodeNotesContentProps {
  episode: Episode;
}

function EpisodeNotesContent({ episode }: EpisodeNotesContentProps) {
  const notes = episode.notes || '';
  
  // Ensure we have valid versions array
  const getCurrentVersions = (): ContentVersion[] => {
    const versions = episode.notesVersions || [];
    
    // Ensure each version has required properties
    return versions.map(version => ({
      id: version.id || uuidv4(),
      content: version.content || "",
      timestamp: version.timestamp || new Date().toISOString(),
      source: version.source || "manual",
      active: version.active || false,
      versionNumber: version.versionNumber || 1
    }));
  };
  
  return (
    <Card className="shadow-sm border-slate-200 dark:border-slate-700">
      <CardHeader className="bg-slate-50 dark:bg-slate-800 rounded-t-lg border-b border-slate-200 dark:border-slate-700">
        <VersionManager
          content={notes}
          versions={getCurrentVersions()}
          onVersionsChange={() => {/* read-only view */}}
          onContentChange={() => {/* read-only view */}}
        >
          {({ versionSelectorProps }) => (
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-xl">
                <BookText className="h-5 w-5 text-primary" />
                Episode Notes
              </CardTitle>
              
              {versionSelectorProps.versions.length > 0 && (
                <div className="flex items-center">
                  <VersionSelector {...versionSelectorProps} />
                </div>
              )}
            </div>
          )}
        </VersionManager>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[calc(100vh-400px)] max-h-[600px]">
          <div className="p-6">
            <div className="prose dark:prose-invert max-w-none">
              {notes ? (
                <div className="rich-text-content" dangerouslySetInnerHTML={{ __html: notes }} />
              ) : (
                <p className="text-slate-500 dark:text-slate-400 italic">No notes added yet</p>
              )}
            </div>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

interface EpisodeNotesTabProps {
  episode: Episode;
}

export function EpisodeNotesTab({ episode }: EpisodeNotesTabProps) {
  return <EpisodeNotesContent episode={episode} />;
}
