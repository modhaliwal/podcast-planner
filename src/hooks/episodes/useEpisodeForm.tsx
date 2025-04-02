
import { useForm } from "react-hook-form";
import { Episode } from "@/lib/types";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { EpisodeFormSchema } from "@/components/episodes/EpisodeFormSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/hooks/use-toast";

interface UseEpisodeFormProps {
  episode?: Episode;
  onSubmit?: (data: Episode) => Promise<{ success: boolean; error?: Error }>;
}

export const useEpisodeForm = ({ episode, onSubmit }: UseEpisodeFormProps = {}) => {
  const [isDirty, setIsDirty] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  
  const form = useForm({
    resolver: zodResolver(EpisodeFormSchema),
    defaultValues: {
      title: episode?.title || "",
      episodeNumber: episode?.episodeNumber || 0,
      scheduled: episode?.scheduled ? new Date(episode.scheduled) : new Date(),
      publishDate: episode?.publishDate ? new Date(episode.publishDate) : undefined,
      status: episode?.status || "scheduled",
      introduction: episode?.introduction || "",
      notes: episode?.notes || "",
      notesVersions: episode?.notesVersions || [],
      topic: episode?.topic || "",
      guestIds: episode?.guestIds || [],
      coverArt: episode?.coverArt || "",
      podcastUrls: {
        spotify: episode?.podcastUrls?.spotify || "",
        applePodcasts: episode?.podcastUrls?.applePodcasts || "",
        amazonPodcasts: episode?.podcastUrls?.amazonPodcasts || "",
        youtube: episode?.podcastUrls?.youtube || "",
      },
      resources: episode?.resources || [],
    },
  });

  // Watch for changes to set the dirty state
  useEffect(() => {
    const subscription = form.watch(() => setIsDirty(form.formState.isDirty));
    return () => subscription.unsubscribe();
  }, [form]);

  // Handler for form submission
  const handleSubmit = async (formData: any) => {
    if (!onSubmit) return;
    
    setIsSubmitting(true);
    try {
      const result = await onSubmit(formData);
      
      if (!result.success && result.error) {
        toast({
          title: "Error",
          description: result.error.message,
          variant: "destructive"
        });
      }
      
      return result;
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An error occurred while saving",
        variant: "destructive"
      });
      return { success: false, error };
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handler for cancellation
  const handleCancel = () => {
    if (isDirty) {
      // Confirm before leaving if there are unsaved changes
      if (window.confirm("You have unsaved changes. Are you sure you want to leave?")) {
        navigate(-1);
      }
    } else {
      navigate(-1);
    }
  };

  return {
    form,
    isDirty,
    isSubmitting,
    handleCancel,
    onSubmit: handleSubmit
  };
};
