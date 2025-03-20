import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shell } from '@/components/layout/Shell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarIcon, Plus, Trash, ArrowRight, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, nextFriday, addWeeks } from 'date-fns';
import { toast } from 'sonner';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface EpisodeFormData {
  episodeNumber: number;
  scheduled: Date;
  title?: string;
}

// Helper function to generate time options
const generateTimeOptions = () => {
  const options = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const hourFormatted = hour.toString().padStart(2, '0');
      const minuteFormatted = minute.toString().padStart(2, '0');
      options.push(`${hourFormatted}:${minuteFormatted}`);
    }
  }
  return options;
};

// Helper to get next Friday at 10:00 AM
const getUpcomingFriday = () => {
  const today = new Date();
  const friday = nextFriday(today);
  friday.setHours(10, 0, 0, 0); // Set to 10:00 AM
  return friday;
};

// Helper to get the same date but at 11:30 AM
const getSecondTimeSlot = (date: Date) => {
  const newDate = new Date(date);
  newDate.setHours(11, 30, 0, 0); // Set to 11:30 AM
  return newDate;
};

// Helper to determine the date for a new episode based on the current episodes count
const getNextEpisodeDate = (episodesCount: number) => {
  // Calculate which pair this episode belongs to (0-indexed)
  const pairIndex = Math.floor(episodesCount / 2);
  
  // Get the base Friday for this pair
  const baseFriday = getUpcomingFriday();
  
  // For first pair (0): upcoming Friday
  // For second pair (1): +2 weeks
  // For third pair (2): +4 weeks
  // For subsequent pairs: +2 weeks per pair
  const weeksToAdd = pairIndex > 0 ? pairIndex * 2 : 0;
  
  // Add the required number of weeks
  const targetDate = addWeeks(baseFriday, weeksToAdd);
  
  // If this is an odd-indexed episode (second in the pair), set time to 11:30 AM
  if (episodesCount % 2 === 1) {
    return getSecondTimeSlot(targetDate);
  }
  
  // For even-indexed episodes (first in the pair), return date at 10:00 AM
  return targetDate;
};

const CreateEpisode = () => {
  const navigate = useNavigate();
  const { user, refreshEpisodes } = useAuth();
  const [episodes, setEpisodes] = useState<EpisodeFormData[]>([
    { 
      episodeNumber: 1, 
      scheduled: getUpcomingFriday(),
      title: `Episode #1` 
    }
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const timeOptions = generateTimeOptions();

  const addEpisode = () => {
    const lastEpisode = episodes[episodes.length - 1];
    const nextEpisodeNumber = lastEpisode.episodeNumber + 1;
    const nextDate = getNextEpisodeDate(episodes.length);
    
    setEpisodes([
      ...episodes,
      { 
        episodeNumber: nextEpisodeNumber,
        scheduled: nextDate,
        title: `Episode #${nextEpisodeNumber}`
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

  const updateTime = (index: number, timeString: string) => {
    const [hours, minutes] = timeString.split(':').map(Number);
    const updatedDate = new Date(episodes[index].scheduled);
    updatedDate.setHours(hours);
    updatedDate.setMinutes(minutes);
    updatedDate.setSeconds(0);
    
    updateEpisode(index, 'scheduled', updatedDate);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast("Authentication Error", {
        description: "You must be logged in to create episodes",
      });
      return;
    }
    
    // Validation
    const hasErrors = episodes.some(ep => !ep.episodeNumber || !ep.scheduled);
    if (hasErrors) {
      toast("Validation Error", {
        description: "All episodes must have a number and recording date",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Save each episode to the database
      for (const episode of episodes) {
        const { error } = await supabase
          .from('episodes')
          .insert({
            user_id: user.id,
            episode_number: episode.episodeNumber,
            title: episode.title || `Episode #${episode.episodeNumber}`,
            scheduled: episode.scheduled.toISOString(),
            status: 'scheduled',
            introduction: `Introduction for Episode #${episode.episodeNumber}`, // Default introduction
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });

        if (error) throw error;
      }

      // Refresh episodes list
      await refreshEpisodes();
      
      toast("Success!", {
        description: `Created ${episodes.length} new episodes`,
      });
      
      // Navigate back to episodes list
      navigate('/episodes');
    } catch (error: any) {
      toast("Error Creating Episodes", {
        description: error.message || "An unexpected error occurred",
      });
      console.error("Error creating episodes:", error);
    } finally {
      setIsSubmitting(false);
    }
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
                <div className="grid grid-cols-4 gap-4 font-medium text-sm mb-1">
                  <Label>Episode Number</Label>
                  <Label>Title</Label>
                  <Label>Recording Date</Label>
                  <Label>Recording Time</Label>
                </div>
                
                {/* Episode rows */}
                {episodes.map((episode, index) => (
                  <div key={index} className="grid grid-cols-4 gap-4 items-center">
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
                    
                    <Input
                      type="text"
                      placeholder={`Episode #${episode.episodeNumber}`}
                      value={episode.title || ''}
                      onChange={(e) => updateEpisode(index, 'title', e.target.value)}
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
                          onSelect={(date) => updateEpisode(index, 'scheduled', date || new Date())}
                          initialFocus
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                    <Select
                      value={format(episode.scheduled, 'HH:mm')}
                      onValueChange={(value) => updateTime(index, value)}
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
            <Button 
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating...' : 'Create Episodes'}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </form>
      </div>
    </Shell>
  );
};

export default CreateEpisode;
