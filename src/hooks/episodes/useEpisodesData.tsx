
import { useEffect } from 'react';
import { useData } from '@/context/DataContext';

export function useEpisodesData() {
  const { episodes, guests, isLoading, refreshData } = useData();
  
  // Refresh data when component mounts
  useEffect(() => {
    refreshData();
  }, [refreshData]);
  
  return {
    episodes,
    guests,
    isLoading,
    refreshEpisodes: refreshData
  };
}
