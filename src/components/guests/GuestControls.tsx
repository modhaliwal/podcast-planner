
import { GuestSearch } from './GuestSearch';
import { GuestViewToggle } from './GuestViewToggle';
import { GuestFilter } from './GuestFilter';

type ViewMode = 'list' | 'card';
type GuestStatus = 'all' | 'potential' | 'contacted' | 'confirmed' | 'appeared';

interface GuestControlsProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: GuestStatus;
  setStatusFilter: (status: GuestStatus) => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
}

export function GuestControls({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  viewMode,
  setViewMode
}: GuestControlsProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <GuestSearch searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      
      <div className="flex items-center gap-2">
        <GuestViewToggle viewMode={viewMode} setViewMode={setViewMode} />
        <GuestFilter statusFilter={statusFilter} setStatusFilter={setStatusFilter} />
      </div>
    </div>
  );
}
