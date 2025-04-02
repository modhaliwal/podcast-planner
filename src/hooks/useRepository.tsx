
import { useState, useCallback } from 'react';
import { BaseRepository } from '@/repositories/BaseRepository';
import { toast } from '@/hooks/use-toast';

/**
 * Generic hook for working with repositories
 */
export function useRepository<T>(repository: BaseRepository<T>) {
  const [error, setError] = useState<Error | null>(null);
  
  /**
   * Fetch all items
   */
  const fetchAll = useCallback(async (): Promise<T[]> => {
    try {
      setError(null);
      const { data, error } = await repository.getAll();
      
      if (error) {
        setError(error);
        return [];
      }
      
      return data || [];
    } catch (err: any) {
      const error = err instanceof Error ? err : new Error(err?.message || 'Unknown error');
      setError(error);
      return [];
    }
  }, [repository]);
  
  /**
   * Fetch a single item by ID
   */
  const fetchById = useCallback(async (id: string): Promise<T | null> => {
    try {
      setError(null);
      const { data, error } = await repository.getById(id);
      
      if (error) {
        setError(error);
        return null;
      }
      
      return data;
    } catch (err: any) {
      const error = err instanceof Error ? err : new Error(err?.message || 'Unknown error');
      setError(error);
      return null;
    }
  }, [repository]);
  
  /**
   * Create a new item
   */
  const create = useCallback(async (item: Partial<T>): Promise<T | null> => {
    try {
      setError(null);
      const { data, error } = await repository.create(item);
      
      if (error) {
        setError(error);
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive"
        });
        return null;
      }
      
      return data;
    } catch (err: any) {
      const error = err instanceof Error ? err : new Error(err?.message || 'Unknown error');
      setError(error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
      return null;
    }
  }, [repository]);
  
  /**
   * Update an existing item
   */
  const update = useCallback(async (id: string, item: Partial<T>): Promise<boolean> => {
    try {
      setError(null);
      const { success, error } = await repository.update(id, item);
      
      if (error) {
        setError(error);
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive"
        });
        return false;
      }
      
      return success;
    } catch (err: any) {
      const error = err instanceof Error ? err : new Error(err?.message || 'Unknown error');
      setError(error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
      return false;
    }
  }, [repository]);
  
  /**
   * Delete an item
   */
  const remove = useCallback(async (id: string): Promise<boolean> => {
    try {
      setError(null);
      const { success, error } = await repository.delete(id);
      
      if (error) {
        setError(error);
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive"
        });
        return false;
      }
      
      return success;
    } catch (err: any) {
      const error = err instanceof Error ? err : new Error(err?.message || 'Unknown error');
      setError(error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
      return false;
    }
  }, [repository]);
  
  return {
    error,
    fetchAll,
    fetchById,
    create,
    update,
    remove
  };
}
