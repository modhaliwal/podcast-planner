
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PlusIcon, RefreshCcw } from 'lucide-react';

interface EpisodesHeaderProps {
  onRefresh: () => void;
}

export function EpisodesHeader({ onRefresh }: EpisodesHeaderProps) {
  return (
    <>
      <Button 
        variant="outline" 
        size="icon" 
        onClick={onRefresh} 
      >
        <RefreshCcw className="h-4 w-4" />
      </Button>
      <Button size="default" asChild>
        <Link to="/episodes/new">
          <PlusIcon className="mr-2 h-4 w-4" />
          Create Episode
        </Link>
      </Button>
    </>
  );
}
