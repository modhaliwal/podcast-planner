
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { SaveIcon, X } from "lucide-react";

interface FormActionsProps {
  cancelHref?: string;
  onCancel?: () => void;
  isSubmitting?: boolean;
  saveText?: string;
}

export function FormActions({
  cancelHref,
  onCancel,
  isSubmitting = false,
  saveText = "Save Changes"
}: FormActionsProps) {
  return (
    <div className="flex justify-end gap-4 pt-4 border-t mt-8">
      {onCancel ? (
        <Button variant="outline" type="button" onClick={onCancel} disabled={isSubmitting}>
          <X className="h-4 w-4 mr-2" />
          Cancel
        </Button>
      ) : cancelHref ? (
        <Button variant="outline" type="button" asChild disabled={isSubmitting}>
          <Link to={cancelHref}>
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Link>
        </Button>
      ) : null}
      
      <Button 
        type="submit"
        disabled={isSubmitting}
      >
        <SaveIcon className="h-4 w-4 mr-2" />
        {isSubmitting ? "Saving..." : saveText}
      </Button>
    </div>
  );
}
