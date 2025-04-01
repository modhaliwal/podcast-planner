
import { FormActions } from "@/components/ui/form-actions";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EditorActionsProps {
  onSave: () => void;
  onReset: () => void;
  onDelete: () => void;
  isSaving: boolean;
  isNewGenerator: boolean;
}

export function EditorActions({ 
  onSave, 
  onReset, 
  onDelete, 
  isSaving, 
  isNewGenerator 
}: EditorActionsProps) {
  return (
    <div className="flex justify-between space-x-2 py-3 px-4 border-t bg-background sticky bottom-0 z-10">
      <div>
        {!isNewGenerator && (
          <Button
            variant="destructive"
            onClick={onDelete}
            disabled={isSaving}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        )}
      </div>
      
      <FormActions
        onCancel={onReset}
        isSubmitting={isSaving}
        saveText="Save Changes"
      />
    </div>
  );
}
