
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { EpisodeRow } from "./EpisodeRow";
import { EpisodeFormData } from "./types";
import { Plus } from "lucide-react";
import { generateTimeOptions } from "@/utils/dateUtils";

interface EpisodeFormCardProps {
  episodes: EpisodeFormData[];
  onAddEpisode: () => void;
  onRemoveEpisode: (index: number) => void;
  onUpdateEpisode: (index: number, field: keyof EpisodeFormData, value: any) => void;
  onUpdateTime: (index: number, timeString: string) => void;
}

export const EpisodeFormCard = ({
  episodes,
  onAddEpisode,
  onRemoveEpisode,
  onUpdateEpisode,
  onUpdateTime
}: EpisodeFormCardProps) => {
  const timeOptions = generateTimeOptions();

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-xl">Episode Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Header row with field labels */}
          <div className="grid grid-cols-5 gap-4 font-medium text-sm mb-1">
            <Label>Episode Number</Label>
            <Label>Title</Label>
            <Label>Topic</Label>
            <Label>Recording Date</Label>
            <Label>Recording Time</Label>
          </div>
          
          {/* Episode rows */}
          {episodes.map((episode, index) => (
            <EpisodeRow
              key={index}
              episode={episode}
              index={index}
              timeOptions={timeOptions}
              canDelete={episodes.length > 1}
              onUpdate={onUpdateEpisode}
              onRemove={onRemoveEpisode}
              onUpdateTime={onUpdateTime}
            />
          ))}
          
          {/* Add episode button */}
          <Button 
            type="button" 
            variant="outline" 
            onClick={onAddEpisode}
            className="gap-1 w-full"
          >
            <Plus className="h-4 w-4" />
            Add Another Episode
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
