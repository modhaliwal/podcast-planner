
import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Episode } from '@/lib/types';
import { toast } from 'sonner';
import { episodeFormSchema, EpisodeFormValues } from '@/components/episodes/EpisodeFormSchema';
import { supabase } from '@/integrations/supabase/client';
import { useCoverArtHandler } from './useCoverArtHandler';

export function useEpisodeForm(episode: Episode, refreshEpisodes: () => Promise<void>) {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { handleCoverArtUpload } = useCoverArtHandler(episode.coverArt);
  
  // Create form with default values
  const defaultValues = useMemo(() => ({
    title: episode.title,
    episodeNumber: episode.episodeNumber,
    topic: episode.topic || null,
    introduction: episode.introduction,
    notes: episode.notes,
    status: episode.status,
    scheduled: new Date(episode.scheduled),
    publishDate: episode.publishDate ? new Date(episode.publishDate) : null,
    guestIds: episode.guestIds,
    coverArt: episode.coverArt,
    recordingLinks: episode.recordingLinks || {},
    podcastUrls: episode.podcastUrls || {},
    resources: episode.resources || []
  }), [episode]);
  
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
  
  // Helper function to update episode-guest relationships
  const updateEpisodeGuests = async (guestIds: string[], episodeId: string) => {
    // Delete existing relationships
    const { error: deleteError } = await supabase
      .from('episode_guests')
      .delete()
      .eq('episode_id', episodeId);
    
    if (deleteError) throw deleteError;
    
    // If there are new guest IDs, insert them
    if (guestIds.length > 0) {
      const episodeGuestsToInsert = guestIds.map(guestId => ({
        episode_id: episodeId,
        guest_id: guestId
      }));
      
      const { error: insertError } = await supabase
        .from('episode_guests')
        .insert(episodeGuestsToInsert);
      
      if (insertError) throw insertError;
    }
  };
  
  // Form submission handler
  const onSubmit = async (data: EpisodeFormValues) => {
    setIsSubmitting(true);
    
    try {
      console.log("Form values being submitted:", data);
      const processedCoverArt = await handleCoverArtUpload(data.coverArt);
      
      // Ensure topic is properly handled (null if empty)
      const topicValue = data.topic === '' ? null : data.topic;
      
      // Log the data being sent to Supabase for debugging
      console.log("Updating episode with data:", {
        title: data.title,
        episode_number: data.episodeNumber,
        topic: topicValue,
        introduction: data.introduction,
        notes: data.notes,
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
      
      console.log("Update response:", updateResult, updateError);
      
      if (updateError) throw updateError;
      
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
