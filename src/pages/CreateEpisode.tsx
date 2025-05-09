import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shell } from '@/components/layout/Shell';
import { PageLayout } from '@/components/layout/PageLayout';
import { ArrowRight } from 'lucide-react';
import { toast } from '@/hooks/toast/use-toast';
import { EpisodeFormCard } from '@/components/episodes/CreateEpisodeForm/EpisodeFormCard';
import { EpisodeFormData } from '@/components/episodes/CreateEpisodeForm/types';
import { getUpcomingFriday, getNextEpisodeDate } from '@/utils/dateUtils';
import { createEpisodes } from '@/services/episodeService';
import { FormActions } from '@/components/ui/form-actions';
import { useData } from '@/context/DataContext';

const CreateEpisode = () => {
  const navigate = useNavigate();
  const { refreshData } = useData();
  const [episodes, setEpisodes] = useState<EpisodeFormData[]>([
    { 
      episodeNumber: 1, 
      scheduled: getUpcomingFriday(),
      title: `Episode #1`,
      topic: '', // Initialize with empty string
      guestIds: [] // Initialize with empty array
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
        title: `Episode #${nextEpisodeNumber}`,
        topic: '', // Initialize with empty string
        guestIds: [] // Initialize with empty array
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
      const result = await createEpisodes(episodes);

      if (!result.success) {
        throw result.error;
      }

      await refreshData();

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

  const handleCancel = () => navigate('/episodes');

  return (
    <Shell>
      <PageLayout
        title="Create New Episodes"
        subtitle="Add one or more episodes to your schedule"
      >
        <form onSubmit={handleSubmit}>
          <EpisodeFormCard
            episodes={episodes}
            onAddEpisode={addEpisode}
            onRemoveEpisode={removeEpisode}
            onUpdateEpisode={updateEpisode}
            onUpdateTime={updateTime}
          />

          <FormActions 
            onCancel={handleCancel}
            isSubmitting={isSubmitting}
            saveText="Create Episodes"
            saveIcon={<ArrowRight className="h-4 w-4 mr-2" />}
          />
        </form>
      </PageLayout>
    </Shell>
  );
};

export default CreateEpisode;
