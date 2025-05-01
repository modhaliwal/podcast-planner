import { useNavigate, useParams, Link } from 'react-router-dom';
import { Shell } from '@/components/layout/Shell';
import { PageLayout } from '@/components/layout/PageLayout';
import { EpisodeForm } from '@/components/episodes/EpisodeForm';
import { Button } from '@/components/ui/button';
import { useEpisodeLoader } from '@/hooks/episodes/useEpisodeLoader';
import { useEffect, useMemo, useState } from 'react';
import { toast } from '@/hooks/toast/use-toast';
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
import { useData } from '@/context/DataContext';
import { repositories } from '@/repositories';

const EditEpisode = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { guests, refreshData } = useData();
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const { 
    isLoading: isEpisodeLoading, 
    episode, 
    error,
    refreshEpisode
  } = useEpisodeLoader(id);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

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

  const handleDelete = async () => {
    if (!id) return { success: false };

    setIsDeleteLoading(true);
    try {
      // Delete the episode using repository - fixed method name
      await repositories.episodes.delete(id);

      toast({
        title: "Success",
        description: "Episode deleted successfully"
      });

      // Refresh global data
      await refreshData();

      // Navigate back to episodes list
      navigate('/episodes');

      return { success: true };
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Error deleting episode: ${error.message}`,
        variant: "destructive"
      });
      console.error("Error deleting episode:", error);
      return { success: false, error };
    } finally {
      setIsDeleteLoading(false);
      setIsDeleteDialogOpen(false);
    }
  };

  const handleSave = async (updatedEpisode: any) => {
    try {
      console.log("Saving episode with cover art:", updatedEpisode.coverArt);

      // Make sure coverArt is preserved in the update call
      const result = await repositories.episodes.update(id!, {
        ...updatedEpisode,
        coverArt: updatedEpisode.coverArt, // Explicitly include coverArt
      });

      // Log successful save
      console.log('Episode updated successfully with cover art:', updatedEpisode.coverArt);

      await refreshData();
      await refreshEpisode();

      toast({
        title: "Success",
        description: "Episode updated successfully"
      });

      return { success: true, data: result };
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Error updating episode: ${error.message}`,
        variant: "destructive"
      });
      console.error("Error updating episode:", error);
      return { success: false, error };
    }
  };

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
          guests={guests || []}
          onSave={onSave}
          onCancel={() => navigate(`/episodes/${id}`)}
          deleteButton={<DeleteButton />}
        />
      </PageLayout>
    </Shell>
  );
};

export default EditEpisode;
