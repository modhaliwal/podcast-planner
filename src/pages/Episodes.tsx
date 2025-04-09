
import { useState, useEffect } from 'react';
import { Shell } from '@/components/layout/Shell';
import { EpisodesHeader } from '@/components/episodes/EpisodesHeader';
import { EpisodesSearchFilter } from '@/components/episodes/EpisodesSearchFilter';
import { EpisodesContent } from '@/components/episodes/EpisodesContent';
import { PageLayout } from '@/components/layout/PageLayout';
import { useEpisodes } from '@/hooks/useEpisodes';

const Episodes = () => {
  const { episodes, guests, isLoading, refreshEpisodes } = useEpisodes();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  const filteredEpisodes = episodes.filter(episode => {
    const matchesSearch = episode.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || episode.status === statusFilter;
    return matchesSearch && matchesStatus;
  });
  
  const sortedEpisodes = [...filteredEpisodes].sort(
    (a, b) => new Date(b.scheduled).getTime() - new Date(a.scheduled).getTime()
  );
  
  const handleRefresh = () => {
    console.log("Manual refresh triggered");
    refreshEpisodes();
  };
  
  return (
    <Shell>
      <PageLayout
        title="Episodes"
        subtitle="Manage your podcast episodes"
        actions={<EpisodesHeader onRefresh={handleRefresh} />}
      >
        <div className="space-y-4 sm:space-y-6">
          <EpisodesSearchFilter 
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
          />
          
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
          ) : (
            <EpisodesContent
              filteredEpisodes={sortedEpisodes}
              guests={guests}
              searchQuery={searchQuery}
            />
          )}
        </div>
      </PageLayout>
    </Shell>
  );
}

export default Episodes;
