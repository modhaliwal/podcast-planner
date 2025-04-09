
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Shell } from '@/components/layout/Shell';
import { GuestDetail } from '@/components/guests/GuestDetail';
import { Button } from '@/components/ui/button';
import { useGuestData } from '@/hooks/guests/useGuestData';

const GuestView = () => {
  const { id } = useParams<{ id: string }>();
  const { guest, isLoading } = useGuestData(id);
  const { episodes } = useAuth();
  
  const guestEpisodes = episodes.filter(episode => 
    guest?.id && episode.guestIds.includes(guest.id)
  );

  if (isLoading) {
    return <Shell>
      <div className="w-full max-w-[1400px] mx-auto px-4">
        <div className="text-center py-12">Loading guest...</div>
      </div>
    </Shell>;
  }
  
  if (!guest) {
    return <Shell>
      <div className="w-full max-w-[1400px] mx-auto px-4">
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
