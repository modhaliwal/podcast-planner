
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, Clock, Trash } from "lucide-react";
import { EpisodeFormData } from "./types";

interface EpisodeRowProps {
  episode: EpisodeFormData;
  index: number;
  timeOptions: string[];
  canDelete: boolean;
  onUpdate: (index: number, field: keyof EpisodeFormData, value: any) => void;
  onRemove: (index: number) => void;
  onUpdateTime: (index: number, timeString: string) => void;
}

export const EpisodeRow = ({
  episode,
  index,
  timeOptions,
  canDelete,
  onUpdate,
  onRemove,
  onUpdateTime
}: EpisodeRowProps) => {
  return (
    <div className="grid grid-cols-4 gap-4 items-center">
      <div className="flex items-center gap-2">
        <Input
          type="number"
          value={episode.episodeNumber}
          onChange={(e) => onUpdate(index, 'episodeNumber', parseInt(e.target.value))}
          required
        />
        {canDelete && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onRemove(index)}
            className="flex-shrink-0"
          >
            <Trash className="h-4 w-4 text-muted-foreground" />
          </Button>
        )}
      </div>
      
      <Input
        type="text"
        placeholder={`Episode #${episode.episodeNumber}`}
        value={episode.title || ''}
        onChange={(e) => onUpdate(index, 'title', e.target.value)}
      />
      
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !episode.scheduled && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {episode.scheduled ? (
              format(episode.scheduled, "PPP")
            ) : (
              <span>Select date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={episode.scheduled}
            onSelect={(date) => onUpdate(index, 'scheduled', date || new Date())}
            initialFocus
            className="pointer-events-auto"
          />
        </PopoverContent>
      </Popover>
      <Select
        value={format(episode.scheduled, 'HH:mm')}
        onValueChange={(value) => onUpdateTime(index, value)}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select time">
            <div className="flex items-center">
              <Clock className="mr-2 h-4 w-4" />
              {format(episode.scheduled, 'HH:mm')}
            </div>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {timeOptions.map((time) => (
            <SelectItem key={time} value={time}>
              {time}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
