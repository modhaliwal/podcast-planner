
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Episode, Guest } from '@/lib/types';
import { Form } from '@/components/ui/form';
import { toast } from 'sonner';
import { episodeFormSchema, EpisodeFormValues } from './EpisodeFormSchema';
import { ScheduleSection } from './FormSections/ScheduleSection';
import { GuestsSection } from './FormSections/GuestsSection';
import { ContentSection } from './FormSections/ContentSection';
import { FormActions } from './FormSections/FormActions';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { isBlobUrl, deleteImage, uploadImage } from '@/lib/imageUpload';
import { CombinedBasicInfoSection } from './FormSections/CombinedBasicInfoSection';
import { PodcastUrlsSection } from './FormSections/PodcastUrlsSection';
import { ResourcesSection } from './FormSections/ResourcesSection';

interface EpisodeFormProps {
  episode: Episode;
  guests: Guest[];
}

export function EpisodeForm({ episode, guests }: EpisodeFormProps) {
  const navigate = useNavigate();
  const { refreshEpisodes } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [originalCoverArt, setOriginalCoverArt] = useState<string | undefined>(episode.coverArt);
  
  const form = useForm<EpisodeFormValues>({
    resolver: zodResolver(episodeFormSchema),
    defaultValues: {
      title: episode.title,
      episodeNumber: episode.episodeNumber,
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
    },
  });
  
  useEffect(() => {
    setOriginalCoverArt(episode.coverArt);
  }, [episode.coverArt]);
  
  const handleCoverArtUpload = useCallback(async (coverArt: string | undefined): Promise<string | null | undefined> => {
    // If no change to cover art, return original value
    if (coverArt === originalCoverArt) {
      return coverArt;
    }
    
    // Case 1: New image uploaded (blob URL)
    if (coverArt && isBlobUrl(coverArt)) {
      console.log("Detected blob URL for cover art, uploading to storage");
      
      try {
        const response = await fetch(coverArt);
        const blob = await response.blob();
        const fileName = 'cover-art.jpg';
        const file = new File([blob], fileName, { type: blob.type });
        
        toast.info("Uploading cover art...");
        const uploadedUrl = await uploadImage(file, 'podcast-planner', 'cover-art');
        
        if (uploadedUrl) {
          console.log("Cover art uploaded successfully:", uploadedUrl);
          
          if (originalCoverArt && !isBlobUrl(originalCoverArt)) {
            console.log("Deleting old cover art:", originalCoverArt);
            await deleteImage(originalCoverArt);
          }
          
          toast.success("Cover art uploaded successfully");
          return uploadedUrl;
        } else {
          toast.error("Failed to upload cover art");
          return undefined;
        }
      } catch (error) {
        console.error("Error uploading cover art:", error);
        toast.error("Error uploading cover art");
        return undefined;
      } finally {
        if (coverArt) {
          URL.revokeObjectURL(coverArt);
        }
      }
    }
    // Case 2: Image removed (undefined) but there was an original image
    else if (coverArt === undefined && originalCoverArt) {
      console.log("Deleting old cover art on removal:", originalCoverArt);
      await deleteImage(originalCoverArt);
      toast.success("Cover art removed successfully");
      return null; // Use null to explicitly set NULL in database
    }
    
    // Case 3: No change or other cases
    return coverArt;
  }, [originalCoverArt]);
  
  const onSubmit = async (data: EpisodeFormValues) => {
    setIsSubmitting(true);
    
    try {
      // Handle cover art upload/removal
      const processedCoverArt = await handleCoverArtUpload(data.coverArt);
      
      // Update episode in database
      const { error: updateError } = await supabase
        .from('episodes')
        .update({
          title: data.title,
          episode_number: data.episodeNumber,
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
        .eq('id', episode.id);
      
      if (updateError) throw updateError;
      
      // Update episode-guest relationships
      const { error: deleteError } = await supabase
        .from('episode_guests')
        .delete()
        .eq('episode_id', episode.id);
      
      if (deleteError) throw deleteError;
      
      // Insert new episode-guest relationships
      if (data.guestIds.length > 0) {
        const episodeGuestsToInsert = data.guestIds.map(guestId => ({
          episode_id: episode.id,
          guest_id: guestId
        }));
        
        const { error: insertError } = await supabase
          .from('episode_guests')
          .insert(episodeGuestsToInsert);
        
        if (insertError) throw insertError;
      }
      
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
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 gap-6">
          <CombinedBasicInfoSection form={form} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ScheduleSection form={form} />
            <GuestsSection form={form} guests={guests} />
          </div>
          
          <ContentSection form={form} />
          
          <ResourcesSection form={form} />
          
          <PodcastUrlsSection form={form} />
        </div>
        
        <FormActions episodeId={episode.id} isSubmitting={isSubmitting} />
      </form>
    </Form>
  );
}
