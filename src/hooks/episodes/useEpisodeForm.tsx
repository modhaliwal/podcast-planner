
import { useForm } from "react-hook-form";
import { Episode } from "@/lib/types";
import { EpisodeStatus } from "@/lib/enums";
import { episodeFormSchema } from "@/components/episodes/EpisodeFormSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

interface UseEpisodeFormProps {
  episode: Episode;
  onSubmit: (data: Episode) => Promise<{ success: boolean; error?: Error }>;
}

export type EpisodeFormValues = {
  title: string;
  episodeNumber: number;
  scheduled: Date;
  publishDate?: Date;
  status: EpisodeStatus;
  topic?: string;
  introduction: string;
  notes: string;
  notesVersions?: any[];
  introductionVersions?: any[];
  guestIds: string[];
  coverArt?: string;
  resources: { label: string; url: string; description?: string }[];
  podcastUrls?: {
    spotify?: string;
    applePodcasts?: string;
    amazonPodcasts?: string;
    youtube?: string;
  };
}

export const useEpisodeForm = ({ episode, onSubmit }: UseEpisodeFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Use episodeFormSchema with zodResolver
  const form = useForm<EpisodeFormValues>({
    resolver: zodResolver(episodeFormSchema),
    defaultValues: {
      title: episode.title || "",
      episodeNumber: episode.episodeNumber || 1,
      scheduled: episode.scheduled ? new Date(episode.scheduled) : new Date(),
      publishDate: episode.publishDate ? new Date(episode.publishDate) : undefined,
      status: episode.status || EpisodeStatus.SCHEDULED,
      guestIds: episode.guestIds || [],
      topic: episode.topic || "",
      introduction: episode.introduction || "",
      notes: episode.notes || "",
      notesVersions: episode.notesVersions || [],
      introductionVersions: episode.introductionVersions || [],
      coverArt: episode.coverArt || "",
      resources: episode.resources || [],
      podcastUrls: episode.podcastUrls || {}
    }
  });

  const handleSubmit = async (data: EpisodeFormValues) => {
    setIsSubmitting(true);
    
    try {
      // Convert dates to ISO strings for API compatibility
      const formattedData = {
        ...episode,
        ...data,
        scheduled: data.scheduled ? data.scheduled.toISOString() : "",
        publishDate: data.publishDate ? data.publishDate.toISOString() : undefined
      };
      
      const result = await onSubmit(formattedData as Episode);
      
      if (!result.success) {
        console.error("Error submitting episode form:", result.error);
        toast({
          title: "Error saving episode",
          description: result.error?.message || "Something went wrong",
          variant: "destructive"
        });
      }
      
      return result;
    } catch (error: any) {
      console.error("Error in episode form submission:", error);
      toast({
        title: "Error saving episode",
        description: error.message || "An unexpected error occurred",
        variant: "destructive"
      });
      return { success: false, error };
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    isSubmitting,
    onSubmit: handleSubmit
  };
};
