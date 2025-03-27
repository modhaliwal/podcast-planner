
import { Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type GuestStatus = 'all' | 'potential' | 'contacted' | 'confirmed' | 'appeared';

interface GuestFilterProps {
  statusFilter: GuestStatus;
  setStatusFilter: (status: GuestStatus) => void;
}

export function GuestFilter({ statusFilter, setStatusFilter }: GuestFilterProps) {
  // Format the status text with first letter capitalized
  const formatStatusText = (status: GuestStatus) => {
    if (status === 'all') return 'All Guests';
    if (!status) return 'All Guests'; // Fallback if status is undefined
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-full md:w-auto">
          <Filter className="h-4 w-4 mr-2" />
          {formatStatusText(statusFilter)}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setStatusFilter('all')}>
          All Guests
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setStatusFilter('potential')}>
          Potential
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setStatusFilter('contacted')}>
          Contacted
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setStatusFilter('confirmed')}>
          Confirmed
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setStatusFilter('appeared')}>
          Appeared
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
