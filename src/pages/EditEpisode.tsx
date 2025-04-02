
import { useNavigate, useParams } from 'react-router-dom';
import { Shell } from '@/components/layout/Shell';
import { PageLayout } from '@/components/layout/PageLayout';
import { EpisodeForm } from '@/components/episodes/EpisodeForm';
import { Button } from '@/components/ui/button';
import { useEpisodeData } from '@/hooks/episodes/useEpisodeData';
import { useGuestsData } from '@/hooks/guests/useGuestsData';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useMemo } from 'react';
import { toast } from '@/hooks/use-toast';

const EditEpisode = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const { 
    isLoading: isEpisodeLoading, 
    episode, 
    handleSave 
  } = useEpisodeData(id);
  
  const { 
    guests,
    isLoadingGuests
  } = useGuestsData(user?.id);
  
  const isLoading = isEpisodeLoading || isLoadingGuests;
  
  useEffect(() => {
    if (!isEpisodeLoading && !episode) {
      toast({
        title: "Error",
        description: "Episode not found",
        variant: "destructive"
      });
      navigate('/episodes');
    }
  }, [isEpisodeLoading, episode, navigate]);
  
  const episodeKey = useMemo(() => {
    if (!episode) return '';
    const versionsCount = episode.notesVersions?.length || 0;
    return `episode-${episode.id}-versions-${versionsCount}`;
  }, [episode]);
  
  if (isLoading) {
    return (
      <Shell>
        <div className="w-full max-w-[1400px] mx-auto px-4"></div>
      </Shell>
    );
  }
  
  if (!episode) {
    return (
      <Shell>
        <div className="w-full max-w-[1400px] mx-auto px-4">
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
    if (result?.success) {
      navigate(`/episodes/${id}`);
    }
    return result;
  };
  
  return (
    <Shell>
      <PageLayout 
        title="Edit Episode" 
        subtitle="Update episode details and information"
      >
        <EpisodeForm
          key={episodeKey}
          episode={episode}
          guests={guests || []}
          onSave={onSave}
          onCancel={() => navigate(`/episodes/${id}`)}
        />
      </PageLayout>
    </Shell>
  );
};

export default EditEpisode;
