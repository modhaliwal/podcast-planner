
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shell } from '@/components/layout/Shell';
import { GuestCard } from '@/components/guests/GuestCard';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { PlusIcon, SearchIcon, Users, Filter, LayoutGrid, LayoutList } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { GuestList } from '@/components/guests/GuestList';
import { Toggle } from '@/components/ui/toggle';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Guest } from '@/lib/types';

type GuestStatus = 'all' | 'potential' | 'contacted' | 'confirmed' | 'appeared';
type ViewMode = 'list' | 'card';

const Guests = () => {
  const { guests, isDataLoading, user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<GuestStatus>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('list');

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

  // Redirect to add guest page
  const handleAddGuest = () => {
    if (!user) {
      toast("Authentication Required", {
        description: "You need to be logged in to add guests"
      });
      return;
    }
    
    navigate('/guests/new');
  };
  
  return (
    <Shell>
      <div className="page-container">
        <div className="page-header">
          <div>
            <h1 className="section-title">Podcast Guests</h1>
            <p className="section-subtitle">Manage your guest profiles and information</p>
          </div>
          
          <Button size="default" onClick={handleAddGuest}>
            <PlusIcon className="mr-2 h-4 w-4" />
            Add Guest
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
          
          <div className="flex items-center gap-2">
            <div className="bg-muted/50 rounded-md flex p-1">
              <Toggle
                pressed={viewMode === 'list'}
                onPressedChange={() => setViewMode('list')}
                size="sm"
                variant="outline"
                aria-label="List view"
                className="rounded-md data-[state=on]:bg-background data-[state=on]:text-foreground"
              >
                <LayoutList className="h-4 w-4" />
              </Toggle>
              <Toggle
                pressed={viewMode === 'card'}
                onPressedChange={() => setViewMode('card')}
                size="sm"
                variant="outline"
                aria-label="Card view"
                className="rounded-md data-[state=on]:bg-background data-[state=on]:text-foreground"
              >
                <LayoutGrid className="h-4 w-4" />
              </Toggle>
            </div>
            
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
        
        {isDataLoading ? (
          <div className="flex items-center justify-center py-10">
            <p className="text-muted-foreground">Loading guests...</p>
          </div>
        ) : filteredGuests.length > 0 ? (
          viewMode === 'list' ? (
            <GuestList guests={filteredGuests} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGuests.map(guest => (
                <GuestCard key={guest.id} guest={guest} />
              ))}
            </div>
          )
        ) : (
          <EmptyState 
            icon={<Users className="h-8 w-8 text-muted-foreground" />}
            title="No guests found"
            description={searchQuery ? 
              "Try adjusting your search terms or filters" : 
              "Get started by adding your first guest"}
            action={{
              label: "Add Guest",
              onClick: handleAddGuest
            }}
          />
        )}
      </div>
    </Shell>
  );
};

export default Guests;
