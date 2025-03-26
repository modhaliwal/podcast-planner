
import React from 'react';
import { Music, Youtube } from 'lucide-react';
import { PodcastUrls } from '@/lib/types';

interface EpisodePodcastLinksProps {
  podcastUrls?: PodcastUrls;
}

export function EpisodePodcastLinks({ podcastUrls }: EpisodePodcastLinksProps) {
  // Check if any podcast URLs exist
  const hasPodcastUrls = podcastUrls && (
    podcastUrls.spotify || 
    podcastUrls.applePodcasts || 
    podcastUrls.amazonPodcasts || 
    podcastUrls.youtube
  );

  const handlePodcastLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, url: string) => {
    e.preventDefault();
    e.stopPropagation();
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  if (!hasPodcastUrls) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-3 py-2 mb-3 border-y border-border">
      {podcastUrls?.spotify && (
        <a 
          href={podcastUrls.spotify}
          onClick={(e) => handlePodcastLinkClick(e, podcastUrls.spotify!)}
          className="flex items-center text-sm text-primary relative z-10"
        >
          <Music className="h-4 w-4 mr-1.5" />
          <span>Spotify</span>
        </a>
      )}
      
      {podcastUrls?.applePodcasts && (
        <a 
          href={podcastUrls.applePodcasts}
          onClick={(e) => handlePodcastLinkClick(e, podcastUrls.applePodcasts!)}
          className="flex items-center text-sm text-primary relative z-10"
        >
          <Music className="h-4 w-4 mr-1.5" />
          <span>Apple</span>
        </a>
      )}
      
      {podcastUrls?.amazonPodcasts && (
        <a 
          href={podcastUrls.amazonPodcasts}
          onClick={(e) => handlePodcastLinkClick(e, podcastUrls.amazonPodcasts!)}
          className="flex items-center text-sm text-primary relative z-10"
        >
          <Music className="h-4 w-4 mr-1.5" />
          <span>Amazon</span>
        </a>
      )}
      
      {podcastUrls?.youtube && (
        <a 
          href={podcastUrls.youtube}
          onClick={(e) => handlePodcastLinkClick(e, podcastUrls.youtube!)}
          className="flex items-center text-sm text-primary relative z-10"
        >
          <Youtube className="h-4 w-4 mr-1.5" />
          <span>YouTube</span>
        </a>
      )}
    </div>
  );
}
