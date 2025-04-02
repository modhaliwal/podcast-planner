
import { useParams, Navigate } from 'react-router-dom';
import { useGuestData } from '@/hooks/guests/useGuestData';
import { useAuth } from '@/contexts/AuthContext';
import { Shell } from '@/components/layout/Shell';
import { GuestDetail } from '@/components/guests/GuestDetail';
import { DeleteGuestDialog } from '@/components/guests/DeleteGuestDialog';
import { GuestNotFound } from '@/components/guests/GuestNotFound';
import { useEffect } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';

export default function GuestView() {
  const { id } = useParams<{ id: string }>();
  const { episodes, refreshEpisodes } = useAuth();
  
  const { 
    isLoading, 
    guest, 
    isDeleteDialogOpen, 
    setIsDeleteDialogOpen, 
    handleDelete 
  } = useGuestData(id);

  // Refresh episodes data when the component mounts
  useEffect(() => {
    refreshEpisodes();
  }, [refreshEpisodes]);
  
  // Filter episodes to show only those that include this guest
  const guestEpisodes = episodes.filter(
    episode => episode.guestIds.includes(id || '')
  );

  if (isLoading) {
    return (
      <Shell>
        <PageLayout title="Loading..." noPadding>
          <div className="animate-pulse p-4">
            <div className="h-8 w-32 bg-muted rounded mb-2" />
            <div className="h-4 w-48 bg-muted rounded mb-8" />
            <div className="h-64 bg-muted rounded" />
          </div>
        </PageLayout>
      </Shell>
    );
  }

  if (!guest) {
    return (
      <Shell>
        <GuestNotFound />
      </Shell>
    );
  }

  return (
    <Shell>
      <PageLayout title={guest.name} noPadding>
        <GuestDetail 
          guest={guest} 
          episodes={guestEpisodes}
          onDelete={() => setIsDeleteDialogOpen(true)} 
        />
        
        <DeleteGuestDialog
          isOpen={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          onConfirmDelete={handleDelete}
          guestName={guest?.name}
        />
      </PageLayout>
    </Shell>
  );
}
