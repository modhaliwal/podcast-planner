
import { useData } from '@/context/DataContext';

export function useEpisodes() {
  const { episodes, guests, isLoading, refreshData } = useData();
  
  return {
    episodes,
    guests,
    isLoading,
    refreshEpisodes: refreshData
  };
}
