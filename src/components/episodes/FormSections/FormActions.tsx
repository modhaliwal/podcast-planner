
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Save, X } from 'lucide-react';

interface FormActionsProps {
  episodeId: string;
}

export function FormActions({ episodeId }: FormActionsProps) {
  const navigate = useNavigate();
  
  return (
    <div className="flex justify-end gap-2">
      <Button
        type="button"
        variant="outline"
        onClick={() => navigate(`/episodes/${episodeId}`)}
        className="flex items-center"
      >
        <X className="mr-1 h-4 w-4" />
        Cancel
      </Button>
      <Button type="submit" className="flex items-center">
        <Save className="mr-1 h-4 w-4" />
        Save Changes
      </Button>
    </div>
  );
}
