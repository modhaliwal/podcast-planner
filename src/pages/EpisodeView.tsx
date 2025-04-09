import { useParams, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Shell } from '@/components/layout/Shell';
import { EpisodeDetail } from '@/components/episodes/EpisodeDetail';
import { Button } from '@/components/ui/button';
import { useEffect, useCallback } from 'react';
import { useEpisodeLoader } from '@/hooks/episodes';
const EpisodeView = () => {
  const {
    id
  } = useParams<{
    id: string;
  }>();
  const {
    episodes,
    guests,
    refreshEpisodes,
    refreshGuests
  } = useAuth();

  // Use the episodeLoader hook for consistent data fetching
  const {
    isLoading,
    episode,
    refreshEpisode
  } = useEpisodeLoader(id);

  // Refresh data once on initial mount with a controlled approach
  const refreshData = useCallback(async () => {
    if (id) {
      await refreshEpisodes();
      await refreshGuests();
    }
  }, [id, refreshEpisodes, refreshGuests]);
  useEffect(() => {
    refreshData();
  }, [refreshData]);
  if (!episode && !isLoading) {
    return <Shell>
        <div className="page-container">
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <h1 className="text-2xl font-semibold mb-2">Episode not found</h1>
            <p className="text-muted-foreground mb-6">The episode you're looking for doesn't exist or has been removed.</p>
            <Button asChild>
              <Link to="/episodes">Back to Episodes</Link>
            </Button>
          </div>
        </div>
      </Shell>;
  }
  return <Shell>
      <div className="page-container">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div className="flex-1 min-w-0">
            
          </div>
        </div>
        
        {episode && <EpisodeDetail episode={episode} guests={guests} />}
      </div>
    </Shell>;
};
export default EpisodeView;