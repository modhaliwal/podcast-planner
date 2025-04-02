
import { Form } from '@/components/ui/form';
import { Episode, Guest } from '@/lib/types';
import { ContentSection } from './FormSections/ContentSection';
import { PodcastUrlsSection } from './FormSections/PodcastUrlsSection';
import { ResourcesSection } from './FormSections/ResourcesSection';
import { useEpisodeForm } from '@/hooks/episodes/useEpisodeForm';
import { useMemo } from 'react';
import { PlanningSection } from './FormSections/PlanningSection';
import { CoverArtSection } from './FormSections/CoverArtSection';
import { FormActions } from '@/components/ui/form-actions';
import { useCoverArtHandler } from '@/hooks/useCoverArtHandler';

interface EpisodeFormProps {
  episode: Episode;
  guests: Guest[];
  onSave: (episode: Episode) => Promise<{success: boolean; error?: Error}>;
  onCancel?: () => void;
}

export function EpisodeForm({ episode, guests, onSave, onCancel }: EpisodeFormProps) {
  // Use our cover art upload handler
  const { handleCoverArtUpload } = useCoverArtHandler(episode.coverArt);
  
  // Use our standardized episode form hook
  const { form, isSubmitting, onSubmit } = useEpisodeForm({
    episode,
    onSubmit: async (updatedEpisode) => {
      try {
        // Process cover art before saving
        const processedCoverArt = await handleCoverArtUpload(updatedEpisode.coverArt);
        
        // Update the episode with the processed cover art
        const episodeToSave = {
          ...updatedEpisode,
          coverArt: processedCoverArt
        };
        
        // Call the parent component's onSave function
        return await onSave(episodeToSave);
      } catch (error: any) {
        return { 
          success: false, 
          error: new Error(error.message || "Failed to save episode") 
        };
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
          <PlanningSection form={form as any} guests={guests} />
          <CoverArtSection form={form as any} />
        </div>
        
        <ContentSection form={form as any} guests={guests} />
        
        <ResourcesSection form={form as any} />
        
        <PodcastUrlsSection form={form as any} />
        
        <FormActions 
          cancelHref={`/episodes/${episode?.id}`}
          onCancel={onCancel}
          isSubmitting={isSubmitting}
        />
      </form>
    </Form>
  );
}
