
import { Guest } from "@/lib/types";
import { useGuestsData } from "@/hooks/guests";
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

export function GuestContent() {
  const { guests, isLoading, deleteGuest, error } = useGuestsData();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [viewType, setViewType] = useState<"list" | "grid">("list");

  if (isLoading) {
    return <LoadingIndicator message="Loading guests..." />;
  }

  if (error) {
    return (
      <EmptyState
        title="Error loading guests"
        description={error}
        action={<Button>Try Again</Button>}
      />
    );
  }

  // Apply filters
  const filteredGuests = guests.filter((guest) => {
    const matchesSearch =
      searchQuery === "" ||
      guest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (guest.company &&
        guest.company.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus =
      !statusFilter || guest.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  if (filteredGuests.length === 0) {
    return (
      <div>
        <div className="flex justify-between mb-6">
          <div className="flex space-x-4">
            <GuestSearch onSearch={setSearchQuery} />
            <GuestFilter
              onFilterChange={setStatusFilter}
              selectedFilter={statusFilter}
            />
          </div>
          <div className="flex items-center gap-4">
            <GuestViewToggle activeView={viewType} onViewChange={setViewType} />
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
          <GuestSearch onSearch={setSearchQuery} />
          <GuestFilter
            onFilterChange={setStatusFilter}
            selectedFilter={statusFilter}
          />
        </div>
        <div className="flex items-center gap-4">
          <GuestViewToggle activeView={viewType} onViewChange={setViewType} />
          <Button asChild>
            <Link to="/guests/new">
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Guest
            </Link>
          </Button>
        </div>
      </div>

      <GuestList guests={filteredGuests} onDelete={deleteGuest} />
    </div>
  );
}
