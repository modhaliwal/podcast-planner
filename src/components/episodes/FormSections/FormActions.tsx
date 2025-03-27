
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { SaveIcon, X } from "lucide-react";

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
  return (
    <div className="form-actions">
      {onCancel ? (
        <Button variant="outline" type="button" onClick={onCancel} disabled={isSubmitting}>
          <X className="h-4 w-4 mr-2" />
          Cancel
        </Button>
      ) : (
        <Button variant="outline" type="button" asChild disabled={isSubmitting}>
          <Link to={`/episodes/${episodeId}`}>
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Link>
        </Button>
      )}
      
      <Button 
        type="submit"
        disabled={isSubmitting}
      >
        <SaveIcon className="h-4 w-4 mr-2" />
        {isSubmitting ? "Saving..." : "Save Changes"}
      </Button>
    </div>
  );
}
