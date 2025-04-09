
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shell } from '@/components/layout/Shell';
import { toast } from '@/hooks/use-toast';
import { GuestHeader } from '@/components/guests/GuestHeader';
import { GuestContent } from '@/components/guests/GuestContent';
import { PageLayout } from '@/components/layout/PageLayout';
import { ErrorBoundary } from '@/components/error';
import { useAuthProxy } from '@/hooks/useAuthProxy';

const Guests = () => {
  const { user } = useAuthProxy();
  const navigate = useNavigate();
  
  const handleAddGuest = () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You need to be logged in to add guests"
      });
      return;
    }
    
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
              onRefresh={() => {}}
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
