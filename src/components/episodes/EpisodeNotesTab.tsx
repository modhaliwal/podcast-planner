
import { useState, useEffect } from 'react';
import { BookText } from 'lucide-react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Episode, ContentVersion } from '@/lib/types';
import { VersionManager } from '@/components/guests/form-sections/background-research/VersionManager';
import { VersionSelector } from '@/components/guests/form-sections/VersionSelector';

interface EpisodeNotesTabProps {
  episode: Episode;
}

export function EpisodeNotesTab({ episode }: EpisodeNotesTabProps) {
  const [notes, setNotes] = useState<string>(episode.notes || '');
  const [notesVersions, setNotesVersions] = useState<ContentVersion[]>(episode.notesVersions || []);
  
  // Use the version manager to handle version control
  const {
    activeVersionId,
    versionSelectorProps
  } = VersionManager({
    content: notes,
    versions: notesVersions,
    onVersionsChange: setNotesVersions,
    onContentChange: setNotes
  });
  
  // Update notes if episode changes
  useEffect(() => {
    setNotes(episode.notes || '');
    setNotesVersions(episode.notesVersions || []);
  }, [episode]);
  
  return (
    <Card className="shadow-sm border-slate-200 dark:border-slate-700">
      <CardHeader className="bg-slate-50 dark:bg-slate-800 rounded-t-lg border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-xl">
            <BookText className="h-5 w-5 text-primary" />
            Episode Notes
          </CardTitle>
          
          {notesVersions.length > 0 && (
            <div className="flex items-center">
              <VersionSelector {...versionSelectorProps} />
            </div>
          )}
        </div>
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
