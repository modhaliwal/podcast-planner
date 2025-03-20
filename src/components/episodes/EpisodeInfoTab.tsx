
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Episode } from '@/lib/types';

interface EpisodeInfoTabProps {
  episode: Episode;
}

export function EpisodeInfoTab({ episode }: EpisodeInfoTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Introduction</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="prose dark:prose-invert max-w-none">
          <p className="whitespace-pre-line">{episode.introduction}</p>
        </div>
      </CardContent>
    </Card>
  );
}
