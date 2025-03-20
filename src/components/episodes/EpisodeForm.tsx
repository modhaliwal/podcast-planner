
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { CalendarIcon, PlusCircle, Trash } from 'lucide-react';
import { format } from 'date-fns';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Episode, Guest, Topic } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { toast } from 'sonner';

interface EpisodeFormProps {
  episode: Episode;
  guests: Guest[];
}

const episodeFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  episodeNumber: z.coerce.number().int().positive("Episode number must be positive"),
  introduction: z.string().min(1, "Introduction is required"),
  notes: z.string().optional(),
  status: z.enum(["scheduled", "recorded", "published"]),
  scheduled: z.date(),
  publishDate: z.date().optional().nullable(),
  guestIds: z.array(z.string()).optional(),
});

type EpisodeFormValues = z.infer<typeof episodeFormSchema>;

export function EpisodeForm({ episode, guests }: EpisodeFormProps) {
  const navigate = useNavigate();
  const [topics, setTopics] = useState<Topic[]>(episode.topics || []);
  
  const form = useForm<EpisodeFormValues>({
    resolver: zodResolver(episodeFormSchema),
    defaultValues: {
      title: episode.title,
      episodeNumber: episode.episodeNumber,
      introduction: episode.introduction,
      notes: episode.notes,
      status: episode.status,
      scheduled: new Date(episode.scheduled),
      publishDate: episode.publishDate ? new Date(episode.publishDate) : null,
      guestIds: episode.guestIds,
    },
  });
  
  const onSubmit = (data: EpisodeFormValues) => {
    // In a real app, this would send the data to an API
    console.log("Form submitted:", data);
    console.log("Topics:", topics);
    
    toast.success("Episode updated successfully");
    navigate(`/episodes/${episode.id}`);
  };
  
  const addTopic = () => {
    const newTopic: Topic = {
      id: `topic-${Date.now()}`,
      title: '',
      notes: '',
    };
    setTopics([...topics, newTopic]);
  };
  
  const updateTopic = (index: number, field: keyof Topic, value: string) => {
    const updatedTopics = [...topics];
    updatedTopics[index] = {
      ...updatedTopics[index],
      [field]: value,
    };
    setTopics(updatedTopics);
  };
  
  const removeTopic = (index: number) => {
    const updatedTopics = [...topics];
    updatedTopics.splice(index, 1);
    setTopics(updatedTopics);
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Episode Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter episode title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="episodeNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Episode Number</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="Enter episode number" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select episode status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="scheduled">Scheduled</SelectItem>
                        <SelectItem value="recorded">Recorded</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Schedule & Publish</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="scheduled"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Recording Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                          className={cn("p-3 pointer-events-auto")}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="publishDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Publish Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value || undefined}
                          onSelect={field.onChange}
                          initialFocus
                          className={cn("p-3 pointer-events-auto")}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
          
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Guests</CardTitle>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="guestIds"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select Guests</FormLabel>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {guests.map((guest) => (
                        <Button
                          key={guest.id}
                          type="button"
                          variant={field.value?.includes(guest.id) ? "default" : "outline"}
                          size="sm"
                          onClick={() => {
                            const currentValue = field.value || [];
                            field.onChange(
                              currentValue.includes(guest.id)
                                ? currentValue.filter((id) => id !== guest.id)
                                : [...currentValue, guest.id]
                            );
                          }}
                          className={field.value?.includes(guest.id) ? "bg-primary text-primary-foreground" : ""}
                        >
                          {guest.name}
                        </Button>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
          
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Episode Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="introduction"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Introduction</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter episode introduction" 
                        className="min-h-[120px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Episode Notes</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter episode notes" 
                        className="min-h-[120px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
          
          <Card className="md:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Conversation Topics</CardTitle>
              <Button 
                type="button"
                variant="outline" 
                size="sm"
                onClick={addTopic}
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Topic
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topics.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No topics added yet. Click the button above to add one.
                  </div>
                ) : (
                  topics.map((topic, index) => (
                    <div key={topic.id} className="space-y-3 border-b pb-4 last:border-b-0">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium">Topic {index + 1}</h3>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeTopic(index)}
                          className="h-8 w-8 p-0 text-destructive"
                        >
                          <Trash className="h-4 w-4" />
                          <span className="sr-only">Remove topic</span>
                        </Button>
                      </div>
                      
                      <div className="grid gap-3">
                        <div>
                          <FormLabel>Topic Title</FormLabel>
                          <Input
                            value={topic.title}
                            onChange={(e) => updateTopic(index, 'title', e.target.value)}
                            placeholder="Enter topic title"
                          />
                        </div>
                        
                        <div>
                          <FormLabel>Topic Notes</FormLabel>
                          <Textarea
                            value={topic.notes}
                            onChange={(e) => updateTopic(index, 'notes', e.target.value)}
                            placeholder="Enter topic notes"
                            className="min-h-[80px]"
                          />
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(`/episodes/${episode.id}`)}
          >
            Cancel
          </Button>
          <Button type="submit">
            Save Changes
          </Button>
        </div>
      </form>
    </Form>
  );
}
