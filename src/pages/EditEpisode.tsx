
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Shell } from '@/components/layout/Shell';
import { EpisodeForm } from '@/components/episodes/EpisodeForm';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useEpisodeData } from '@/hooks/episodes';
import { LoadingIndicator } from '@/components/ui/loading-indicator';
import { Episode } from '@/lib/types';

const EditEpisode = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { episodes, guests, refreshEpisodes } = useAuth();
  const { isLoading, handleSave } = useEpisodeData(id, episodes, refreshEpisodes);
  const [episode, setEpisode] = useState<Episode | null>(null);
  
  // Get episode data only once on component mount
  useEffect(() => {
    const currentEpisode = episodes.find(e => e.id === id) || null;
    setEpisode(currentEpisode);
  }, [id, episodes]);
  
  const handleBack = () => {
    navigate(`/episodes/${id}`);
  };
  
  // Show loading indicator while fetching episode data
  if (isLoading) {
    return (
      <Shell>
        <div className="page-container">
          <LoadingIndicator message="Loading episode information..." fullPage />
        </div>
      </Shell>
    );
  }
  
  // If episode not found after loading
  if (!episode) {
    return (
      <Shell>
        <div className="page-container">
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <h1 className="text-2xl font-semibold mb-2">Episode not found</h1>
            <p className="text-muted-foreground mb-6">The episode you're looking for doesn't exist or has been removed.</p>
            <Button asChild>
              <a href="/episodes">Back to Episodes</a>
            </Button>
          </div>
        </div>
      </Shell>
    );
  }
  
  const onSave = async (updatedEpisode: Episode) => {
    const result = await handleSave(updatedEpisode);
    if (result.success) {
      navigate(`/episodes/${id}`);
    }
  };
  
  return (
    <Shell>
      <div className="page-container">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="sm" onClick={handleBack} className="mr-2">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
        </div>
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div className="flex-1 min-w-0">
            <h1 className="section-title">Edit Episode</h1>
            <p className="section-subtitle">
              Update episode details and information
            </p>
          </div>
        </div>
        
        <EpisodeForm 
          episode={{
            ...episode,
            coverArt: episode.coverArt || undefined,
            resources: episode.resources || []
          }} 
          guests={guests}
          onSave={onSave}
          onCancel={() => navigate(`/episodes/${id}`)}
        />
      </div>
    </Shell>
  );
}

export default EditEpisode;
