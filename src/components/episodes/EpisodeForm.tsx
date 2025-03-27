
import { Form } from '@/components/ui/form';
import { Episode, Guest } from '@/lib/types';
import { ContentSection } from './FormSections/ContentSection';
import { useAuth } from '@/contexts/AuthContext';
import { PodcastUrlsSection } from './FormSections/PodcastUrlsSection';
import { ResourcesSection } from './FormSections/ResourcesSection';
import { useEpisodeForm } from '@/hooks/useEpisodeForm';
import { useMemo } from 'react';
import { PlanningSection } from './FormSections/PlanningSection';
import { CoverArtSection } from './FormSections/CoverArtSection';
import { FormActions } from '@/components/ui/form-actions';

interface EpisodeFormProps {
  episode: Episode;
  guests: Guest[];
  onSave: (episode: Episode) => Promise<void>;
  onCancel?: () => void;
}

export function EpisodeForm({ episode, guests, onSave, onCancel }: EpisodeFormProps) {
  const { refreshEpisodes } = useAuth();
  
  // Use our custom hook for form handling
  const { form, isSubmitting, onSubmit } = useEpisodeForm({
    episode, 
    onSubmit: async (updatedEpisode) => {
      if (onSave) {
        await onSave(updatedEpisode);
      } else {
        await refreshEpisodes();
      }
    }
  });
  
  // Generate stable key for the form based on episode ID and version count
  const formKey = useMemo(() => {
    return `episode-form-${episode.id}-${episode.notesVersions?.length || 0}`;
  }, [episode.id, episode.notesVersions?.length]);
  
  return (
    <Form {...form}>
      <form key={formKey} onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
        {/* Grid layout for the top sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <PlanningSection form={form} guests={guests} />
          <CoverArtSection form={form} />
        </div>
        
        <ContentSection form={form} guests={guests} />
        
        <ResourcesSection form={form} />
        
        <PodcastUrlsSection form={form} />
        
        <FormActions 
          cancelHref={`/episodes/${episode?.id}`}
          onCancel={onCancel}
          isSubmitting={isSubmitting}
        />
      </form>
    </Form>
  );
}
