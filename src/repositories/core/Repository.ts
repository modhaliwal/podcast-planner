
/**
 * Generic repository interface for data access
 */
export interface Repository<T, CreateDto = Partial<T>, UpdateDto = Partial<T>> {
  getById(id: string): Promise<T | null>;
  getAll(): Promise<T[]>;
  add(item: CreateDto): Promise<T>;
  update(id: string, item: UpdateDto): Promise<T | null>;
  delete(id: string): Promise<boolean>;
}

/**
 * Standard result type for repository operations
 */
export interface Result<T> {
  data: T | null;
  error: Error | null;
  success: boolean;
}
