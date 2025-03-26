
import { useNavigate, useParams } from 'react-router-dom';
import { Shell } from '@/components/layout/Shell';
import { EpisodeForm } from '@/components/episodes/EpisodeForm';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingIndicator } from '@/components/ui/loading-indicator';
import { Button } from '@/components/ui/button';
import { useEpisodeData } from '@/hooks/episodes';

const EditEpisode = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { guests } = useAuth();
  const { isLoading, episode, handleSave } = useEpisodeData(id);
  
  // If loading or episode not found, show appropriate UI
  if (isLoading) {
    return (
      <Shell>
        <div className="page-container">
          <LoadingIndicator message="Loading episode information..." fullPage />
        </div>
      </Shell>
    );
  }
  
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
  
  const onSave = async (updatedEpisode: any) => {
    const result = await handleSave(updatedEpisode);
    if (result.success) {
      navigate(`/episodes/${id}`);
    }
  };
  
  return (
    <Shell>
      <div className="page-container">
        <div className="page-header mb-6">
          <h1 className="section-title">Edit Episode</h1>
          <p className="section-subtitle">Update episode details and information</p>
        </div>
        
        <EpisodeForm
          episode={episode}
          guests={guests}
          onSave={onSave}
          onCancel={() => navigate(`/episodes/${id}`)}
        />
      </div>
    </Shell>
  );
};

export default EditEpisode;
