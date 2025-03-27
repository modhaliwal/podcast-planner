import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shell } from '@/components/layout/Shell';
import { PageLayout } from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { toast } from '@/hooks/toast';
import { useAuth } from '@/contexts/AuthContext';
import { EpisodeFormCard } from '@/components/episodes/CreateEpisodeForm/EpisodeFormCard';
import { EpisodeFormData } from '@/components/episodes/CreateEpisodeForm/types';
import { getUpcomingFriday, getNextEpisodeDate } from '@/utils/dateUtils';
import { createEpisodes } from '@/services/episodeService';

const CreateEpisode = () => {
  const navigate = useNavigate();
  const { user, refreshEpisodes } = useAuth();
  const [episodes, setEpisodes] = useState<EpisodeFormData[]>([
    { 
      episodeNumber: 1, 
      scheduled: getUpcomingFriday(),
      title: `Episode #1` 
    }
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addEpisode = () => {
    const lastEpisode = episodes[episodes.length - 1];
    const nextEpisodeNumber = lastEpisode.episodeNumber + 1;
    const nextDate = getNextEpisodeDate(episodes.length);
    
    setEpisodes([
      ...episodes,
      { 
        episodeNumber: nextEpisodeNumber,
        scheduled: nextDate,
        title: `Episode #${nextEpisodeNumber}`
      }
    ]);
  };

  const removeEpisode = (index: number) => {
    if (episodes.length === 1) {
      return; // Don't remove the last episode
    }
    setEpisodes(episodes.filter((_, i) => i !== index));
  };

  const updateEpisode = (index: number, field: keyof EpisodeFormData, value: any) => {
    const updatedEpisodes = [...episodes];
    updatedEpisodes[index] = {
      ...updatedEpisodes[index],
      [field]: value
    };
    setEpisodes(updatedEpisodes);
  };

  const updateTime = (index: number, timeString: string) => {
    const [hours, minutes] = timeString.split(':').map(Number);
    const updatedDate = new Date(episodes[index].scheduled);
    updatedDate.setHours(hours);
    updatedDate.setMinutes(minutes);
    updatedDate.setSeconds(0);
    
    updateEpisode(index, 'scheduled', updatedDate);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to create episodes",
        variant: "destructive"
      });
      return;
    }
    
    const hasErrors = episodes.some(ep => !ep.episodeNumber || !ep.scheduled);
    if (hasErrors) {
      toast({
        title: "Validation Error",
        description: "All episodes must have a number and recording date",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await createEpisodes(episodes, user);
      
      if (!result.success) {
        throw result.error;
      }

      await refreshEpisodes();
      
      toast({
        title: "Success!",
        description: `Created ${episodes.length} new episodes`
      });
      
      navigate('/episodes');
    } catch (error: any) {
      toast({
        title: "Error Creating Episodes",
        description: error.message || "An unexpected error occurred",
        variant: "destructive"
      });
      console.error("Error creating episodes:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const actions = (
    <Button 
      type="button" 
      variant="outline" 
      onClick={() => navigate('/episodes')}
    >
      Cancel
    </Button>
  );

  return (
    <Shell>
      <PageLayout
        title="Create New Episodes"
        subtitle="Add one or more episodes to your schedule"
        actions={actions}
      >
        <form onSubmit={handleSubmit}>
          <EpisodeFormCard
            episodes={episodes}
            onAddEpisode={addEpisode}
            onRemoveEpisode={removeEpisode}
            onUpdateEpisode={updateEpisode}
            onUpdateTime={updateTime}
          />

          <div className="form-actions">
            <Button 
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating...' : 'Create Episodes'}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </form>
      </PageLayout>
    </Shell>
  );
};

export default CreateEpisode;
