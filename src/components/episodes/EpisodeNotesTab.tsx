
import { useState } from 'react';
import { BookText, Clock } from 'lucide-react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Episode, ContentVersion } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

interface EpisodeNotesTabProps {
  episode: Episode;
}

export function EpisodeNotesTab({ episode }: EpisodeNotesTabProps) {
  const [selectedVersion, setSelectedVersion] = useState<ContentVersion | null>(null);
  
  // Use the selected version content or fall back to episode.notes
  const notesToDisplay = selectedVersion ? selectedVersion.content : episode.notes;
  
  // Sort versions by timestamp, newest first
  const sortedVersions = episode.notesVersions ? 
    [...episode.notesVersions].sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    ) : [];
  
  return (
    <Card className="shadow-sm border-slate-200 dark:border-slate-700">
      <CardHeader className="bg-slate-50 dark:bg-slate-800 rounded-t-lg border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-xl">
            <BookText className="h-5 w-5 text-primary" />
            Episode Notes
          </CardTitle>
          
          {episode.notesVersions && episode.notesVersions.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {sortedVersions.length} {sortedVersions.length === 1 ? 'version' : 'versions'}
              </span>
              
              <div className="flex gap-1">
                {sortedVersions.slice(0, 3).map((version, index) => (
                  <Badge 
                    key={version.id}
                    variant={selectedVersion?.id === version.id ? "default" : "outline"}
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                    onClick={() => setSelectedVersion(selectedVersion?.id === version.id ? null : version)}
                  >
                    v{sortedVersions.length - index}
                  </Badge>
                ))}
                
                {sortedVersions.length > 3 && (
                  <Badge variant="outline" className="cursor-default">
                    +{sortedVersions.length - 3}
                  </Badge>
                )}
              </div>
            </div>
          )}
        </div>
        
        {selectedVersion && (
          <div className="mt-2 flex items-center justify-between">
            <Badge variant="secondary" className="text-xs">
              {format(new Date(selectedVersion.timestamp), "MMM d, yyyy h:mm a")}
            </Badge>
            <Badge variant="outline" className="capitalize text-xs">
              {selectedVersion.source}
            </Badge>
          </div>
        )}
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[calc(100vh-400px)] max-h-[600px]">
          <div className="p-6">
            <div className="prose dark:prose-invert max-w-none">
              {notesToDisplay ? (
                <div className="rich-text-content" dangerouslySetInnerHTML={{ __html: notesToDisplay }} />
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
