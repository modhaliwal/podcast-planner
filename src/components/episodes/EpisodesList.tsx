
import React from 'react';
import { Episode, Guest } from '@/lib/types';
import { EpisodeCard } from './EpisodeCard';
import { EmptyState } from '@/components/ui/empty-state';
import { LoadingIndicator } from '@/components/ui/loading-indicator';
import { MicIcon } from 'lucide-react';

interface EpisodesListProps {
  episodes: Episode[];
  guests: Guest[];
  isLoading: boolean;
  searchQuery: string;
}

export function EpisodesList({ episodes, guests, isLoading, searchQuery }: EpisodesListProps) {
  if (isLoading) {
    return <LoadingIndicator message="Loading episodes..." />;
  }
  
  if (episodes.length === 0) {
    return (
      <EmptyState 
        icon={<MicIcon className="h-8 w-8 text-muted-foreground" />}
        title="No episodes found"
        description={searchQuery ? "Try adjusting your search terms" : "Get started by creating your first episode"}
        action={{
          label: "Create Episode",
          onClick: () => window.location.href = "/episodes/new"
        }}
      />
    );
  }
  
  return (
    <div className="space-y-4">
      {episodes.map(episode => (
        <EpisodeCard 
          key={episode.id} 
          episode={episode} 
          guests={guests}
        />
      ))}
    </div>
  );
}
