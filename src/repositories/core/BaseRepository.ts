
import { Repository } from "./Repository";

/**
 * Base Repository class that all specific repositories should extend.
 * Provides standardized methods for CRUD operations but requires implementation
 * in subclasses.
 */
export abstract class BaseRepository<T, CreateDTO = Partial<T>, UpdateDTO = Partial<T>> 
  implements Repository<T, CreateDTO, UpdateDTO> {
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
  abstract create(item: CreateDTO): Promise<{ data: T | null; error: Error | null }>;
  
  /**
   * Update an existing item
   */
  abstract update(id: string, item: UpdateDTO): Promise<{ success: boolean; error: Error | null }>;
  
  /**
   * Delete an item by ID
   */
  abstract delete(id: string): Promise<{ success: boolean; error: Error | null }>;
}
