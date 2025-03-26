
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Shell } from '@/components/layout/Shell';
import { EpisodesHeader } from '@/components/episodes/EpisodesHeader';
import { EpisodesSearchFilter } from '@/components/episodes/EpisodesSearchFilter';
import { EpisodesList } from '@/components/episodes/EpisodesList';

const Episodes = () => {
  const { episodes, guests, refreshEpisodes, isDataLoading } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [initialLoadDone, setInitialLoadDone] = useState(false);
  
  // Load episodes once on initial mount
  useEffect(() => {
    if (!initialLoadDone && !isDataLoading) {
      console.log("Episodes initial load, refreshing data");
      refreshEpisodes();
      setInitialLoadDone(true);
    }
  }, [initialLoadDone, isDataLoading, refreshEpisodes]);
  
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
        <EpisodesHeader 
          onRefresh={handleRefresh} 
          isLoading={isDataLoading} 
        />
        
        <EpisodesSearchFilter 
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
        />
        
        <EpisodesList 
          episodes={sortedEpisodes}
          guests={guests}
          isLoading={isDataLoading}
          searchQuery={searchQuery}
        />
      </div>
    </Shell>
  );
};

export default Episodes;
