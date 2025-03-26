
import { useState } from "react";
import { Episode, ContentVersion } from "@/lib/types";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { ensureVersionNumbers } from "./versions/utils/versionNumberUtils";

// Define the form values type
export interface EpisodeFormValues {
  title: string;
  episodeNumber: number;
  topic: string;
  scheduled: Date | string;
  publishDate: Date | string;
  status: string;
  guestIds: string[];
  introduction: string;
  notes: string;
  notesVersions: ContentVersion[];
  resources: {
    title: string;
    url: string;
  }[];
  coverArt: string;
  podcastUrls: {
    apple?: string;
    spotify?: string;
    google?: string;
    youtube?: string;
    other?: string;
  };
}

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
      topic: episode.topic || "",
      scheduled: episode.scheduled || "",
      publishDate: episode.publishDate || "",
      status: episode.status || "planning",
      guestIds: episode.guestIds || [],
      introduction: episode.introduction || "",
      notes: episode.notes || "",
      notesVersions: episode.notesVersions || [],
      resources: episode.resources || [],
      coverArt: episode.coverArt || "",
      podcastUrls: {
        apple: episode.podcastUrls?.apple || "",
        spotify: episode.podcastUrls?.spotify || "",
        google: episode.podcastUrls?.google || "",
        youtube: episode.podcastUrls?.youtube || "",
        other: episode.podcastUrls?.other || "",
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
        scheduled: data.scheduled || undefined,
        publishDate: data.publishDate || undefined,
        status: data.status,
        guestIds: data.guestIds,
        introduction: data.introduction || undefined,
        notes: data.notes || undefined,
        notesVersions: data.notesVersions && ensureVersionNumbers(data.notesVersions as ContentVersion[]),
        resources: data.resources || [],
        coverArt: data.coverArt || undefined,
        podcastUrls: {
          apple: data.podcastUrls.apple || undefined,
          spotify: data.podcastUrls.spotify || undefined,
          google: data.podcastUrls.google || undefined,
          youtube: data.podcastUrls.youtube || undefined,
          other: data.podcastUrls.other || undefined,
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
