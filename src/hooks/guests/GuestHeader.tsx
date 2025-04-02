
import { Button } from '@/components/ui/button';
import { PlusIcon, RefreshCcw } from 'lucide-react';

interface GuestHeaderProps {
  onRefresh: () => void;
  onAddGuest: () => void;
}

export function GuestHeader({ onRefresh, onAddGuest }: GuestHeaderProps) {
  return (
    <div className="flex gap-2">
      <Button 
        variant="outline" 
        size="icon" 
        onClick={onRefresh} 
      >
        <RefreshCcw className="h-4 w-4" />
      </Button>
      <Button size="default" onClick={onAddGuest}>
        <PlusIcon className="mr-2 h-4 w-4" />
        Add Guest
      </Button>
    </div>
  );
}
