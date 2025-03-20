
import { Users } from 'lucide-react';
import { Guest } from '@/lib/types';
import { GuestCard } from './GuestCard';
import { GuestList } from './GuestList';
import { EmptyState } from '@/components/ui/empty-state';

type ViewMode = 'list' | 'card';

interface GuestContentProps {
  isLoading: boolean;
  filteredGuests: Guest[];
  viewMode: ViewMode;
  handleAddGuest: () => void;
}

export function GuestContent({ 
  isLoading, 
  filteredGuests,
  viewMode, 
  handleAddGuest 
}: GuestContentProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-10">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (filteredGuests.length === 0) {
    return (
      <EmptyState 
        icon={<Users className="h-8 w-8 text-muted-foreground" />}
        title="No guests found"
        description="Try adjusting your search terms or filters"
        action={{
          label: "Add Guest",
          onClick: handleAddGuest
        }}
      />
    );
  }

  return viewMode === 'list' ? (
    <GuestList guests={filteredGuests} />
  ) : (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredGuests.map(guest => (
        <GuestCard key={guest.id} guest={guest} />
      ))}
    </div>
  );
}
