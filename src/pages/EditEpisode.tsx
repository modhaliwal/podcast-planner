
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Shell } from '@/components/layout/Shell';
import { PageLayout } from '@/components/layout/PageLayout';
import { EpisodeForm } from '@/components/episodes/EpisodeForm';
import { Button } from '@/components/ui/button';
import { useEpisodeData } from '@/hooks/episodes';
import { useEpisodeDelete } from '@/hooks/episodes/useEpisodeDelete';
import { useAuthProxy } from '@/hooks/useAuthProxy';
import { useEffect, useMemo } from 'react';
import { toast } from '@/hooks/use-toast';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger 
} from '@/components/ui/alert-dialog';
import { Trash2 } from 'lucide-react';

const EditEpisode = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { guests: allGuests, refreshGuests } = useAuthProxy();
  
  const { 
    isLoading: isEpisodeLoading, 
    episode, 
    handleSave 
  } = useEpisodeData(id);
  
  const {
    isLoading: isDeleteLoading,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    handleDelete
  } = useEpisodeDelete(id);
  
  useEffect(() => {
    refreshGuests();
  }, [refreshGuests]);
  
  const isLoading = isEpisodeLoading || isDeleteLoading;
  
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
        <PageLayout
          title="Edit Episode"
          subtitle="Loading episode details..."
        >
          <div className="w-full h-64 flex items-center justify-center">
            <div className="text-muted-foreground">Loading...</div>
          </div>
        </PageLayout>
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
              <Link to="/episodes">Back to Episodes</Link>
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
  
  const DeleteButton = () => (
    <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" type="button" className="mr-auto">
          <Trash2 className="h-4 w-4 mr-2" />
          Delete Episode
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Episode</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this episode? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
  
  return (
    <Shell>
      <PageLayout 
        title="Edit Episode" 
        subtitle="Update episode details and information"
      >
        <EpisodeForm
          key={episodeKey}
          episode={episode}
          guests={allGuests || []}
          onSave={onSave}
          onCancel={() => navigate(`/episodes/${id}`)}
          deleteButton={<DeleteButton />}
        />
      </PageLayout>
    </Shell>
  );
};

export default EditEpisode;
