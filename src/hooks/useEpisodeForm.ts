import { useState, useCallback } from 'react';
import { Episode } from '@/lib/types';
import { EpisodeStatus } from '@/lib/enums';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { episodeFormSchema, EpisodeFormValues } from '@/components/episodes/EpisodeFormSchema';
import { v4 as uuidv4 } from 'uuid';

interface UseEpisodeFormProps {
  episode: Episode;
  onSubmit: (data: Episode) => Promise<void>;
}

export function useEpisodeForm({ episode, onSubmit: submitAction }: UseEpisodeFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Initialize form with default values from the episode
  const form = useForm<EpisodeFormValues>({
    resolver: zodResolver(episodeFormSchema),
    defaultValues: {
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
      recordingLinks: episode.recordingLinks,
      podcastUrls: episode.podcastUrls,
      resources: episode.resources
    },
    mode: 'onChange'
  });
  
  // Function to handle form submission
  const onSubmit = async (data: EpisodeFormValues) => {
    setIsSubmitting(true);
    
    try {
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
        publishDate: data.publishDate?.toISOString() || null,
        guestIds: data.guestIds,
        coverArt: data.coverArt,
        recordingLinks: data.recordingLinks,
        podcastUrls: data.podcastUrls,
        resources: data.resources,
        updatedAt: new Date().toISOString()
      };
      
      await submitAction(updatedEpisode);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return { form, isSubmitting, onSubmit };
}
