
import { useState } from "react";
import { Episode, ContentVersion, Resource } from "@/lib/types";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { EpisodeStatus } from "@/lib/enums";
import { ensureVersionNumbers } from "./versions/utils/versionNumberUtils";
import { EpisodeFormValues } from "@/components/episodes/EpisodeFormSchema";

interface UseEpisodeFormProps {
  episode: Episode;
  onSubmit: (updatedEpisode: Episode) => Promise<void>;
}

export function useEpisodeForm({ episode, onSubmit }: UseEpisodeFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Initialize the form with episode data
  const form = useForm<EpisodeFormValues>({
    defaultValues: {
      title: episode.title || "",
      episodeNumber: episode.episodeNumber || 0,
      topic: episode.topic || null,
      scheduled: episode.scheduled || "",
      publishDate: episode.publishDate || null,
      status: episode.status || EpisodeStatus.SCHEDULED,
      guestIds: episode.guestIds || [],
      introduction: episode.introduction || "",
      notes: episode.notes || "",
      notesVersions: episode.notesVersions || [],
      resources: episode.resources || [],
      coverArt: episode.coverArt || "",
      podcastUrls: {
        spotify: episode.podcastUrls?.spotify || "",
        applePodcasts: episode.podcastUrls?.applePodcasts || "",
        amazonPodcasts: episode.podcastUrls?.amazonPodcasts || "",
        youtube: episode.podcastUrls?.youtube || "",
      },
    },
  });
  
  // Handle form submission
  const handleSubmit = async (data: EpisodeFormValues) => {
    setIsSubmitting(true);
    
    try {
      // Prepare the episode data
      const updatedEpisode: Episode = {
        ...episode,
        title: data.title,
        episodeNumber: Number(data.episodeNumber),
        topic: data.topic || undefined,
        // Convert dates to ISO strings for storage
        scheduled: data.scheduled instanceof Date ? data.scheduled.toISOString() : data.scheduled,
        publishDate: data.publishDate instanceof Date ? data.publishDate.toISOString() : data.publishDate,
        status: data.status,
        guestIds: data.guestIds,
        introduction: data.introduction || undefined,
        notes: data.notes || undefined,
        notesVersions: data.notesVersions && ensureVersionNumbers(data.notesVersions as ContentVersion[]),
        resources: data.resources || [],
        coverArt: data.coverArt || undefined,
        podcastUrls: {
          spotify: data.podcastUrls?.spotify || undefined,
          applePodcasts: data.podcastUrls?.applePodcasts || undefined,
          amazonPodcasts: data.podcastUrls?.amazonPodcasts || undefined,
          youtube: data.podcastUrls?.youtube || undefined,
        },
        updatedAt: new Date().toISOString(),
      };
      
      // Submit the form
      await onSubmit(updatedEpisode);
      toast.success("Episode saved successfully");
    } catch (error) {
      console.error("Error saving episode:", error);
      toast.error("Failed to save episode");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return {
    form,
    isSubmitting,
    onSubmit: handleSubmit,
  };
}
