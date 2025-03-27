
import { useNavigate, useParams } from 'react-router-dom';
import { Shell } from '@/components/layout/Shell';
import { PageLayout } from '@/components/layout/PageLayout';
import { GuestForm } from '@/components/guests/GuestForm';
import { GuestViewLoading } from '@/components/guests/GuestViewLoading';
import { GuestNotFound } from '@/components/guests/GuestNotFound';
import { useGuestData } from '@/hooks/guests';

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
  
  const onSave = async (updatedGuest: any) => {
    const result = await handleSave(updatedGuest);
    if (result.success) {
      navigate(`/guests/${id}`);
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
