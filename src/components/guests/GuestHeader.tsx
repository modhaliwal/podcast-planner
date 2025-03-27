
import { Button } from '@/components/ui/button';
import { PlusIcon, RefreshCcw } from 'lucide-react';

interface GuestHeaderProps {
  onRefresh: () => void;
  onAddGuest: () => void;
  isLoading: boolean;
}

export function GuestHeader({ onRefresh, onAddGuest, isLoading }: GuestHeaderProps) {
  return (
    <div className="flex gap-2">
      <Button 
        variant="outline" 
        size="icon" 
        onClick={onRefresh} 
        disabled={isLoading}
      >
        <RefreshCcw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
      </Button>
      <Button size="default" onClick={onAddGuest}>
        <PlusIcon className="mr-2 h-4 w-4" />
        Add Guest
      </Button>
    </div>
  );
}
