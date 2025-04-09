
import { useNavigate } from 'react-router-dom';
import { Shell } from '@/components/layout/Shell';
import { toast } from '@/hooks/use-toast';
import { GuestHeader } from '@/components/guests/GuestHeader';
import { GuestContent } from '@/components/guests/GuestContent';
import { PageLayout } from '@/components/layout/PageLayout';
import { ErrorBoundary } from '@/components/error';
import { useData } from '@/context/DataContext';

const Guests = () => {
  const { refreshData } = useData();
  const navigate = useNavigate();
  
  const handleAddGuest = () => {
    navigate('/guests/new');
  };
  
  return (
    <ErrorBoundary>
      <Shell>
        <PageLayout
          title="Guests"
          subtitle="Manage your guest profiles and information"
          actions={
            <GuestHeader 
              onAddGuest={handleAddGuest}
              onRefresh={refreshData}
            />
          }
        >
          <GuestContent />
        </PageLayout>
      </Shell>
    </ErrorBoundary>
  );
};

export default Guests;
