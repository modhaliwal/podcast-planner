
import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Episode } from '@/lib/types';
import { toast } from 'sonner';
import { episodeFormSchema, EpisodeFormValues } from '@/components/episodes/EpisodeFormSchema';
import { supabase } from '@/integrations/supabase/client';
import { useCoverArtHandler } from './useCoverArtHandler';
import { useEpisodeGuests } from './useEpisodeGuests';

export function useEpisodeForm(episode: Episode, refreshEpisodes: () => Promise<void>) {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { handleCoverArtUpload } = useCoverArtHandler(episode.coverArt);
  const { updateEpisodeGuests } = useEpisodeGuests();
  
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
      const processedCoverArt = await handleCoverArtUpload(data.coverArt);
      
      const { error: updateError } = await supabase
        .from('episodes')
        .update({
          title: data.title,
          episode_number: data.episodeNumber,
          topic: data.topic,
          introduction: data.introduction,
          notes: data.notes,
          notes_versions: data.notesVersions,
          status: data.status,
          scheduled: data.scheduled.toISOString(),
          publish_date: data.publishDate ? data.publishDate.toISOString() : null,
          cover_art: processedCoverArt,
          recording_links: data.recordingLinks,
          podcast_urls: data.podcastUrls,
          resources: data.resources,
          updated_at: new Date().toISOString()
        })
        .eq('id', episode.id)
        .select();
      
      if (updateError) {
        throw updateError;
      }
      
      // Update guest relationships
      await updateEpisodeGuests(data.guestIds, episode.id);
      
      await refreshEpisodes();
      
      toast.success("Episode updated successfully");
      navigate(`/episodes/${episode.id}`);
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
