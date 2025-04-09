
import { useState, useCallback } from 'react';
import { Repository } from '@/repositories/core/Repository';
import { toast } from '@/hooks/use-toast';

/**
 * Generic hook for working with repositories
 */
export function useRepository<T, CreateDTO = Partial<T>, UpdateDTO = Partial<T>>(
  repository: Repository<T, CreateDTO, UpdateDTO>
) {
  const [error, setError] = useState<Error | null>(null);
  
  /**
   * Fetch all items
   */
  const fetchAll = useCallback(async (): Promise<T[]> => {
    try {
      setError(null);
      return await repository.getAll();
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
      return await repository.getById(id);
    } catch (err: any) {
      const error = err instanceof Error ? err : new Error(err?.message || 'Unknown error');
      setError(error);
      return null;
    }
  }, [repository]);
  
  /**
   * Create a new item
   */
  const create = useCallback(async (item: CreateDTO): Promise<T | null> => {
    try {
      setError(null);
      const result = await repository.add(item);
      return result;
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
  const update = useCallback(async (id: string, item: UpdateDTO): Promise<boolean> => {
    try {
      setError(null);
      const result = await repository.update(id, item);
      return !!result;
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
      return await repository.delete(id);
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
