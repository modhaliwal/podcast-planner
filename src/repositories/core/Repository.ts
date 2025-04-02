
/**
 * Base Repository interface that defines common CRUD operations
 * with strong typing for all operations
 */
export interface Repository<T, CreateDTO = Partial<T>, UpdateDTO = Partial<T>> {
  /**
   * Get all items
   */
  getAll(): Promise<{ data: T[] | null; error: Error | null }>;
  
  /**
   * Get a single item by ID
   */
  getById(id: string): Promise<{ data: T | null; error: Error | null }>;
  
  /**
   * Create a new item
   * @param item Data required to create a new entity
   */
  create(item: CreateDTO): Promise<{ data: T | null; error: Error | null }>;
  
  /**
   * Update an existing item
   * @param id ID of the entity to update
   * @param item Data to update the entity with
   */
  update(id: string, item: UpdateDTO): Promise<{ success: boolean; error: Error | null }>;
  
  /**
   * Delete an item by ID
   */
  delete(id: string): Promise<{ success: boolean; error: Error | null }>;
}
