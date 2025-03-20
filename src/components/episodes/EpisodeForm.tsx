
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Episode, Guest } from '@/lib/types';
import { Form } from '@/components/ui/form';
import { toast } from 'sonner';
import { episodeFormSchema, EpisodeFormValues } from './EpisodeFormSchema';
import { BasicInfoSection } from './FormSections/BasicInfoSection';
import { ScheduleSection } from './FormSections/ScheduleSection';
import { GuestsSection } from './FormSections/GuestsSection';
import { ContentSection } from './FormSections/ContentSection';
import { CoverArtSection } from './FormSections/CoverArtSection';
import { FormActions } from './FormSections/FormActions';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { isBlobUrl, deleteImage, uploadImage } from '@/lib/imageUpload';

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
      recordingLinks: episode.recordingLinks || {}
    },
  });
  
  // Store original cover art URL for potential cleanup
  useEffect(() => {
    setOriginalCoverArt(episode.coverArt);
  }, [episode.coverArt]);
  
  const onSubmit = async (data: EpisodeFormValues) => {
    setIsSubmitting(true);
    
    try {
      // Handle cover art URL
      let coverArt = data.coverArt;
      
      // If the cover art is a blob URL, upload it to storage
      if (coverArt && isBlobUrl(coverArt)) {
        console.log("Detected blob URL for cover art, uploading to storage");
        
        // Extract the blob data as a file
        try {
          const response = await fetch(coverArt);
          const blob = await response.blob();
          const fileName = 'cover-art.jpg';
          const file = new File([blob], fileName, { type: blob.type });
          
          toast.info("Uploading cover art...");
          const uploadedUrl = await uploadImage(file, 'podcast-planner', 'cover-art');
          
          if (uploadedUrl) {
            console.log("Cover art uploaded successfully:", uploadedUrl);
            
            // Delete the old cover art if it exists
            if (originalCoverArt && !isBlobUrl(originalCoverArt)) {
              console.log("Deleting old cover art:", originalCoverArt);
              await deleteImage(originalCoverArt);
            }
            
            // Set the new cover art URL
            coverArt = uploadedUrl;
            toast.success("Cover art uploaded successfully");
          } else {
            toast.error("Failed to upload cover art");
            coverArt = undefined;
          }
          
          // Revoke the blob URL to prevent memory leaks
          URL.revokeObjectURL(coverArt);
        } catch (error) {
          console.error("Error uploading cover art:", error);
          toast.error("Error uploading cover art");
          coverArt = undefined;
        }
      } else if (coverArt !== originalCoverArt && originalCoverArt && !coverArt) {
        // Cover art was removed and we need to delete the old one
        console.log("Deleting old cover art on removal:", originalCoverArt);
        await deleteImage(originalCoverArt);
      }
      
      // Step 1: Update the episode
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
          cover_art: coverArt,
          recording_links: data.recordingLinks,
          updated_at: new Date().toISOString()
        })
        .eq('id', episode.id);
      
      if (updateError) throw updateError;
      
      // Step 2: Clear existing episode_guests relationships
      const { error: deleteError } = await supabase
        .from('episode_guests')
        .delete()
        .eq('episode_id', episode.id);
      
      if (deleteError) throw deleteError;
      
      // Step 3: Create new episode_guests relationships
      const episodeGuestsToInsert = data.guestIds.map(guestId => ({
        episode_id: episode.id,
        guest_id: guestId
      }));
      
      const { error: insertError } = await supabase
        .from('episode_guests')
        .insert(episodeGuestsToInsert);
      
      if (insertError) throw insertError;
      
      // Refresh episodes data
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <BasicInfoSection form={form} />
            <CoverArtSection form={form} />
          </div>
          <div className="space-y-6">
            <ScheduleSection form={form} />
            <GuestsSection form={form} guests={guests} />
          </div>
          <div className="md:col-span-2">
            <ContentSection form={form} />
          </div>
        </div>
        
        <FormActions episodeId={episode.id} isSubmitting={isSubmitting} />
      </form>
    </Form>
  );
}
