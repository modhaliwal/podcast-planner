
import { UseFormReturn } from 'react-hook-form';
import { EpisodeFormValues } from '@/hooks/useEpisodeForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Link, Music, Youtube } from 'lucide-react';

interface PodcastUrlsSectionProps {
  form: UseFormReturn<EpisodeFormValues>;
}

export function PodcastUrlsSection({ form }: PodcastUrlsSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Link className="h-5 w-5 text-primary" />
          Podcast Distribution URLs
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground mb-4">
          Add links to where listeners can find this episode on different platforms.
        </p>
        
        <FormField
          control={form.control}
          name="podcastUrls.spotify"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <Music className="h-4 w-4 text-muted-foreground" />
                Spotify
              </FormLabel>
              <FormControl>
                <Input placeholder="Spotify URL" {...field} value={field.value || ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="podcastUrls.applePodcasts"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <Music className="h-4 w-4 text-muted-foreground" />
                Apple Podcasts
              </FormLabel>
              <FormControl>
                <Input placeholder="Apple Podcasts URL" {...field} value={field.value || ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="podcastUrls.amazonPodcasts"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <Music className="h-4 w-4 text-muted-foreground" />
                Amazon Podcasts
              </FormLabel>
              <FormControl>
                <Input placeholder="Amazon Podcasts URL" {...field} value={field.value || ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="podcastUrls.youtube"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <Youtube className="h-4 w-4 text-muted-foreground" />
                YouTube
              </FormLabel>
              <FormControl>
                <Input placeholder="YouTube URL" {...field} value={field.value || ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}
