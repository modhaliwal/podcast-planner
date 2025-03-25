
import { Link } from 'react-router-dom';
import { Calendar, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Guest, Episode } from '@/lib/types';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

interface GuestEpisodesListProps {
  guest: Guest;
  episodes: Episode[];
}

export function GuestEpisodesList({ guest, episodes }: GuestEpisodesListProps) {
  // Filter episodes that include this guest
  const guestEpisodes = episodes.filter(
    episode => episode.guestIds.includes(guest.id)
  );
  
  const sortedEpisodes = [...guestEpisodes].sort((a, b) => {
    // Sort by scheduled date, with most recent first
    return new Date(b.scheduled).getTime() - new Date(a.scheduled).getTime();
  });
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Episodes with {guest.name}</CardTitle>
      </CardHeader>
      <CardContent>
        {sortedEpisodes.length > 0 ? (
          <div className="space-y-4">
            {sortedEpisodes.map((episode) => (
              <div key={episode.id} className="flex items-start space-x-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                <div className={cn(
                  "h-10 w-10 rounded-full flex items-center justify-center",
                  episode.status === 'published' ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" :
                  episode.status === 'recorded' ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300" :
                  "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300"
                )}>
                  <Calendar className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">
                    {episode.title} 
                    <span className="ml-2 text-sm text-muted-foreground">
                      (Episode #{episode.episodeNumber})
                    </span>
                  </h4>
                  <div className="flex items-center text-sm text-muted-foreground mb-2">
                    <span className="capitalize">{episode.status}</span>
                    <span className="mx-2">•</span>
                    <span>{format(new Date(episode.scheduled), 'MMM d, yyyy')}</span>
                  </div>
                  <p className="text-sm line-clamp-2">{episode.introduction}</p>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link to={`/episodes/${episode.id}`}>
                    <FileText className="h-4 w-4 mr-1" />
                    Details
                  </Link>
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No episodes with this guest yet</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
