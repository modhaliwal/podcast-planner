
import { useParams } from 'react-router-dom';
import { guests, episodes } from '@/lib/data';
import { Shell } from '@/components/layout/Shell';
import { GuestDetail } from '@/components/guests/GuestDetail';
import { Button } from '@/components/ui/button';
import { Edit, Trash } from 'lucide-react';

const GuestView = () => {
  const { id } = useParams<{ id: string }>();
  
  // Find the guest with the matching ID
  const guest = guests.find(g => g.id === id);
  
  if (!guest) {
    return (
      <Shell>
        <div className="page-container">
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <h1 className="text-2xl font-semibold mb-2">Guest not found</h1>
            <p className="text-muted-foreground mb-6">The guest you're looking for doesn't exist or has been removed.</p>
            <Button asChild>
              <a href="/guests">Back to Guests</a>
            </Button>
          </div>
        </div>
      </Shell>
    );
  }
  
  return (
    <Shell>
      <div className="page-container">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="section-title">{guest.name}</h1>
            <p className="section-subtitle">{guest.title}</p>
          </div>
          
          <div className="flex space-x-2 mt-4 md:mt-0">
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
              <Trash className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>
        
        <GuestDetail guest={guest} episodes={episodes} />
      </div>
    </Shell>
  );
};

export default GuestView;
