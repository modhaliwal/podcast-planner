
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Shell } from '@/components/layout/Shell';
import { EpisodeDetail } from '@/components/episodes/EpisodeDetail';
import { Button } from '@/components/ui/button';
import { Edit, Trash } from 'lucide-react';
import { useEpisodeData } from '@/hooks/useEpisodeData';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useEffect } from 'react';

const EpisodeView = () => {
  const { id } = useParams<{ id: string }>();
  const { episodes, guests, refreshEpisodes } = useAuth();
  
  const { 
    isLoading, 
    isDeleteDialogOpen, 
    setIsDeleteDialogOpen, 
    handleDeleteEpisode 
  } = useEpisodeData(id, refreshEpisodes);
  
  // Refresh data on initial mount
  useEffect(() => {
    refreshEpisodes();
  }, [refreshEpisodes]);
  
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
  
  return (
    <Shell>
      <div className="page-container">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="section-title truncate">{episode.title}</h1>
              <span className="text-sm font-mono bg-muted px-2 py-1 rounded">#{episode.episodeNumber}</span>
            </div>
            <p className="section-subtitle">
              {new Date(episode.scheduled).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
          
          <div className="flex space-x-2 mt-4 md:mt-0">
            <Button variant="outline" size="sm" asChild>
              <Link to={`/episodes/${id}/edit`}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Link>
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="text-destructive hover:text-destructive"
              onClick={() => setIsDeleteDialogOpen(true)}
              disabled={isLoading}
            >
              <Trash className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>
        
        <EpisodeDetail episode={episode} guests={guests} />
        
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Episode</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this episode? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleDeleteEpisode}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </Shell>
  );
};

export default EpisodeView;
