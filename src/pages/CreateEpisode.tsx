
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shell } from '@/components/layout/Shell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarIcon, Plus, Trash, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { toast } from '@/hooks/use-toast';

interface EpisodeFormData {
  episodeNumber: number;
  scheduled: Date;
}

const CreateEpisode = () => {
  const navigate = useNavigate();
  const [episodes, setEpisodes] = useState<EpisodeFormData[]>([
    { episodeNumber: 1, scheduled: new Date() }
  ]);

  const addEpisode = () => {
    const lastEpisode = episodes[episodes.length - 1];
    const nextDate = new Date(lastEpisode.scheduled);
    nextDate.setDate(nextDate.getDate() + 7); // Default to one week later
    
    setEpisodes([
      ...episodes,
      { 
        episodeNumber: lastEpisode.episodeNumber + 1,
        scheduled: nextDate
      }
    ]);
  };

  const removeEpisode = (index: number) => {
    if (episodes.length === 1) {
      return; // Don't remove the last episode
    }
    setEpisodes(episodes.filter((_, i) => i !== index));
  };

  const updateEpisode = (index: number, field: keyof EpisodeFormData, value: any) => {
    const updatedEpisodes = [...episodes];
    updatedEpisodes[index] = {
      ...updatedEpisodes[index],
      [field]: value
    };
    setEpisodes(updatedEpisodes);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const hasErrors = episodes.some(ep => !ep.episodeNumber || !ep.scheduled);
    if (hasErrors) {
      toast({
        title: "Validation Error",
        description: "All episodes must have a number and recording date",
        variant: "destructive",
      });
      return;
    }

    // Would normally save to database here
    toast({
      title: "Success!",
      description: `Created ${episodes.length} new episodes`,
    });
    
    // Navigate back to episodes list
    navigate('/episodes');
  };

  return (
    <Shell>
      <div className="page-container">
        <div className="page-header mb-6">
          <div>
            <h1 className="section-title">Create New Episodes</h1>
            <p className="section-subtitle">
              Add one or more episodes to your schedule
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-xl">Episode Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Header row with field labels */}
                <div className="grid grid-cols-2 gap-4 font-medium text-sm mb-1">
                  <Label>Episode Number</Label>
                  <Label>Recording Date & Time</Label>
                </div>
                
                {/* Episode rows */}
                {episodes.map((episode, index) => (
                  <div key={index} className="grid grid-cols-2 gap-4 items-center">
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value={episode.episodeNumber}
                        onChange={(e) => updateEpisode(index, 'episodeNumber', parseInt(e.target.value))}
                        required
                      />
                      {episodes.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeEpisode(index)}
                          className="flex-shrink-0"
                        >
                          <Trash className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      )}
                    </div>
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
                          onSelect={(date) => updateEpisode(index, 'scheduled', date || new Date())}
                          initialFocus
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                ))}
                
                {/* Add episode button */}
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={addEpisode}
                  className="gap-1 w-full"
                >
                  <Plus className="h-4 w-4" />
                  Add Another Episode
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end items-center mt-6 space-x-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate('/episodes')}
            >
              Cancel
            </Button>
            <Button type="submit">
              Create Episodes
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </form>
      </div>
    </Shell>
  );
};

export default CreateEpisode;
