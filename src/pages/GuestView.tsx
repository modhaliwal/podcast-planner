
import { useParams, useLocation } from 'react-router-dom';
import { Shell } from '@/components/layout/Shell';
import { GuestDetail } from '@/components/guests/GuestDetail';
import { GuestForm } from '@/components/guests/GuestForm';
import { useAuth } from '@/contexts/AuthContext';
import { useGuestData } from '@/hooks/useGuestData';
import { GuestViewHeader } from '@/components/guests/GuestViewHeader';
import { DeleteGuestDialog } from '@/components/guests/DeleteGuestDialog';
import { GuestViewLoading } from '@/components/guests/GuestViewLoading';
import { GuestNotFound } from '@/components/guests/GuestNotFound';
import { useEffect } from 'react';

const GuestView = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const { episodes, refreshGuests } = useAuth();
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
  
  // Force refresh only when visiting the page, not on every re-render
  useEffect(() => {
    const currentPath = location.pathname;
    console.log('Guest view mounted at path:', currentPath);
    
    // Only refresh once on component mount
    refreshGuests();
    
    // No dependency on refreshGuests to prevent re-running on every render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);
  
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
          <GuestDetail guest={guest} episodes={guestEpisodes} />
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
