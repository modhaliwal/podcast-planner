
import { useNavigate, useParams } from 'react-router-dom';
import { Shell } from '@/components/layout/Shell';
import { GuestForm } from '@/components/guests/GuestForm';
import { useAuth } from '@/contexts/AuthContext';
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
      <div className="page-container">
        <div className="page-header mb-6">
          <h1 className="section-title">Edit Guest</h1>
          <p className="section-subtitle">Update {guest.name}'s information</p>
        </div>
        
        <GuestForm
          guest={guest}
          onSave={onSave}
          onCancel={() => navigate(`/guests/${id}`)}
        />
      </div>
    </Shell>
  );
};

export default EditGuest;
