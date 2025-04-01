
import { FormActions } from "@/components/ui/form-actions";
import { Trash2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { memo } from "react";

interface EditorActionsProps {
  onSave: () => void;
  onCancel?: () => void; // Make this optional
  onReset?: () => void;  // Add this optional prop
  onDelete?: () => void;
  onPreview?: () => void;
  isSaving?: boolean;
  isNewGenerator?: boolean;
}

// Use memo to prevent unnecessary re-renders
export const EditorActions = memo(function EditorActions({ 
  onSave, 
  onReset, 
  onCancel,
  onDelete, 
  onPreview,
  isSaving = false, 
  isNewGenerator = false
}: EditorActionsProps) {
  // Use onReset or onCancel, whichever is provided
  const handleCancel = onCancel || onReset;
  
  return (
    <div className="flex justify-between space-x-2 py-3 px-4 border-t bg-background sticky bottom-0 z-10">
      <div className="flex gap-2">
        {!isNewGenerator && onDelete && (
          <Button
            variant="destructive"
            onClick={onDelete}
            disabled={isSaving}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        )}
        
        {onPreview && (
          <Button
            variant="secondary"
            onClick={onPreview}
            disabled={isSaving}
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Preview
          </Button>
        )}
      </div>
      
      <FormActions
        onCancel={handleCancel}
        isSubmitting={isSaving}
        saveText="Save Changes"
      />
    </div>
  );
});
