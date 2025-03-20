
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shell } from '@/components/layout/Shell';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { GuestHeader } from '@/components/guests/GuestHeader';
import { GuestControls } from '@/components/guests/GuestControls';
import { GuestContent } from '@/components/guests/GuestContent';

type GuestStatus = 'all' | 'potential' | 'contacted' | 'confirmed' | 'appeared';
type ViewMode = 'list' | 'card';

const Guests = () => {
  const { guests, isDataLoading, refreshGuests, user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<GuestStatus>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [initialLoadDone, setInitialLoadDone] = useState(false);

  useEffect(() => {
    console.log("Guests component mounted or updated");
    console.log("Number of guests:", guests.length);
    console.log("Loading state:", isDataLoading);
    
    // Only attempt to refresh guests once on initial load
    if (!initialLoadDone && !isDataLoading) {
      console.log("Initial load, triggering refresh once");
      refreshGuests();
      setInitialLoadDone(true);
    }
  }, [guests.length, isDataLoading, refreshGuests, initialLoadDone]);

  // Filter guests based on search query and status
  const filteredGuests = guests.filter(guest => {
    // Search filter
    const matchesSearch = 
      guest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guest.title.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Status filter
    const matchesStatus = 
      statusFilter === 'all' || 
      guest.status === statusFilter || 
      (statusFilter === 'potential' && !guest.status); // Treat undefined status as potential
    
    return matchesSearch && matchesStatus;
  });

  // Handle refresh button click
  const handleRefresh = () => {
    console.log("Manual refresh triggered");
    refreshGuests();
  };

  // Redirect to add guest page
  const handleAddGuest = () => {
    if (!user) {
      toast("Authentication Required", {
        description: "You need to be logged in to add guests"
      });
      return;
    }
    
    navigate('/guests/new');
  };
  
  return (
    <Shell>
      <div className="page-container">
        <GuestHeader 
          onRefresh={handleRefresh} 
          onAddGuest={handleAddGuest}
          isLoading={isDataLoading}
        />
        
        <GuestControls
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          viewMode={viewMode}
          setViewMode={setViewMode}
        />
        
        <GuestContent
          isLoading={isDataLoading}
          filteredGuests={filteredGuests}
          viewMode={viewMode}
          handleAddGuest={handleAddGuest}
        />
      </div>
    </Shell>
  );
};

export default Guests;
