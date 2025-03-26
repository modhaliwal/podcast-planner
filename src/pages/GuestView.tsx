
import { useParams, useLocation } from 'react-router-dom';
import { Shell } from '@/components/layout/Shell';
import { GuestDetail } from '@/components/guests/GuestDetail';
import { GuestForm } from '@/components/guests/GuestForm';
import { useAuth } from '@/contexts/AuthContext';
import { GuestViewHeader } from '@/components/guests/GuestViewHeader';
import { DeleteGuestDialog } from '@/components/guests/DeleteGuestDialog';
import { GuestViewLoading } from '@/components/guests/GuestViewLoading';
import { GuestNotFound } from '@/components/guests/GuestNotFound';
import { useEffect, useRef } from 'react';
// Fix: Import from the correct location - updated from guest to guests folder
import { useGuestData } from '@/hooks/guests';

const GuestView = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const { episodes, refreshGuests, refreshEpisodes } = useAuth();
  const hasRefreshedRef = useRef(false);
  
  const {
    isLoading,
    guest,
    isEditing,
    isDeleteDialogOpen,
    setIsEditing,
    setIsDeleteDialogOpen,
    handleSave,
    handleDelete
  } = useGuestData(id);
  
  // Refresh guests data and episodes when the page is loaded
  useEffect(() => {
    if (!hasRefreshedRef.current) {
      console.log('Initial GuestView mount, refreshing guests and episodes data');
      refreshGuests();
      refreshEpisodes(); // Make sure we have the latest episodes data
      hasRefreshedRef.current = true;
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
  
  return (
    <Shell>
      <div className="page-container">
        <GuestViewHeader 
          guest={guest}
          isEditing={isEditing}
          onToggleEdit={() => setIsEditing(!isEditing)}
          onDeleteClick={() => setIsDeleteDialogOpen(true)}
        />
        
        {isEditing ? (
          <GuestForm 
            guest={guest} 
            onSave={handleSave} 
            onCancel={() => setIsEditing(false)}
          />
        ) : (
          <GuestDetail guest={guest} episodes={episodes} />
        )}

        <DeleteGuestDialog 
          guest={guest}
          isOpen={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          onConfirmDelete={handleDelete}
        />
      </div>
    </Shell>
  );
};

export default GuestView;
