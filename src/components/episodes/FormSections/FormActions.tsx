
import { FormActions as UIFormActions } from "@/components/ui/form-actions";

interface FormActionsProps {
  episodeId: string;
  isSubmitting?: boolean;
  onCancel?: () => void;
}

export function FormActions({ 
  episodeId, 
  isSubmitting = false,
  onCancel
}: FormActionsProps) {
  const cancelHref = `/episodes/${episodeId}`;
  
  return (
    <UIFormActions 
      cancelHref={cancelHref}
      onCancel={onCancel}
      isSubmitting={isSubmitting}
      saveText="Save Changes"
    />
  );
}
