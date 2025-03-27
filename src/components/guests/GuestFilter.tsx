
import { Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { guestStatusColors } from '@/lib/statusColors';

type GuestStatus = 'all' | 'potential' | 'contacted' | 'confirmed' | 'appeared';

interface GuestFilterProps {
  statusFilter: GuestStatus;
  setStatusFilter: (status: GuestStatus) => void;
}

export function GuestFilter({ statusFilter, setStatusFilter }: GuestFilterProps) {
  // Format the status text with first letter capitalized
  const formatStatusText = (status: GuestStatus) => {
    if (!status || status === 'all') return 'All Guests';
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  // Get the color for the current status
  const getStatusColor = () => {
    if (statusFilter === 'all') return '';
    
    const statusKey = statusFilter as keyof typeof guestStatusColors;
    const colorSet = guestStatusColors[statusKey];
    
    if (!colorSet) return '';
    
    return cn(
      colorSet.bg, 
      colorSet.text,
      colorSet.border,
      colorSet.darkBg,
      colorSet.darkText,
      colorSet.darkBorder
    );
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className={cn(
            "w-full md:w-auto",
            statusFilter !== 'all' && getStatusColor()
          )}
        >
          <Filter className="h-4 w-4 mr-2" />
          {formatStatusText(statusFilter || 'all')}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem 
          onClick={() => setStatusFilter('all')}
          className="flex items-center"
        >
          All Guests
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setStatusFilter('potential')}
          className={cn(
            "flex items-center",
            guestStatusColors.potential.bg,
            guestStatusColors.potential.text
          )}
        >
          Potential
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setStatusFilter('contacted')}
          className={cn(
            "flex items-center",
            guestStatusColors.contacted.bg,
            guestStatusColors.contacted.text
          )}
        >
          Contacted
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setStatusFilter('confirmed')}
          className={cn(
            "flex items-center",
            guestStatusColors.confirmed.bg,
            guestStatusColors.confirmed.text
          )}
        >
          Confirmed
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setStatusFilter('appeared')}
          className={cn(
            "flex items-center",
            guestStatusColors.appeared.bg,
            guestStatusColors.appeared.text
          )}
        >
          Appeared
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
