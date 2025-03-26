
import React from 'react';
import { Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { EpisodeStatus } from '@/lib/enums';

interface EpisodeCardStatusProps {
  status: EpisodeStatus;
}

export function EpisodeCardStatus({ status }: EpisodeCardStatusProps) {
  return (
    <div className={cn(
      "h-12 w-12 rounded-full flex items-center justify-center shrink-0",
      status === EpisodeStatus.PUBLISHED ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" :
      status === EpisodeStatus.RECORDED ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300" :
      "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300"
    )}>
      <Calendar className="h-6 w-6" />
    </div>
  );
}
