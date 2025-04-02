
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shell } from '@/components/layout/Shell';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { GuestHeader } from '@/components/guests/GuestHeader';
import { GuestContent } from '@/components/guests/GuestContent';
import { PageLayout } from '@/components/layout/PageLayout';
import { ErrorBoundary } from '@/components/error';

const Guests = () => {
  const { user, refreshGuests } = useAuth();
  const navigate = useNavigate();
  const hasInitializedRef = useRef(false);
  
  // Load guests data once on component mount
  useEffect(() => {
    const loadData = async () => {
      if (!hasInitializedRef.current && user?.id) {
        console.log("Initial Guests page mount, refreshing guest data");
        await refreshGuests(true);
        hasInitializedRef.current = true;
      }
    };
    
    loadData();
  }, [user, refreshGuests]);

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
  
  const handleRefresh = async () => {
    await refreshGuests(true);
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
              onRefresh={handleRefresh}
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
