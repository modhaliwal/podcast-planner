
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Episode, Guest } from '@/lib/types';
import { repositories } from '@/repositories';
import { toast } from '@/hooks/use-toast';

interface DataContextType {
  episodes: Episode[];
  guests: Guest[];
  isLoading: boolean;
  error: Error | null;
  refreshData: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Use the repositories to fetch data
      const [fetchedEpisodes, fetchedGuests] = await Promise.all([
        repositories.episodes.getAll(),
        repositories.guests.getAll()
      ]);
      
      console.log(`Fetched ${fetchedEpisodes.length} episodes and ${fetchedGuests.length} guests`);
      
      setEpisodes(fetchedEpisodes);
      setGuests(fetchedGuests);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch data'));
      toast({
        title: 'Error loading data',
        description: 'There was an error loading your data. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
      setIsInitialized(true);
    }
  }, []);

  // Initial data fetch
  useEffect(() => {
    if (!isInitialized) {
      fetchData();
    }
  }, [fetchData, isInitialized]);

  const refreshData = useCallback(async () => {
    await fetchData();
  }, [fetchData]);

  const value = {
    episodes,
    guests,
    isLoading,
    error,
    refreshData
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
