
import { useState } from 'react';
import { GuestFilter } from '@/components/guests/GuestFilter';
import { GuestList } from '@/components/guests/GuestList';
import { GuestViewToggle } from '@/components/guests/GuestViewToggle';
import { GuestSearch } from '@/components/guests/GuestSearch';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { Guest } from '@/lib/types';
import { useGuestActions } from '@/hooks/guests/useGuestActions';

type GuestStatus = 'all' | 'potential' | 'contacted' | 'confirmed' | 'appeared';
type ViewMode = 'list' | 'grid' | 'calendar';

export function GuestContent() {
  const { guests, isDataLoading } = useAuth();
  const { handleDelete } = useGuestActions();
  const [statusFilter, setStatusFilter] = useState<GuestStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  
  // Filter guests based on status
  const filteredGuests = guests.filter(guest => {
    // First, apply status filter
    if (statusFilter && statusFilter !== 'all') {
      if (guest.status !== statusFilter) return false;
    }
    
    // Then, apply search filter if search term exists
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      const nameMatch = guest.name?.toLowerCase().includes(searchLower) || false;
      const titleMatch = guest.title?.toLowerCase().includes(searchLower) || false;
      const companyMatch = guest.company?.toLowerCase().includes(searchLower) || false;
      
      return nameMatch || titleMatch || companyMatch;
    }
    
    return true;
  });
  
  const handleDeleteGuest = async (guestId: string) => {
    try {
      const result = await handleDelete(guestId);
      if (result.success) {
        toast({
          title: "Success",
          description: "Guest deleted successfully"
        });
      } else {
        throw new Error("Failed to delete guest");
      }
    } catch (error) {
      console.error("Error deleting guest:", error);
      toast({
        title: "Error",
        description: "Failed to delete guest",
        variant: "destructive"
      });
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <GuestSearch 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery}
        />
        
        <div className="flex flex-col sm:flex-row gap-2">
          <GuestViewToggle 
            viewMode={viewMode as 'list' | 'card'}
            setViewMode={(mode: 'list' | 'card') => setViewMode(mode as ViewMode)}
          />
          
          <GuestFilter 
            statusFilter={statusFilter} 
            setStatusFilter={setStatusFilter}
          />
        </div>
      </div>

      {viewMode === 'list' && (
        <GuestList 
          guests={filteredGuests} 
          onDelete={handleDeleteGuest} 
        />
      )}
      
      {viewMode === 'grid' && (
        <div className="py-4 text-center text-muted-foreground">
          Grid view will be implemented in a future update.
        </div>
      )}
      
      {viewMode === 'calendar' && (
        <div className="py-4 text-center text-muted-foreground">
          Calendar view will be implemented in a future update.
        </div>
      )}
    </div>
  );
}
