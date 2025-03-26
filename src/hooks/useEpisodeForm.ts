
import { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Episode } from '@/lib/types';
import { toast } from 'sonner';
import { episodeFormSchema, EpisodeFormValues } from '@/components/episodes/EpisodeFormSchema';
import { useCoverArtHandler } from './useCoverArtHandler';

export function useEpisodeForm(
  episode: Episode, 
  onSuccess: (updatedEpisode: Episode) => Promise<void>
) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { handleCoverArtUpload } = useCoverArtHandler(episode.coverArt);
  
  // Create form with default values
  const defaultValues = useMemo(() => ({
    title: episode.title,
    episodeNumber: episode.episodeNumber,
    topic: episode.topic || null,
    introduction: episode.introduction,
    notes: episode.notes,
    notesVersions: episode.notesVersions || [],
    status: episode.status,
    scheduled: new Date(episode.scheduled),
    publishDate: episode.publishDate ? new Date(episode.publishDate) : null,
    guestIds: episode.guestIds,
    coverArt: episode.coverArt,
    recordingLinks: episode.recordingLinks || {},
    podcastUrls: episode.podcastUrls || {},
    resources: episode.resources || []
  }), [episode]);
  
  // Initialize form
  const form = useForm<EpisodeFormValues>({
    resolver: zodResolver(episodeFormSchema),
    defaultValues,
    mode: 'onSubmit',
  });
  
  // Form submission handler
  const onSubmit = async (data: EpisodeFormValues) => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      // Create updated episode object
      const updatedEpisode: Episode = {
        ...episode,
        title: data.title,
        episodeNumber: data.episodeNumber,
        topic: data.topic,
        introduction: data.introduction,
        notes: data.notes,
        notesVersions: data.notesVersions,
        status: data.status,
        scheduled: data.scheduled.toISOString(),
        publishDate: data.publishDate ? data.publishDate.toISOString() : null,
        coverArt: data.coverArt,
        recordingLinks: data.recordingLinks,
        podcastUrls: data.podcastUrls,
        resources: data.resources,
        guestIds: data.guestIds,
        updatedAt: new Date().toISOString()
      };
      
      // Call the success handler with the updated episode
      await onSuccess(updatedEpisode);
      
    } catch (error: any) {
      toast.error(`Error updating episode: ${error.message}`);
      console.error("Error updating episode:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return {
    form,
    isSubmitting,
    onSubmit
  };
}
