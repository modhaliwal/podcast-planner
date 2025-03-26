
import { useState, useMemo } from "react";
import { Episode, ContentVersion } from "@/lib/types";
import { useForm } from "react-hook-form";
import { toast } from "@/hooks/use-toast";
import { EpisodeStatus } from "@/lib/enums";
import { processVersions } from "@/lib/versionUtils";
import { EpisodeFormValues } from "@/components/episodes/EpisodeFormSchema";

interface UseEpisodeFormProps {
  episode: Episode;
  onSubmit: (updatedEpisode: Episode) => Promise<void>;
}

export function useEpisodeForm({ episode, onSubmit }: UseEpisodeFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Process versions to ensure they have proper structure
  const processedNotesVersions = useMemo(() => {
    return processVersions(episode.notesVersions || []);
  }, [episode.notesVersions]);
  
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
      notesVersions: processedNotesVersions,
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
      // Process versions to ensure they have version numbers and active flags
      const processedVersions = processVersions(data.notesVersions as ContentVersion[] || []);
      
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
        notesVersions: processedVersions,
        // Make sure all resources have required fields
        resources: data.resources ? data.resources.map(resource => ({
          label: resource.label || '',  // Ensure label is never undefined
          url: resource.url || '',      // Ensure url is never undefined
          description: resource.description
        })) : [],
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
      toast({
        title: "Success",
        description: "Episode saved successfully"
      });
    } catch (error) {
      console.error("Error saving episode:", error);
      toast({
        title: "Error",
        description: "Failed to save episode",
        variant: "destructive"
      });
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
