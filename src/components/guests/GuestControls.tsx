
import { GuestSearch } from './GuestSearch';
import { GuestFilter } from './GuestFilter';

type GuestStatus = 'all' | 'potential' | 'contacted' | 'confirmed' | 'appeared';

interface GuestControlsProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: GuestStatus;
  setStatusFilter: (status: GuestStatus) => void;
}

export function GuestControls({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter
}: GuestControlsProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
      <GuestSearch searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      
      <div className="flex items-center gap-2">
        <GuestFilter statusFilter={statusFilter} setStatusFilter={setStatusFilter} />
      </div>
    </div>
  );
}
