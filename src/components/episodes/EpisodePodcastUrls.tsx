import { Music, Youtube, ExternalLink } from 'lucide-react';
import { Episode } from '@/lib/types';

interface EpisodePodcastUrlsProps {
  episode: Episode;
}

export function EpisodePodcastUrls({ episode }: EpisodePodcastUrlsProps) {
  // Check if any podcast URLs exist
  const hasPodcastUrls = episode.podcastUrls && (
    episode.podcastUrls.spotify || 
    episode.podcastUrls.applePodcasts || 
    episode.podcastUrls.amazonPodcasts || 
    episode.podcastUrls.youtube
  );
  
  // If no podcast URLs exist, return null (don't render anything)
  if (!hasPodcastUrls) {
    return null;
  }

  // Otherwise, render the podcast URLs section
  return (
    <div className="mt-4">
      <h2 className="text-sm font-medium text-muted-foreground mb-2">Listen on</h2>
      <div className="flex flex-wrap gap-2">
        {episode.podcastUrls?.spotify && (
          <a 
            href={episode.podcastUrls.spotify}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center p-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
          >
            <Music className="h-4 w-4 mr-2" />
            <span className="text-sm">Spotify</span>
          </a>
        )}
        
        {episode.podcastUrls?.applePodcasts && (
          <a 
            href={episode.podcastUrls.applePodcasts}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center p-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
          >
            <Music className="h-4 w-4 mr-2" />
            <span className="text-sm">Apple Podcasts</span>
          </a>
        )}
        
        {episode.podcastUrls?.amazonPodcasts && (
          <a 
            href={episode.podcastUrls.amazonPodcasts}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center p-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
          >
            <Music className="h-4 w-4 mr-2" />
            <span className="text-sm">Amazon Podcasts</span>
          </a>
        )}
        
        {episode.podcastUrls?.youtube && (
          <a 
            href={episode.podcastUrls.youtube}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center p-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
          >
            <Youtube className="h-4 w-4 mr-2" />
            <span className="text-sm">YouTube</span>
          </a>
        )}
      </div>
    </div>
  );
}
