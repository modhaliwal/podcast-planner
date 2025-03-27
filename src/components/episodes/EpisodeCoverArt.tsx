
import React from 'react';
import { Image } from 'lucide-react';
import { AspectRatio } from '@/components/ui/aspect-ratio';

interface EpisodeCoverArtProps {
  coverArt?: string;
  title: string;
}

export function EpisodeCoverArt({ coverArt, title }: EpisodeCoverArtProps) {
  return (
    <>
      {coverArt ? (
        <div className="h-24 w-24 rounded-md overflow-hidden shrink-0 hidden sm:block">
          <AspectRatio ratio={1/1} className="h-full">
            <img 
              src={coverArt} 
              alt={`Cover for ${title}`}
              className="object-cover w-full h-full"
            />
          </AspectRatio>
        </div>
      ) : (
        <div className="h-24 w-24 rounded-md overflow-hidden bg-muted flex items-center justify-center shrink-0 hidden sm:block">
          <Image className="h-8 w-8 text-muted-foreground" />
        </div>
      )}
    </>
  );
}
