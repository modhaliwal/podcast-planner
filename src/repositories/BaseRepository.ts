
/**
 * Base Repository class that all specific repositories should extend.
 * Provides standardized methods for CRUD operations.
 */
export abstract class BaseRepository<T> {
  /**
   * Get all items
   */
  abstract getAll(): Promise<{ data: T[] | null; error: Error | null }>;
  
  /**
   * Get a single item by ID
   */
  abstract getById(id: string): Promise<{ data: T | null; error: Error | null }>;
  
  /**
   * Create a new item
   */
  abstract create(item: Partial<T>): Promise<{ data: T | null; error: Error | null }>;
  
  /**
   * Update an existing item
   */
  abstract update(id: string, item: Partial<T>): Promise<{ success: boolean; error: Error | null }>;
  
  /**
   * Delete an item by ID
   */
  abstract delete(id: string): Promise<{ success: boolean; error: Error | null }>;
}
