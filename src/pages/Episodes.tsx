
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { guests, episodes } from '@/lib/data';
import { Shell } from '@/components/layout/Shell';
import { EpisodeCard } from '@/components/episodes/EpisodeCard';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { CalendarIcon, MicIcon, PlusIcon, SearchIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Episodes = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Filter episodes based on search query and status
  const filteredEpisodes = episodes.filter(episode => {
    const matchesSearch = episode.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || episode.status === statusFilter;
    return matchesSearch && matchesStatus;
  });
  
  // Sort episodes by scheduled date (most recent first)
  const sortedEpisodes = [...filteredEpisodes].sort(
    (a, b) => new Date(b.scheduled).getTime() - new Date(a.scheduled).getTime()
  );
  
  return (
    <Shell>
      <div className="page-container">
        <div className="page-header">
          <div>
            <h1 className="section-title">Podcast Episodes</h1>
            <p className="section-subtitle">Manage your episode schedule and content</p>
          </div>
          
          <Button size="default" asChild>
            <Link to="/episodes/create">
              <PlusIcon className="mr-2 h-4 w-4" />
              Create Episode
            </Link>
          </Button>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search episodes..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Tabs defaultValue="all" className="w-full sm:w-auto" onValueChange={setStatusFilter}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
              <TabsTrigger value="recorded">Recorded</TabsTrigger>
              <TabsTrigger value="published">Published</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        {sortedEpisodes.length > 0 ? (
          <div className="space-y-4">
            {sortedEpisodes.map(episode => (
              <EpisodeCard 
                key={episode.id} 
                episode={episode} 
                guests={guests}
              />
            ))}
          </div>
        ) : (
          <EmptyState 
            icon={<MicIcon className="h-8 w-8 text-muted-foreground" />}
            title="No episodes found"
            description={searchQuery ? "Try adjusting your search terms" : "Get started by creating your first episode"}
            action={{
              label: "Create Episode",
              onClick: () => window.location.href = "/episodes/create"
            }}
          />
        )}
      </div>
    </Shell>
  );
};

export default Episodes;
