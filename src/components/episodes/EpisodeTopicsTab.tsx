
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Episode } from '@/lib/types';

interface EpisodeTopicsTabProps {
  episode: Episode;
}

export function EpisodeTopicsTab({ episode }: EpisodeTopicsTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Conversation Topics</CardTitle>
      </CardHeader>
      <CardContent>
        {episode.topics.length > 0 ? (
          <div className="space-y-6">
            {episode.topics.map((topic, index) => (
              <div key={topic.id}>
                {index > 0 && <Separator className="my-6" />}
                <div>
                  <h3 className="text-lg font-medium mb-2">{topic.title}</h3>
                  <p className="text-muted-foreground whitespace-pre-line">{topic.notes}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No topics added yet</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
