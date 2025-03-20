
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { SaveIcon, X } from "lucide-react";

interface FormActionsProps {
  episodeId: string;
  isSubmitting?: boolean;
}

export function FormActions({ episodeId, isSubmitting = false }: FormActionsProps) {
  return (
    <div className="flex justify-end gap-4 mt-8">
      <Button variant="outline" type="button" asChild>
        <Link to={`/episodes/${episodeId}`}>
          <X className="h-4 w-4 mr-2" />
          Cancel
        </Link>
      </Button>
      
      <Button type="submit" disabled={isSubmitting}>
        <SaveIcon className="h-4 w-4 mr-2" />
        {isSubmitting ? "Saving..." : "Save Changes"}
      </Button>
    </div>
  );
}
