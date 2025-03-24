
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Shell } from '@/components/layout/Shell';
import { EpisodeForm } from '@/components/episodes/EpisodeForm';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { useEffect } from 'react';

const EditEpisode = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { episodes, guests, refreshEpisodes, refreshGuests } = useAuth();
  
  // Ensure we have the latest data
  useEffect(() => {
    const loadData = async () => {
      await Promise.all([refreshGuests(), refreshEpisodes()]);
    };
    
    loadData();
  }, [refreshGuests, refreshEpisodes]);
  
  // Find the episode with the matching ID
  const episode = episodes.find(e => e.id === id);
  
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
  
  const handleBack = () => {
    navigate(`/episodes/${id}`);
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
        />
      </div>
    </Shell>
  );
}

export default EditEpisode;
