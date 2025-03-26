
import { UseFormReturn } from "react-hook-form";
import { EpisodeFormValues } from "@/components/episodes/EpisodeFormSchema";
import { useContentVersions } from "./useContentVersions";

interface UseNotesVersionManagerProps {
  form: UseFormReturn<EpisodeFormValues>;
  fieldName: string;
  versionsFieldName: string;
}

export function useNotesVersionManager({
  form,
  fieldName,
  versionsFieldName
}: UseNotesVersionManagerProps) {
  const {
    activeVersionId,
    versions,
    handleContentChange,
    selectVersion,
    clearAllVersions,
    addNewVersion,
    versionSelectorProps
  } = useContentVersions({
    form,
    fieldName: fieldName as keyof EpisodeFormValues,
    versionsFieldName: versionsFieldName as keyof EpisodeFormValues
  });

  // Handle editor blur - this triggers version creation if content changed
  const handleEditorBlur = () => {
    handleContentChange();
  };

  return {
    activeVersionId,
    versions,
    handleEditorBlur,
    selectVersion,
    handleClearAllVersions: clearAllVersions,
    addNewVersion
  };
}
