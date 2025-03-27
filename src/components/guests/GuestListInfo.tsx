
import { Guest } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface GuestInfoProps {
  guest: Guest;
  statusColor: {
    bg: string;
    text: string;
    border: string;
    darkBg: string;
    darkText: string;
    darkBorder: string;
  };
}

export function GuestInfo({ guest, statusColor }: GuestInfoProps) {
  return (
    <div className="flex-1 min-w-0 space-y-1">
      <div className="flex items-center gap-2 flex-wrap">
        <h3 className="text-lg font-medium truncate">{guest.name}</h3>
        
        {/* Status badge */}
        {guest.status && (
          <Badge 
            variant="outline" 
            className={cn(
              "text-xs capitalize px-2 py-0.5 shrink-0",
              statusColor.bg,
              statusColor.text,
              statusColor.border,
              statusColor.darkBg,
              statusColor.darkText,
              statusColor.darkBorder
            )}
          >
            {guest.status}
          </Badge>
        )}
      </div>
      
      <p className="text-muted-foreground text-sm truncate">
        {guest.title}
        {guest.company && <span>, {guest.company}</span>}
      </p>
    </div>
  );
}
