
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Episode } from '@/lib/types';

interface EpisodeNotesTabProps {
  episode: Episode;
}

export function EpisodeNotesTab({ episode }: EpisodeNotesTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Episode Notes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="prose dark:prose-invert max-w-none">
          {episode.notes ? (
            <div dangerouslySetInnerHTML={{ __html: episode.notes }} />
          ) : (
            <p>No notes added yet</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
