
import { Filter, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
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

interface GuestControlsProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: GuestStatus;
  setStatusFilter: (status: GuestStatus) => void;
}

export function GuestControls({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter
}: GuestControlsProps) {
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
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
      {/* Inline GuestSearch component */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search guests..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      {/* Inline GuestFilter component */}
      <div className="flex items-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline" 
              className={cn(
                "w-full sm:w-auto min-w-[140px]",
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
      </div>
    </div>
  );
}
