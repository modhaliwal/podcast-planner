
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { GuestList } from '@/components/guests/GuestList';
import { LoadingIndicator } from '@/components/ui/loading-indicator';
import { EmptyState } from '@/components/ui/empty-state';
import { Users } from 'lucide-react';
import { GuestControls } from '@/components/guests/GuestControls';
import { GuestCard } from './GuestCard';

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
  
  if (filteredGuests.length === 0) {
    return (
      <EmptyState 
        icon={<Users className="h-8 w-8 text-muted-foreground" />}
        title="No guests found"
        description={searchQuery ? "Try adjusting your search terms" : "Get started by adding your first guest"}
        action={{
          label: "Add Guest",
          onClick: () => window.location.href = "/guests/new"
        }}
      />
    );
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
        <GuestList guests={filteredGuests} />
      )}
      
      {viewMode === 'card' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredGuests.map(guest => (
            <GuestCard key={guest.id} guest={guest} />
          ))}
        </div>
      )}
    </div>
  );
}
