
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { EpisodeStatus } from '@/lib/enums';

interface EpisodeCardBadgesProps {
  status: EpisodeStatus;
  episodeNumber: number;
}

export function EpisodeCardBadges({ status, episodeNumber }: EpisodeCardBadgesProps) {
  return (
    <div className="flex items-center gap-2 mb-1">
      <Badge variant={
        status === EpisodeStatus.PUBLISHED ? "default" :
        status === EpisodeStatus.RECORDED ? "secondary" :
        "outline"
      }>
        {status}
      </Badge>
      <Badge variant="outline" className="font-mono">
        Ep #{episodeNumber}
      </Badge>
    </div>
  );
}
