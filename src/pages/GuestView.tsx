
import { useParams, useLocation } from 'react-router-dom';
import { Shell } from '@/components/layout/Shell';
import { GuestDetail } from '@/components/guests/GuestDetail';
import { useAuth } from '@/contexts/AuthContext';
import { GuestViewHeader } from '@/components/guests/GuestViewHeader';
import { DeleteGuestDialog } from '@/components/guests/DeleteGuestDialog';
import { GuestViewLoading } from '@/components/guests/GuestViewLoading';
import { GuestNotFound } from '@/components/guests/GuestNotFound';
import { useEffect, useRef } from 'react';
import { useGuestData } from '@/hooks/guests';

const GuestView = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const { episodes, refreshGuests, refreshEpisodes } = useAuth();
  const hasRefreshedRef = useRef(false);
  
  const {
    isLoading,
    guest,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    handleDelete
  } = useGuestData(id);
  
  // Refresh guests data and episodes when the page is loaded, but only once
  useEffect(() => {
    if (!hasRefreshedRef.current) {
      console.log('Initial GuestView mount, refreshing guests and episodes data');
      
      // Small delay to avoid potential race conditions
      setTimeout(() => {
        refreshGuests();
        
        // Another small delay before loading episodes
        setTimeout(() => {
          refreshEpisodes();
          hasRefreshedRef.current = true;
        }, 100);
      }, 0);
    }
    
    // Reset the refresh flag when the path changes
    return () => {
      if (location.pathname !== `/guests/${id}`) {
        hasRefreshedRef.current = false;
      }
    };
  }, [id, location.pathname, refreshGuests, refreshEpisodes]);
  
  if (isLoading) {
    return <GuestViewLoading />;
  }
  
  if (!guest) {
    return <GuestNotFound />;
  }

  // Filter episodes to only include the ones this guest appears in
  const guestEpisodes = episodes.filter(episode => 
    episode.guestIds.includes(guest.id)
  );
  
  // Create a wrapper for handleDelete that returns void
  const handleDeleteWrapper = async () => {
    await handleDelete();
    // This function returns void
  };
  
  return (
    <Shell>
      <div className="page-container">
        <GuestViewHeader 
          guest={guest}
          onDeleteClick={() => setIsDeleteDialogOpen(true)}
        />
        
        <GuestDetail guest={guest} episodes={guestEpisodes} />

        <DeleteGuestDialog 
          guest={guest}
          isOpen={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          onConfirmDelete={handleDeleteWrapper}
        />
      </div>
    </Shell>
  );
};

export default GuestView;
