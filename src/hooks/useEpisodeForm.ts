
import { useState, useCallback } from 'react';
import { Episode, ContentVersion } from '@/lib/types';
import { EpisodeStatus } from '@/lib/enums';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { episodeFormSchema, EpisodeFormValues } from '@/components/episodes/EpisodeFormSchema';
import { v4 as uuidv4 } from 'uuid';

interface UseEpisodeFormProps {
  episode: Episode | null;
  onSubmit: (data: Episode) => Promise<void>;
}

export function useEpisodeForm({ episode, onSubmit: submitAction }: UseEpisodeFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Default values that will be used if episode is null or undefined
  const defaultValues: EpisodeFormValues = {
    title: '',
    episodeNumber: 1,
    introduction: '',
    notes: '',
    notesVersions: [],
    status: EpisodeStatus.SCHEDULED, // Fixed enum casing
    scheduled: new Date(),
    publishDate: null,
    guestIds: [],
    topic: null,
    coverArt: undefined,
    recordingLinks: {
      audio: '',
      video: '',
      transcript: '',
      other: []
    },
    podcastUrls: {
      spotify: '',
      applePodcasts: '',
      amazonPodcasts: '',
      youtube: ''
    },
    resources: []
  };
  
  // Initialize form with values from the episode, or default values if episode is null/undefined
  const form = useForm<EpisodeFormValues>({
    resolver: zodResolver(episodeFormSchema),
    defaultValues: episode ? {
      title: episode.title,
      episodeNumber: episode.episodeNumber,
      topic: episode.topic || null,
      introduction: episode.introduction,
      notes: episode.notes,
      notesVersions: Array.isArray(episode.notesVersions) ? 
        episode.notesVersions.map(v => ({
          ...v, 
          versionNumber: v.versionNumber
        })) : 
        [],
      status: episode.status,
      scheduled: new Date(episode.scheduled),
      publishDate: episode.publishDate ? new Date(episode.publishDate) : null,
      guestIds: episode.guestIds,
      coverArt: episode.coverArt,
      recordingLinks: episode.recordingLinks || {
        audio: '',
        video: '',
        transcript: '',
        other: []
      },
      podcastUrls: episode.podcastUrls || {
        spotify: '',
        applePodcasts: '',
        amazonPodcasts: '',
        youtube: ''
      },
      resources: Array.isArray(episode.resources) ? 
        episode.resources.map(r => ({
          label: r.label,
          url: r.url,
          description: r.description || ''
        })) : 
        []
    } : defaultValues,
    mode: 'onChange'
  });
  
  // Function to handle form submission
  const onSubmit = async (data: EpisodeFormValues) => {
    if (!episode) {
      console.error("Cannot submit form: episode is null or undefined");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const updatedEpisode: Episode = {
        ...episode,
        title: data.title,
        episodeNumber: data.episodeNumber,
        topic: data.topic,
        introduction: data.introduction,
        notes: data.notes,
        notesVersions: data.notesVersions.map(v => ({
          id: v.id,
          content: v.content,
          timestamp: v.timestamp,
          source: v.source,
          active: v.active,
          versionNumber: v.versionNumber
        })),
        status: data.status,
        scheduled: data.scheduled.toISOString(),
        publishDate: data.publishDate?.toISOString() || null,
        guestIds: data.guestIds,
        coverArt: data.coverArt,
        recordingLinks: {
          audio: data.recordingLinks.audio,
          video: data.recordingLinks.video,
          transcript: data.recordingLinks.transcript,
          other: Array.isArray(data.recordingLinks.other) ? 
            data.recordingLinks.other.map(item => ({
              label: item.label || '',
              url: item.url || ''
            })) : []
        },
        podcastUrls: data.podcastUrls,
        resources: Array.isArray(data.resources) ?
          data.resources.map(r => ({
            label: r.label || '',
            url: r.url || '',
            description: r.description || ''
          })) : [],
        updatedAt: new Date().toISOString()
      };
      
      await submitAction(updatedEpisode);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return { form, isSubmitting, onSubmit };
}
