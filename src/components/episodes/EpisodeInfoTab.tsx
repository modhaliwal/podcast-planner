
import { Book, Info } from 'lucide-react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Episode } from '@/lib/types';

interface EpisodeInfoTabProps {
  episode: Episode;
}

export function EpisodeInfoTab({ episode }: EpisodeInfoTabProps) {
  return (
    <Card className="shadow-sm border-slate-200 dark:border-slate-700">
      <CardHeader className="bg-slate-50 dark:bg-slate-800 rounded-t-lg border-b border-slate-200 dark:border-slate-700">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Info className="h-5 w-5 text-primary" />
          Introduction
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[calc(100vh-400px)] max-h-[600px]">
          <div className="p-6">
            <div className="prose dark:prose-invert max-w-none">
              {episode.introduction ? (
                <p className="whitespace-pre-line text-slate-700 dark:text-slate-300 leading-relaxed">{episode.introduction}</p>
              ) : (
                <p className="text-slate-500 dark:text-slate-400 italic">No introduction added yet</p>
              )}
            </div>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
