
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { SaveIcon, X } from "lucide-react";
import { ReactNode } from "react";

interface FormActionsProps {
  cancelHref?: string;
  onCancel?: () => void;
  isSubmitting?: boolean;
  saveText?: string;
  saveIcon?: React.ReactNode;
  cancelText?: string;
  additionalActions?: ReactNode;
}

export function FormActions({
  cancelHref,
  onCancel,
  isSubmitting = false,
  saveText = "Save Changes",
  saveIcon = <SaveIcon className="h-4 w-4 mr-2" />,
  cancelText = "Cancel",
  additionalActions
}: FormActionsProps) {
  return (
    <div className="flex justify-between items-center pt-6 border-t">
      {/* Left side - for delete button */}
      <div>
        {additionalActions}
      </div>
      
      {/* Right side - for cancel and save buttons */}
      <div className="flex space-x-4">
        {onCancel ? (
          <Button variant="outline" type="button" onClick={onCancel} disabled={isSubmitting}>
            <X className="h-4 w-4 mr-2" />
            {cancelText}
          </Button>
        ) : cancelHref ? (
          <Button variant="outline" type="button" asChild disabled={isSubmitting}>
            <Link to={cancelHref}>
              <X className="h-4 w-4 mr-2" />
              {cancelText}
            </Link>
          </Button>
        ) : null}
        
        <Button 
          type="submit"
          disabled={isSubmitting}
        >
          {saveIcon}
          {isSubmitting ? "Saving..." : saveText}
        </Button>
      </div>
    </div>
  );
}
