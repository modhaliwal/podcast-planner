
import { useParams, Link } from 'react-router-dom';
import { Shell } from '@/components/layout/Shell';
import { EpisodeDetail } from '@/components/episodes/EpisodeDetail';
import { Button } from '@/components/ui/button';
import { useData } from '@/context/DataContext';
import { useEpisodeLoader } from '@/hooks/episodes/useEpisodeLoader';

const EpisodeView = () => {
  const { id } = useParams<{ id: string }>();
  const { guests } = useData();

  // Use the episodeLoader hook for consistent data fetching
  const {
    isLoading,
    episode,
    error,
    refreshEpisode
  } = useEpisodeLoader(id);
  
  if (isLoading) {
    return <Shell>
      <div className="page-container">
        <div className="text-center py-12">
          <div className="flex justify-center items-center h-12">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
          <p className="mt-2 text-muted-foreground">Loading episode...</p>
        </div>
      </div>
    </Shell>;
  }
  
  if (error || !episode) {
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
        <EpisodeDetail episode={episode} guests={guests} />
      </div>
    </Shell>;
};

export default EpisodeView;
