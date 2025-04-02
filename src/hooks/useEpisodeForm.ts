
import { useForm } from "react-hook-form";
import { Episode } from "@/lib/types";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { EpisodeFormSchema } from "@/components/episodes/EpisodeFormSchema";
import { zodResolver } from "@hookform/resolvers/zod";

export const useEpisodeForm = (initialData?: Episode) => {
  const [isDirty, setIsDirty] = useState(false);
  const navigate = useNavigate();
  
  const form = useForm({
    resolver: zodResolver(EpisodeFormSchema),
    defaultValues: {
      title: initialData?.title || "",
      episodeNumber: initialData?.episodeNumber || 0,
      scheduled: initialData?.scheduled ? new Date(initialData.scheduled) : new Date(),
      publishDate: initialData?.publishDate ? new Date(initialData.publishDate) : undefined,
      status: initialData?.status || "scheduled",
      introduction: initialData?.introduction || "",
      notes: initialData?.notes || "",
      notesVersions: initialData?.notesVersions || [],
      topic: initialData?.topic || "",
      guestIds: initialData?.guestIds || [],
      coverArt: initialData?.coverArt || "",
      podcastUrls: {
        spotify: initialData?.podcastUrls?.spotify || "",
        applePodcasts: initialData?.podcastUrls?.applePodcasts || "",
        amazonPodcasts: initialData?.podcastUrls?.amazonPodcasts || "",
        youtube: initialData?.podcastUrls?.youtube || "",
      },
      resources: initialData?.resources || [],
    },
  });

  // Watch for changes to set the dirty state
  useEffect(() => {
    const subscription = form.watch(() => setIsDirty(form.formState.isDirty));
    return () => subscription.unsubscribe();
  }, [form]);

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
    handleCancel,
  };
};
