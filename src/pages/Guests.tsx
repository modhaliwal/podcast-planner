
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { guests } from '@/lib/data';
import { Shell } from '@/components/layout/Shell';
import { GuestCard } from '@/components/guests/GuestCard';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { PlusIcon, SearchIcon, Users, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type GuestStatus = 'all' | 'potential' | 'contacted' | 'confirmed' | 'appeared';

const Guests = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<GuestStatus>('all');

  // Filter guests based on search query and status
  const filteredGuests = guests.filter(guest => {
    // Search filter
    const matchesSearch = 
      guest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guest.title.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Status filter
    const matchesStatus = 
      statusFilter === 'all' || 
      guest.status === statusFilter || 
      (statusFilter === 'potential' && !guest.status); // Treat undefined status as potential
    
    return matchesSearch && matchesStatus;
  });
  
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
        
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search guests..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="md:w-auto">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full md:w-auto">
                  <Filter className="h-4 w-4 mr-2" />
                  {statusFilter === 'all' ? 'All Guests' : 
                   statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setStatusFilter('all')}>
                  All Guests
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('potential')}>
                  Potential
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('contacted')}>
                  Contacted
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('confirmed')}>
                  Confirmed
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('appeared')}>
                  Appeared
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
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
            description={searchQuery ? 
              "Try adjusting your search terms or filters" : 
              "Get started by adding your first guest"}
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
