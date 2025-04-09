
import { MicIcon } from 'lucide-react';
import { Episode, Guest } from '@/lib/types';
import { EpisodesList } from './EpisodesList';
import { EmptyState } from '@/components/ui/empty-state';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface EpisodesContentProps {
  filteredEpisodes: Episode[];
  guests: Guest[];
  searchQuery: string;
}

export function EpisodesContent({ 
  filteredEpisodes,
  guests,
  searchQuery
}: EpisodesContentProps) {
  const navigate = useNavigate();
  
  if (filteredEpisodes.length === 0) {
    return (
      <EmptyState 
        icon={<MicIcon className="h-8 w-8 text-muted-foreground" />}
        title="No episodes found"
        description={searchQuery ? "Try adjusting your search terms" : "Get started by creating your first episode"}
        action={{
          label: "Create Episode",
          onClick: () => navigate("/episodes/new")
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
      <div className="text-center text-sm text-muted-foreground py-2">
        {filteredEpisodes.length} Episode{filteredEpisodes.length !== 1 ? 's' : ''}
      </div>
    </div>
  );
}
