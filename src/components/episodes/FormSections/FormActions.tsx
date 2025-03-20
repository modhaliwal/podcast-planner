
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

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
      >
        Cancel
      </Button>
      <Button type="submit">
        Save Changes
      </Button>
    </div>
  );
}
