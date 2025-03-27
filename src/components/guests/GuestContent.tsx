
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { GuestList } from '@/components/guests/GuestList';
import { LoadingIndicator } from '@/components/ui/loading-indicator';
import { Users } from 'lucide-react';
import { GuestControls } from '@/components/guests/GuestControls';
import { GuestCard } from './GuestCard';
import { EmptyState } from '@/components/ui/empty-state';

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

      {viewMode === 'list' && (
        guests.length > 0 ? (
          <GuestList guests={filteredGuests} />
        ) : (
          <div className="mt-4">
            <EmptyState 
              icon={<Users className="h-8 w-8 text-muted-foreground" />}
              title="No guests added yet"
              description="Get started by adding your first guest"
              action={{
                label: "Add Guest",
                onClick: () => window.location.href = "/guests/new"
              }}
            />
          </div>
        )
      )}
      
      {viewMode === 'card' && (
        guests.length > 0 ? (
          filteredGuests.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredGuests.map(guest => (
                <GuestCard key={guest.id} guest={guest} />
              ))}
            </div>
          ) : (
            <div className="p-8 text-center bg-muted/30 rounded-lg border border-dashed">
              <p className="text-muted-foreground">No guests match your current filters</p>
              <button 
                className="mt-2 text-primary hover:underline"
                onClick={() => {
                  setStatusFilter('all');
                  setSearchQuery('');
                }}
              >
                Clear filters
              </button>
            </div>
          )
        ) : (
          <div className="mt-4">
            <EmptyState 
              icon={<Users className="h-8 w-8 text-muted-foreground" />}
              title="No guests added yet"
              description="Get started by adding your first guest"
              action={{
                label: "Add Guest",
                onClick: () => window.location.href = "/guests/new"
              }}
            />
          </div>
        )
      )}
    </div>
  );
}
