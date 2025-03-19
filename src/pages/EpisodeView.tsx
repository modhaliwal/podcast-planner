
import { useParams } from 'react-router-dom';
import { guests, episodes } from '@/lib/data';
import { Shell } from '@/components/layout/Shell';
import { EpisodeDetail } from '@/components/episodes/EpisodeDetail';
import { Button } from '@/components/ui/button';
import { Edit, Trash } from 'lucide-react';

const EpisodeView = () => {
  const { id } = useParams<{ id: string }>();
  
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
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
              <Trash className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>
        
        <EpisodeDetail episode={episode} guests={guests} />
      </div>
    </Shell>
  );
};

export default EpisodeView;
