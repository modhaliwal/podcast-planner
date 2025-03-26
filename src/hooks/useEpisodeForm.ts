
import { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Episode, ContentVersion } from '@/lib/types';
import { toast } from 'sonner';
import { episodeFormSchema, EpisodeFormValues } from '@/components/episodes/EpisodeFormSchema';
import { useCoverArtHandler } from './useCoverArtHandler';
import { v4 as uuidv4 } from 'uuid';

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
    recordingLinks: episode.recordingLinks || {
      audio: undefined,
      video: undefined,
      transcript: undefined,
      other: []
    },
    podcastUrls: episode.podcastUrls || {
      spotify: undefined,
      applePodcasts: undefined,
      amazonPodcasts: undefined,
      youtube: undefined
    },
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
      // Ensure all required fields are present for notesVersions
      const notesVersions: ContentVersion[] = (data.notesVersions || []).map(version => ({
        id: version.id || uuidv4(),
        content: version.content || '',
        timestamp: version.timestamp || new Date().toISOString(),
        source: version.source || 'manual',
        active: version.active || false // Preserve active flag
      }));
      
      // Ensure at least one version is active
      if (notesVersions.length > 0 && !notesVersions.some(v => v.active)) {
        // If no version is active, mark the most recent one as active
        const sortedVersions = [...notesVersions].sort(
          (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
        
        if (sortedVersions.length > 0) {
          notesVersions.forEach(v => {
            v.active = v.id === sortedVersions[0].id;
          });
        }
      }
      
      // Ensure required fields for recording links
      const recordingLinks = {
        audio: data.recordingLinks?.audio,
        video: data.recordingLinks?.video,
        transcript: data.recordingLinks?.transcript,
        other: (data.recordingLinks?.other || []).map(item => ({
          label: item.label || '',
          url: item.url || ''
        }))
      };
      
      // Ensure required fields for resources
      const resources = (data.resources || []).map(resource => ({
        label: resource.label || '',
        url: resource.url || '',
        description: resource.description
      }));
      
      // Create updated episode object
      const updatedEpisode: Episode = {
        ...episode,
        title: data.title,
        episodeNumber: data.episodeNumber,
        topic: data.topic,
        introduction: data.introduction || '',
        notes: data.notes || '',
        notesVersions,
        status: data.status,
        scheduled: data.scheduled.toISOString(),
        publishDate: data.publishDate ? data.publishDate.toISOString() : null,
        coverArt: data.coverArt,
        recordingLinks,
        podcastUrls: data.podcastUrls,
        resources,
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
