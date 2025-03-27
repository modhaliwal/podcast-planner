
import { List, Grid } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

interface GuestViewToggleProps {
  viewMode: 'list' | 'card';
  setViewMode: (mode: 'list' | 'card') => void;
}

export function GuestViewToggle({ viewMode, setViewMode }: GuestViewToggleProps) {
  return (
    <ToggleGroup type="single" value={viewMode} onValueChange={(value) => value && setViewMode(value as 'list' | 'card')}>
      <ToggleGroupItem value="list" aria-label="List view">
        <List className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="card" aria-label="Card view">
        <Grid className="h-4 w-4" />
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
