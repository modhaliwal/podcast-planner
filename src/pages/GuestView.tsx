
import { useParams, Link } from 'react-router-dom';
import { useData } from '@/context/DataContext';
import { Shell } from '@/components/layout/Shell';
import { GuestDetail } from '@/components/guests/GuestDetail';
import { Button } from '@/components/ui/button';
import { useGuestData } from '@/hooks/guests/useGuestData';
import { useMemo } from 'react';

const GuestView = () => {
  const { id } = useParams<{ id: string }>();
  const { episodes } = useData();
  const { guest, isLoading } = useGuestData(id);
  
  // Find episodes related to this guest
  const guestEpisodes = useMemo(() => {
    if (!guest) return [];
    return episodes.filter(episode => 
      episode.guestIds.includes(guest.id)
    );
  }, [guest, episodes]);

  if (isLoading) {
    return <Shell>
      <div className="page-container">
        <div className="text-center py-12">
          <div className="flex justify-center items-center h-12">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
          <p className="mt-2 text-muted-foreground">Loading guest...</p>
        </div>
      </div>
    </Shell>;
  }
  
  if (!guest) {
    return <Shell>
      <div className="page-container">
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <h1 className="text-2xl font-semibold mb-2">Guest not found</h1>
          <p className="text-muted-foreground mb-6">The guest you're looking for doesn't exist or has been removed.</p>
          <Button asChild>
            <Link to="/guests">Back to Guests</Link>
          </Button>
        </div>
      </div>
    </Shell>;
  }
  
  return (
    <Shell>
      <GuestDetail
        guest={guest}
        episodes={guestEpisodes}
      />
    </Shell>
  );
};

export default GuestView;
