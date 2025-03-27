
import { List, Grid } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

type ViewMode = "list" | "card";

interface GuestViewToggleProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
}

export function GuestViewToggle({ viewMode, setViewMode }: GuestViewToggleProps) {
  return (
    <ToggleGroup type="single" value={viewMode} onValueChange={(value: ViewMode) => {
      if (value) setViewMode(value);
    }}>
      <ToggleGroupItem value="list" aria-label="List view">
        <List className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="card" aria-label="Card view">
        <Grid className="h-4 w-4" />
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
