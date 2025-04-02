
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Shell } from '@/components/layout/Shell';
import { EpisodesHeader } from '@/components/episodes/EpisodesHeader';
import { EpisodesSearchFilter } from '@/components/episodes/EpisodesSearchFilter';
import { EpisodesContent } from '@/components/episodes/EpisodesContent';

const Episodes = () => {
  const { episodes, guests, refreshEpisodes } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [initialLoadDone, setInitialLoadDone] = useState(false);
  
  useEffect(() => {
    if (!initialLoadDone) {
      console.log("Episodes initial load, refreshing data");
      refreshEpisodes();
      setInitialLoadDone(true);
    }
  }, [initialLoadDone, refreshEpisodes]);
  
  const filteredEpisodes = episodes.filter(episode => {
    const matchesSearch = episode.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || episode.status === statusFilter;
    return matchesSearch && matchesStatus;
  });
  
  const sortedEpisodes = [...filteredEpisodes].sort(
    (a, b) => new Date(b.scheduled).getTime() - new Date(a.scheduled).getTime()
  );
  
  const handleRefresh = () => {
    console.log("Manual refresh triggered with force=true");
    refreshEpisodes(true); // Add the force=true parameter to always fetch fresh data
  };
  
  return (
    <Shell>
      <div className="page-container">
        <EpisodesHeader 
          onRefresh={handleRefresh}
        />
        
        <EpisodesSearchFilter 
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
        />
        
        <EpisodesContent
          filteredEpisodes={sortedEpisodes}
          guests={guests}
          searchQuery={searchQuery}
        />
      </div>
    </Shell>
  );
};

export default Episodes;
