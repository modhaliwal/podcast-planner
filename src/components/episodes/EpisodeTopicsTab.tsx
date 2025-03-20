
import { ListChecks } from 'lucide-react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Episode } from '@/lib/types';

interface EpisodeTopicsTabProps {
  episode: Episode;
}

export function EpisodeTopicsTab({ episode }: EpisodeTopicsTabProps) {
  return (
    <Card className="shadow-sm border-slate-200 dark:border-slate-700">
      <CardHeader className="bg-slate-50 dark:bg-slate-800 rounded-t-lg border-b border-slate-200 dark:border-slate-700">
        <CardTitle className="flex items-center gap-2 text-xl">
          <ListChecks className="h-5 w-5 text-primary" />
          Conversation Topics
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[calc(100vh-400px)] max-h-[600px]">
          <div className="p-6">
            {episode.topics.length > 0 ? (
              <div className="space-y-6">
                {episode.topics.map((topic, index) => (
                  <div key={topic.id}>
                    {index > 0 && <Separator className="my-6" />}
                    <div>
                      <h3 className="text-lg font-medium mb-2 text-slate-800 dark:text-slate-200">{topic.title}</h3>
                      <p className="text-slate-600 dark:text-slate-400 whitespace-pre-line">{topic.notes}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-slate-500 dark:text-slate-400 italic">No topics added yet</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
