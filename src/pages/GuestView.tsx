
import { useParams } from 'react-router-dom';
import { Shell } from '@/components/layout/Shell';
import { GuestDetail } from '@/components/guests/GuestDetail';
import { GuestForm } from '@/components/guests/GuestForm';
import { useAuth } from '@/contexts/AuthContext';
import { useGuestData } from '@/hooks/useGuestData';
import { GuestViewHeader } from '@/components/guests/GuestViewHeader';
import { DeleteGuestDialog } from '@/components/guests/DeleteGuestDialog';
import { GuestViewLoading } from '@/components/guests/GuestViewLoading';
import { GuestNotFound } from '@/components/guests/GuestNotFound';

const GuestView = () => {
  const { id } = useParams<{ id: string }>();
  const { episodes } = useAuth();
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
