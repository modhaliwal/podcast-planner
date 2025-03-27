
import { useNavigate, useParams } from 'react-router-dom';
import { Shell } from '@/components/layout/Shell';
import { PageLayout } from '@/components/layout/PageLayout';
import { GuestForm } from '@/components/guests/GuestForm';
import { GuestViewLoading } from '@/components/guests/GuestViewLoading';
import { GuestNotFound } from '@/components/guests/GuestNotFound';
import { useGuestData } from '@/hooks/guests';
import { Guest } from '@/lib/types';
import { toast } from '@/hooks/toast';

const EditGuest = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isLoading, guest, handleSave } = useGuestData(id);
  
  // If loading or guest not found, show appropriate UI
  if (isLoading) {
    return <GuestViewLoading />;
  }
  
  if (!guest) {
    return <GuestNotFound />;
  }
  
  const onSave = async (updatedGuest: Guest) => {
    try {
      console.log("Saving guest:", updatedGuest);
      const result = await handleSave(updatedGuest);
      if (result.success) {
        toast({
          title: "Success",
          description: "Guest updated successfully"
        });
        navigate(`/guests/${id}`);
      } else {
        toast({
          title: "Error",
          description: "Failed to update guest information",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error saving guest:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    }
  };
  
  return (
    <Shell>
      <PageLayout
        title="Edit Guest"
        subtitle={`Update ${guest.name}'s information`}
      >
        <GuestForm
          guest={guest}
          onSave={onSave}
          onCancel={() => navigate(`/guests/${id}`)}
        />
      </PageLayout>
    </Shell>
  );
}

export default EditGuest;
