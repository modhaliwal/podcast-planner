import { Result } from "@/lib/types";

/**
 * Base Repository interface that defines common CRUD operations
 * with strong typing for all operations
 */
export interface Repository<T, CreateDTO = Partial<T>, UpdateDTO = Partial<T>> {
  /**
   * Get all items with optional filtering
   */
  getAll(options?: { 
    filters?: Record<string, any>,
    relations?: string[] 
  }): Promise<Result<T[]>>;
  
  /**
   * Get a single item by ID
   */
  getById(id: string): Promise<Result<T>>;
  
  /**
   * Create a new item
   * @param item Data required to create a new entity
   */
  create(item: CreateDTO): Promise<Result<T>>;
  
  /**
   * Update an existing item
   * @param id ID of the entity to update
   * @param item Data to update the entity with
   */
  update(id: string, item: UpdateDTO): Promise<Result<boolean>>;
  
  /**
   * Delete an item by ID
   */
  delete(id: string): Promise<Result<boolean>>;
}
