
import { MicIcon } from 'lucide-react';
import { Episode, Guest } from '@/lib/types';
import { EpisodesList } from './EpisodesList';
import { EmptyState } from '@/components/ui/empty-state';

interface EpisodesContentProps {
  isLoading: boolean;
  filteredEpisodes: Episode[];
  guests: Guest[];
  searchQuery: string;
}

export function EpisodesContent({ 
  isLoading, 
  filteredEpisodes,
  guests,
  searchQuery
}: EpisodesContentProps) {
  if (isLoading) {
    return null;
  }
  
  if (filteredEpisodes.length === 0) {
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
      <EpisodesList 
        episodes={filteredEpisodes} 
        guests={guests}
      />
    </div>
  );
}
