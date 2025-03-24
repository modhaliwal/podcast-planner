
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
    // Only refresh guests data once on component mount
    if (!initialLoadDone) {
      console.log("Initial Guests component mount, refreshing data");
      refreshGuests();
      setInitialLoadDone(true);
    }
  }, [refreshGuests, initialLoadDone]);

  const filteredGuests = guests.filter(guest => {
    const matchesSearch = 
      guest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guest.title.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = 
      statusFilter === 'all' || 
      guest.status === statusFilter || 
      (statusFilter === 'potential' && !guest.status);
    
    return matchesSearch && matchesStatus;
  });

  const handleRefresh = () => {
    console.log("Manual refresh triggered");
    refreshGuests();
  };

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
