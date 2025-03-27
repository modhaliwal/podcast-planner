
import { Guest } from "@/lib/types";
import { GuestList } from "./GuestList";
import { GuestSearch } from "./GuestSearch";
import { GuestFilter } from "./GuestFilter";
import { useState } from "react";
import { GuestViewToggle } from "./GuestViewToggle";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { EmptyState } from "@/components/ui/empty-state";
import { LoadingIndicator } from "@/components/ui/loading-indicator";
import { useAuth } from "@/contexts/AuthContext";

type GuestStatus = 'all' | 'potential' | 'contacted' | 'confirmed' | 'appeared';

export function GuestContent() {
  const { guests, isLoadingGuests, refreshGuests } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<GuestStatus>('all');
  const [viewMode, setViewMode] = useState<"list" | "card">("list");

  if (isLoadingGuests) {
    return <LoadingIndicator message="Loading guests..." />;
  }

  // Apply filters
  const filteredGuests = guests.filter((guest) => {
    const matchesSearch =
      searchQuery === "" ||
      guest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (guest.company &&
        guest.company.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus =
      statusFilter === 'all' || 
      guest.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  if (filteredGuests.length === 0) {
    return (
      <div>
        <div className="flex justify-between mb-6">
          <div className="flex space-x-4">
            <GuestSearch 
              searchQuery={searchQuery} 
              setSearchQuery={setSearchQuery} 
            />
            <GuestFilter
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
            />
          </div>
          <div className="flex items-center gap-4">
            <GuestViewToggle 
              viewMode={viewMode} 
              setViewMode={setViewMode} 
            />
            <Button asChild>
              <Link to="/guests/new">
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Guest
              </Link>
            </Button>
          </div>
        </div>
        <EmptyState
          title="No guests found"
          description="Try adjusting your search or filters, or add a new guest."
          action={
            <Button asChild>
              <Link to="/guests/new">
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Guest
              </Link>
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between mb-6">
        <div className="flex space-x-4">
          <GuestSearch 
            searchQuery={searchQuery} 
            setSearchQuery={setSearchQuery} 
          />
          <GuestFilter
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
          />
        </div>
        <div className="flex items-center gap-4">
          <GuestViewToggle 
            viewMode={viewMode} 
            setViewMode={setViewMode} 
          />
          <Button asChild>
            <Link to="/guests/new">
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Guest
            </Link>
          </Button>
        </div>
      </div>

      <GuestList guests={filteredGuests} />
    </div>
  );
}
