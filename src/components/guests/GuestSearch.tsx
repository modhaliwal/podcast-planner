
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface GuestSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export function GuestSearch({ searchQuery, setSearchQuery }: GuestSearchProps) {
  return (
    <div className="relative">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search guests..."
        className="w-full md:w-[200px] pl-8"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </div>
  );
}
