
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { guests } from '@/lib/data';
import { Shell } from '@/components/layout/Shell';
import { GuestCard } from '@/components/guests/GuestCard';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { PlusIcon, SearchIcon, Users } from 'lucide-react';
import { Input } from '@/components/ui/input';

const Guests = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter guests based on search query
  const filteredGuests = guests.filter(guest => 
    guest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    guest.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <Shell>
      <div className="page-container">
        <div className="page-header">
          <div>
            <h1 className="section-title">Podcast Guests</h1>
            <p className="section-subtitle">Manage your guest profiles and information</p>
          </div>
          
          <Button size="default" asChild>
            <Link to="#">
              <PlusIcon className="mr-2 h-4 w-4" />
              Add Guest
            </Link>
          </Button>
        </div>
        
        <div className="relative mb-6">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search guests..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        {filteredGuests.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGuests.map(guest => (
              <GuestCard key={guest.id} guest={guest} />
            ))}
          </div>
        ) : (
          <EmptyState 
            icon={<Users className="h-8 w-8 text-muted-foreground" />}
            title="No guests found"
            description={searchQuery ? "Try adjusting your search terms" : "Get started by adding your first guest"}
            action={{
              label: "Add Guest",
              onClick: () => console.log("Add guest clicked")
            }}
          />
        )}
      </div>
    </Shell>
  );
};

export default Guests;
