
import { useForm } from "react-hook-form";
import { Episode } from "@/lib/types";
import { EpisodeStatus } from "@/lib/enums";
import { episodeFormSchema } from "@/components/episodes/EpisodeFormSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from 'react';
import { toast } from "@/hooks/toast/use-toast";
import { UpdateEpisodeDTO } from "@/repositories/episodes/EpisodeDTO";

interface UseEpisodeFormProps {
  episode: Episode;
  onSubmit: (data: UpdateEpisodeDTO) => Promise<{ success: boolean; error?: Error }>;
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

  const getInitialValues = (episode?: Episode | null): EpisodeFormValues => {
    if (!episode) {
      return {
        title: '',
        episodeNumber: 1,
        topic: '',
        guestIds: [],
        scheduled: new Date(),
        publishDate: undefined,
        status: EpisodeStatus.SCHEDULED,
        coverArt: '',
        introduction: '',
        notes: '',
        notesVersions: [],
        introductionVersions: [],
        resources: [],
        podcastUrls: {}
      };
    }
    
    // Convert string dates to Date objects
    const scheduled = episode.scheduled ? new Date(episode.scheduled) : new Date();
    const publishDate = episode.publishDate ? new Date(episode.publishDate) : undefined;
    
    // Convert string status to enum value
    const status = convertToEpisodeStatus(episode.status);
    
    return {
      title: episode.title || "",
      episodeNumber: episode.episodeNumber || 1,
      scheduled: scheduled,
      publishDate: publishDate,
      status: status,
      guestIds: episode.guestIds || [],
      topic: episode.topic || "",
      introduction: episode.introduction || "",
      notes: episode.notes || "",
      notesVersions: episode.notesVersions || [],
      introductionVersions: episode.introductionVersions || [],
      coverArt: episode.coverArt || "",
      resources: episode.resources || [],
      podcastUrls: episode.podcastUrls || {}
    };
  };

  // Helper function to ensure status is a valid enum value
  const convertToEpisodeStatus = (status: string | EpisodeStatus): EpisodeStatus => {
    switch (status) {
      case 'scheduled':
        return EpisodeStatus.SCHEDULED;
      case 'recorded':
        return EpisodeStatus.RECORDED;
      case 'published':
        return EpisodeStatus.PUBLISHED;
      default:
        // If it's already an enum value or unrecognized, default to SCHEDULED
        return status as EpisodeStatus || EpisodeStatus.SCHEDULED;
    }
  };

  const form = useForm<EpisodeFormValues>({
    resolver: zodResolver(episodeFormSchema),
    defaultValues: getInitialValues(episode)
  });

  const handleSubmit = async (data: EpisodeFormValues) => {
    setIsSubmitting(true);
    
    try {
      const formattedData: UpdateEpisodeDTO = {
        ...data,
        scheduled: data.scheduled ? data.scheduled.toISOString() : "",
        publishDate: data.publishDate ? data.publishDate.toISOString() : undefined
      };
      
      const result = await onSubmit(formattedData);
      
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
