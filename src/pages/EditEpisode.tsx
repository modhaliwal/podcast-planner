
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Shell } from '@/components/layout/Shell';
import { EpisodeForm } from '@/components/episodes/EpisodeForm';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Episode, Guest } from '@/lib/types';

const EditEpisode = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { episodes, guests, refreshEpisodes, refreshGuests } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [episodeData, setEpisodeData] = useState<Episode | null>(null);
  const [guestsData, setGuestsData] = useState<Guest[]>([]);
  
  // Load data once on component mount
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Load data in parallel
        await Promise.all([refreshGuests(), refreshEpisodes()]);
        
        // Set data from context after refresh
        if (id) {
          const episode = episodes.find(e => e.id === id);
          setEpisodeData(episode || null);
          setGuestsData(guests || []);
        }
      } catch (error) {
        console.error("Error loading episode data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
    // Only run on mount and when ID changes
  }, [id]);
  
  const handleBack = () => {
    navigate(`/episodes/${id}`);
  };
  
  // If still loading, show minimal UI to prevent flashing
  if (isLoading) {
    return (
      <Shell>
        <div className="page-container">
          <Button variant="ghost" size="sm" onClick={handleBack} className="mr-2">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="animate-pulse">Loading episode data...</div>
          </div>
        </div>
      </Shell>
    );
  }
  
  // If episode not found after loading
  if (!episodeData) {
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
            ...episodeData,
            coverArt: episodeData.coverArt || undefined,
            resources: episodeData.resources || []
          }} 
          guests={guestsData}
        />
      </div>
    </Shell>
  );
}

export default EditEpisode;
