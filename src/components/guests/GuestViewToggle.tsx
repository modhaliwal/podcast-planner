
import { LayoutGrid, LayoutList } from 'lucide-react';
import { Toggle } from '@/components/ui/toggle';

type ViewMode = 'list' | 'card';

interface GuestViewToggleProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
}

export function GuestViewToggle({ viewMode, setViewMode }: GuestViewToggleProps) {
  return (
    <div className="bg-muted/50 rounded-md flex p-1">
      <Toggle
        pressed={viewMode === 'list'}
        onPressedChange={() => setViewMode('list')}
        size="sm"
        variant="outline"
        aria-label="List view"
        className="rounded-md data-[state=on]:bg-background data-[state=on]:text-foreground"
      >
        <LayoutList className="h-4 w-4" />
      </Toggle>
      <Toggle
        pressed={viewMode === 'card'}
        onPressedChange={() => setViewMode('card')}
        size="sm"
        variant="outline"
        aria-label="Card view"
        className="rounded-md data-[state=on]:bg-background data-[state=on]:text-foreground"
      >
        <LayoutGrid className="h-4 w-4" />
      </Toggle>
    </div>
  );
}
