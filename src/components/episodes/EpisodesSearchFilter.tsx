
import React from 'react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SearchIcon } from 'lucide-react';

interface EpisodesSearchFilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: string;
  onStatusChange: (status: string) => void;
}

export function EpisodesSearchFilter({ 
  searchQuery, 
  onSearchChange, 
  statusFilter, 
  onStatusChange 
}: EpisodesSearchFilterProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
      <div className="relative flex-1">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search episodes..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      
      <Tabs 
        defaultValue={statusFilter} 
        className="w-full sm:w-auto" 
        onValueChange={onStatusChange}
      >
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="all" className="flex-1 sm:flex-auto">All</TabsTrigger>
          <TabsTrigger value="scheduled" className="flex-1 sm:flex-auto">Scheduled</TabsTrigger>
          <TabsTrigger value="recorded" className="flex-1 sm:flex-auto">Recorded</TabsTrigger>
          <TabsTrigger value="published" className="flex-1 sm:flex-auto">Published</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}
