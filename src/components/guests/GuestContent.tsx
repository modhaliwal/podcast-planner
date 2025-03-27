
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { GuestList } from '@/components/guests/GuestList';
import { LoadingIndicator } from '@/components/ui/loading-indicator';
import { Users } from 'lucide-react';
import { GuestControls } from '@/components/guests/GuestControls';
import { GuestCard } from './GuestCard';
import { EmptyState } from '@/components/ui/empty-state';
import { Button } from '@/components/ui/button';

type GuestStatus = 'all' | 'potential' | 'contacted' | 'confirmed' | 'appeared';
type ViewMode = 'list' | 'card';

export function GuestContent() {
  const { guests, isDataLoading } = useAuth();
  const [statusFilter, setStatusFilter] = useState<GuestStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  
  // Filter guests based on status and search query
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
  
  if (isDataLoading) {
    return <LoadingIndicator message="Loading guests..." />;
  }
  
  const clearFilters = () => {
    setStatusFilter('all');
    setSearchQuery('');
  };
  
  const hasGuests = guests.length > 0;
  const hasFilteredGuests = filteredGuests.length > 0;
  
  return (
    <div className="space-y-6">
      <GuestControls
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />

      {/* List View - New card-style layout */}
      {viewMode === 'list' && (
        <>
          {hasGuests ? (
            hasFilteredGuests ? (
              <GuestList guests={filteredGuests} />
            ) : (
              <div className="bg-muted/30 rounded-lg border border-dashed p-16 text-center">
                <div className="flex flex-col items-center justify-center">
                  <Users className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No guests match your filters</h3>
                  <p className="text-muted-foreground mb-6">Try adjusting your search terms or filters</p>
                  <Button onClick={clearFilters}>Clear Filters</Button>
                </div>
              </div>
            )
          ) : (
            <div className="bg-muted/30 rounded-lg border border-dashed p-16 text-center">
              <div className="flex flex-col items-center justify-center">
                <Users className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No guests found</h3>
                <p className="text-muted-foreground mb-6">Get started by creating your first guest</p>
                <Button onClick={() => window.location.href = "/guests/new"}>Add Guest</Button>
              </div>
            </div>
          )}
        </>
      )}
      
      {/* Card View */}
      {viewMode === 'card' && (
        <>
          {hasGuests ? (
            hasFilteredGuests ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredGuests.map(guest => (
                  <GuestCard key={guest.id} guest={guest} />
                ))}
              </div>
            ) : (
              <div className="bg-muted/30 rounded-lg border border-dashed p-16 text-center">
                <div className="flex flex-col items-center justify-center">
                  <Users className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No guests match your filters</h3>
                  <p className="text-muted-foreground mb-6">Try adjusting your search terms or filters</p>
                  <Button onClick={clearFilters}>Clear Filters</Button>
                </div>
              </div>
            )
          ) : (
            <div className="bg-muted/30 rounded-lg border border-dashed p-16 text-center">
              <div className="flex flex-col items-center justify-center">
                <Users className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No guests found</h3>
                <p className="text-muted-foreground mb-6">Get started by creating your first guest</p>
                <Button onClick={() => window.location.href = "/guests/new"}>Add Guest</Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
