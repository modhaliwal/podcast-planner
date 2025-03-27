
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PlusIcon, RefreshCcw } from 'lucide-react';

interface EpisodesHeaderProps {
  onRefresh: () => void;
  isLoading: boolean;
}

export function EpisodesHeader({ onRefresh, isLoading }: EpisodesHeaderProps) {
  return (
    <div className="page-header">
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={onRefresh} 
          disabled={isLoading}
        >
          <RefreshCcw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
        </Button>
        <Button size="default" asChild>
          <Link to="/episodes/new">
            <PlusIcon className="mr-2 h-4 w-4" />
            Create Episode
          </Link>
        </Button>
      </div>
    </div>
  );
}
