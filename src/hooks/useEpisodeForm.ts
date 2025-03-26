
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
  
  // Initialize form first, before adding watchers
  const form = useForm<EpisodeFormValues>({
    resolver: zodResolver(episodeFormSchema),
    defaultValues,
  });
  
  // For debugging - log the current form values
  useEffect(() => {
    const subscription = form.watch((value) => {
      console.log("Current form values:", value);
    });
    return () => subscription.unsubscribe();
  }, [form]);
  
  // Form submission handler
  const onSubmit = async (data: EpisodeFormValues) => {
    console.log("❗ Episode form submission initiated with data:", data);
    setIsSubmitting(true);
    
    try {
      console.log("Form values being submitted:", data);
      const processedCoverArt = await handleCoverArtUpload(data.coverArt);
      
      // Handle topic properly - ensuring empty strings become null
      let topicValue = data.topic;
      if (topicValue === undefined || topicValue === '' || (typeof topicValue === 'string' && topicValue.trim() === '')) {
        topicValue = null;
      }
      
      console.log("Processed topic value for database:", topicValue);
      
      // Log the data being sent to Supabase for debugging
      console.log("❗ Updating episode with data:", {
        title: data.title,
        episode_number: data.episodeNumber,
        topic: topicValue,
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
      });
      
      const { data: updateResult, error: updateError } = await supabase
        .from('episodes')
        .update({
          title: data.title,
          episode_number: data.episodeNumber,
          topic: topicValue,
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
      
      console.log("❗ Update response:", updateResult, updateError);
      
      if (updateError) {
        console.error("Error updating episode:", updateError);
        throw updateError;
      }
      
      // Use the extracted guest relationship management function
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
