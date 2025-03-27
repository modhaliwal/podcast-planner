
import React from 'react';
import { Episode, Guest } from '@/lib/types';
import { EpisodeCard } from './EpisodeCard';

interface EpisodesListProps {
  episodes: Episode[];
  guests: Guest[];
}

export function EpisodesList({ episodes, guests }: EpisodesListProps) {
  return (
    <div className="space-y-4">
      {episodes.map(episode => (
        <EpisodeCard 
          key={episode.id} 
          episode={episode} 
          guests={guests}
        />
      ))}
    </div>
  );
}
