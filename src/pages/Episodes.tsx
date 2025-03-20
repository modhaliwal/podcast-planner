
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Shell } from '@/components/layout/Shell';
import { EpisodeCard } from '@/components/episodes/EpisodeCard';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { CalendarIcon, MicIcon, PlusIcon, SearchIcon, RefreshCcw } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Episodes = () => {
  const { episodes, guests, refreshEpisodes, isDataLoading } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  useEffect(() => {
    console.log("Episodes component mounted or updated");
    console.log("Number of episodes:", episodes.length);
    console.log("Loading state:", isDataLoading);
    
    // If no episodes are loaded and we're not currently loading, try refreshing
    if (episodes.length === 0 && !isDataLoading) {
      console.log("No episodes found, triggering refresh");
      refreshEpisodes();
    }
  }, [episodes.length, isDataLoading, refreshEpisodes]);
  
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
  
  const handleRefresh = () => {
    console.log("Manual refresh triggered");
    refreshEpisodes();
  };
  
  return (
    <Shell>
      <div className="page-container">
        <div className="page-header">
          <div>
            <h1 className="section-title">Podcast Episodes</h1>
            <p className="section-subtitle">Manage your episode schedule and content</p>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={handleRefresh} 
              disabled={isDataLoading}
            >
              <RefreshCcw className={`h-4 w-4 ${isDataLoading ? 'animate-spin' : ''}`} />
            </Button>
            <Button size="default" asChild>
              <Link to="/episodes/create">
                <PlusIcon className="mr-2 h-4 w-4" />
                Create Episode
              </Link>
            </Button>
          </div>
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
        
        {isDataLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        ) : sortedEpisodes.length > 0 ? (
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
