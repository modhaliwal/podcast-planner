
import { useParams, useLocation } from 'react-router-dom';
import { Shell } from '@/components/layout/Shell';
import { PageLayout } from '@/components/layout/PageLayout';
import { GuestDetail } from '@/components/guests/GuestDetail';
import { useAuth } from '@/contexts/AuthContext';
import { DeleteGuestDialog } from '@/components/guests/DeleteGuestDialog';
import { GuestViewLoading } from '@/components/guests/GuestViewLoading';
import { GuestNotFound } from '@/components/guests/GuestNotFound';
import { useMemo } from 'react';
import { useGuestData } from '@/hooks/guests';
import { Button } from '@/components/ui/button';
import { Edit, Trash } from 'lucide-react';
import { Link } from 'react-router-dom';

const GuestView = () => {
  const { id } = useParams<{ id: string }>();
  const { episodes } = useAuth();
  
  const {
    isLoading,
    guest,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    handleDelete
  } = useGuestData(id);
  
  // Memoize filtered episodes to prevent unnecessary recalculations
  const guestEpisodes = useMemo(() => {
    if (!guest) return [];
    return episodes.filter(episode => 
      episode.guestIds.includes(guest.id)
    );
  }, [guest, episodes]);
  
  if (isLoading) {
    return <GuestViewLoading />;
  }
  
  if (!guest) {
    return <GuestNotFound />;
  }
  
  const handleDeleteWrapper = async () => {
    await handleDelete();
  };
  
  // Guest view header action buttons
  const actions = (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
      <div className="flex space-x-2">
        <Button 
          variant="outline" 
          size="sm"
          asChild
        >
          <Link to={`/guests/${guest.id}/edit`}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Link>
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="text-destructive hover:text-destructive"
          onClick={() => setIsDeleteDialogOpen(true)}
        >
          <Trash className="h-4 w-4 mr-2" />
          Delete
        </Button>
      </div>
    </div>
  );
  
  return (
    <Shell>
      <PageLayout
        title={guest.name}
        subtitle={guest.tagline || "Guest Profile"}
        actions={actions}
      >
        <GuestDetail guest={guest} episodes={guestEpisodes} />

        <DeleteGuestDialog 
          guest={guest}
          isOpen={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          onConfirmDelete={handleDeleteWrapper}
        />
      </PageLayout>
    </Shell>
  );
};

export default GuestView;
