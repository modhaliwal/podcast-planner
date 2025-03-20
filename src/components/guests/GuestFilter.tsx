
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
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-full md:w-auto">
          <Filter className="h-4 w-4 mr-2" />
          {statusFilter === 'all' ? 'All Guests' : 
            statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}
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
