
import { Link } from 'react-router-dom';
import { Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Guest, Episode } from '@/lib/types';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { episodeStatusColors } from '@/lib/statusColors';
import { EmptyState } from '@/components/ui/empty-state';
import { Podcast } from 'lucide-react';

interface GuestEpisodesListProps {
  guest: Guest;
  episodes: Episode[];
}

export function GuestEpisodesList({ guest, episodes }: GuestEpisodesListProps) {
  // Sort episodes by scheduled date, with most recent first
  const sortedEpisodes = [...episodes].sort((a, b) => {
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
            {sortedEpisodes.map((episode) => {
              // Get status colors
              const statusKey = episode.status.toLowerCase() as keyof typeof episodeStatusColors;
              const statusColor = episodeStatusColors[statusKey] || episodeStatusColors.scheduled;
              
              return (
                <Link key={episode.id} to={`/episodes/${episode.id}`} className="block">
                  <div className="flex items-start space-x-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                    <div className={cn(
                      "h-10 w-10 rounded-full flex items-center justify-center",
                      statusColor.bg,
                      statusColor.text,
                      statusColor.darkBg,
                      statusColor.darkText
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
                        <span className={cn(
                          "capitalize px-1.5 py-0.5 rounded-sm text-xs mr-2",
                          statusColor.bg,
                          statusColor.text,
                          statusColor.darkBg,
                          statusColor.darkText
                        )}>
                          {episode.status}
                        </span>
                        <span>{format(new Date(episode.scheduled), 'MMM d, yyyy')}</span>
                      </div>
                      <p className="text-sm line-clamp-2">{episode.introduction}</p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <EmptyState 
            icon={<Podcast className="h-6 w-6 text-muted-foreground" />}
            title="No episodes yet"
            description={`${guest.name} hasn't appeared on any episodes yet`}
          />
        )}
      </CardContent>
    </Card>
  );
}
