
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Episode, EpisodeStatus } from "@/lib/types";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ensureVersionNumbers } from "@/hooks/versions";

// Define form values type for strong typing
export interface EpisodeFormValues {
  title: string;
  episodeNumber: number;
  topic?: string;
  scheduled: string;
  publishDate?: string;
  status: EpisodeStatus;
  guestIds: string[];
  introduction: string;
  notes: string;
  notesVersions?: {
    id: string;
    content: string;
    timestamp: string;
    source: 'manual' | 'ai' | 'import';
    active?: boolean;
    versionNumber?: number;
  }[];
  coverArt?: string;
  // Recording Links
  recordingLinks_audio?: string;
  recordingLinks_video?: string;
  recordingLinks_transcript?: string;
  // Podcast URLs
  podcastUrls_spotify?: string;
  podcastUrls_applePodcasts?: string;
  podcastUrls_amazonPodcasts?: string;
  podcastUrls_youtube?: string;
  // Resources
  resources?: { label: string; url: string; description?: string }[];
}

export interface UseEpisodeFormProps {
  episode: Episode;
  onSubmit: (episode: Episode) => Promise<void>;
}

export function useEpisodeForm({ episode, onSubmit }: UseEpisodeFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  
  // Initialize form with episode data
  const form = useForm<EpisodeFormValues>({
    defaultValues: {
      title: episode.title,
      episodeNumber: episode.episodeNumber,
      topic: episode.topic || "",
      scheduled: episode.scheduled,
      publishDate: episode.publishDate || "",
      status: episode.status,
      guestIds: episode.guestIds || [],
      introduction: episode.introduction || "",
      notes: episode.notes || "",
      notesVersions: episode.notesVersions || [],
      coverArt: episode.coverArt,
      // Recording Links
      recordingLinks_audio: episode.recordingLinks?.audio || "",
      recordingLinks_video: episode.recordingLinks?.video || "",
      recordingLinks_transcript: episode.recordingLinks?.transcript || "",
      // Podcast URLs
      podcastUrls_spotify: episode.podcastUrls?.spotify || "",
      podcastUrls_applePodcasts: episode.podcastUrls?.applePodcasts || "",
      podcastUrls_amazonPodcasts: episode.podcastUrls?.amazonPodcasts || "",
      podcastUrls_youtube: episode.podcastUrls?.youtube || "",
      // Resources
      resources: episode.resources || []
    }
  });

  // Handle form submission
  const handleSubmit = async (data: EpisodeFormValues) => {
    setIsSubmitting(true);
    
    try {
      // Organize recording links
      const recordingLinks = {
        audio: data.recordingLinks_audio || undefined,
        video: data.recordingLinks_video || undefined,
        transcript: data.recordingLinks_transcript || undefined
      };
      
      // Organize podcast URLs
      const podcastUrls = {
        spotify: data.podcastUrls_spotify || undefined,
        applePodcasts: data.podcastUrls_applePodcasts || undefined,
        amazonPodcasts: data.podcastUrls_amazonPodcasts || undefined,
        youtube: data.podcastUrls_youtube || undefined
      };
      
      // Process any version numbers
      const notesVersions = data.notesVersions ? 
        ensureVersionNumbers(data.notesVersions) : 
        undefined;
      
      // Create updated episode object
      const updatedEpisode: Episode = {
        ...episode,
        title: data.title,
        episodeNumber: Number(data.episodeNumber),
        topic: data.topic || undefined,
        scheduled: data.scheduled,
        publishDate: data.publishDate || undefined,
        status: data.status,
        guestIds: data.guestIds,
        introduction: data.introduction,
        notes: data.notes,
        notesVersions: notesVersions,
        coverArt: data.coverArt,
        recordingLinks: Object.values(recordingLinks).some(Boolean) ? recordingLinks : undefined,
        podcastUrls: Object.values(podcastUrls).some(Boolean) ? podcastUrls : undefined,
        resources: data.resources?.length ? data.resources : undefined,
        updatedAt: new Date().toISOString()
      };
      
      // Submit updated episode
      await onSubmit(updatedEpisode);
      
      // Show success message
      toast.success("Episode saved successfully");
      
      // Navigate to episode view
      if (!episode.id) {
        navigate('/episodes');
      }
    } catch (error: any) {
      console.error("Failed to save episode:", error);
      toast.error(`Failed to save episode: ${error.message || 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    isSubmitting,
    onSubmit: handleSubmit
  };
}
