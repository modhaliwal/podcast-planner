
/**
 * Generic repository interface for data access
 */
export interface Repository<T, CreateDto = Partial<T>, UpdateDto = Partial<T>> {
  findById(id: string): Promise<T | null>;
  findAll(): Promise<T[]>;
  add(item: CreateDto): Promise<T>;
  update(id: string, item: UpdateDto): Promise<T | null>;
  delete(id: string): Promise<boolean>;
}

export interface Result<T> {
  data?: T;
  error?: Error;
  success: boolean;
}
