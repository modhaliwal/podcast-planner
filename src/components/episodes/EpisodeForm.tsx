
import { Form } from '@/components/ui/form';
import { Episode, Guest } from '@/lib/types';
import { ScheduleSection } from './FormSections/ScheduleSection';
import { GuestsSection } from './FormSections/GuestsSection';
import { ContentSection } from './FormSections/ContentSection';
import { FormActions } from './FormSections/FormActions';
import { useAuth } from '@/contexts/AuthContext';
import { CombinedBasicInfoSection } from './FormSections/CombinedBasicInfoSection';
import { PodcastUrlsSection } from './FormSections/PodcastUrlsSection';
import { ResourcesSection } from './FormSections/ResourcesSection';
import { useEpisodeForm } from '@/hooks/useEpisodeForm';

interface EpisodeFormProps {
  episode: Episode;
  guests: Guest[];
}

export function EpisodeForm({ episode, guests }: EpisodeFormProps) {
  const { refreshEpisodes } = useAuth();
  
  // Use our custom hook for form handling
  const { form, isSubmitting, onSubmit } = useEpisodeForm(episode, refreshEpisodes);
  
  console.log("Rendering EpisodeForm with submit handler:", !!onSubmit);
  console.log("Form element properties:", { 
    handleSubmit: !!form.handleSubmit,
    formState: form.formState
  });
  
  const handleFormSubmit = form.handleSubmit((data) => {
    console.log("Form submission handler executed with data:", data);
    return onSubmit(data);
  });
  
  return (
    <Form {...form}>
      <form onSubmit={handleFormSubmit} className="space-y-8">
        <div className="grid grid-cols-1 gap-6">
          <CombinedBasicInfoSection form={form} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ScheduleSection form={form} />
            <GuestsSection form={form} guests={guests} />
          </div>
          
          <ContentSection form={form} guests={guests} />
          
          <ResourcesSection form={form} />
          
          <PodcastUrlsSection form={form} />
        </div>
        
        <FormActions 
          episodeId={episode.id} 
          isSubmitting={isSubmitting}
        />
      </form>
    </Form>
  );
}
