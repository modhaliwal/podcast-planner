
import { Repository } from "./Repository";
import { supabase } from "@/integrations/supabase/client";
import { DataMapper } from "./DataMapper";
import { Result } from "@/lib/types";

// Define valid table names to satisfy TypeScript
export type TableName = 'guests' | 'episodes' | 'episode_guests' | 'ai_generators' | 'profiles';

/**
 * Base Repository class that provides standardized methods for CRUD operations.
 * Includes proper error handling and common implementations.
 */
export abstract class BaseRepository<T, CreateDTO = Partial<T>, UpdateDTO = Partial<T>, DBModel = any> 
  implements Repository<T, CreateDTO, UpdateDTO> {
  
  protected abstract tableName: TableName;
  protected abstract mapper: DataMapper<T, DBModel>;
  
  /**
   * Standardized error handler for repository operations
   */
  protected handleError(operation: string, error: any): Error {
    console.error(`Error during ${operation}:`, error);
    return error instanceof Error ? error : new Error(error?.message || `Error during ${operation}`);
  }

  /**
   * Get all items with optional filtering
   */
  async getAll(options?: { 
    filters?: Record<string, any>,
    relations?: string[] 
  }): Promise<Result<T[]>> {
    try {
      let query = supabase
        .from(this.tableName)
        .select('*');
        
      // Apply filters if provided
      if (options?.filters) {
        Object.entries(options.filters).forEach(([key, value]) => {
          if (value !== undefined) {
            query = query.eq(key, value);
          }
        });
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      // Map DB models to domain models
      const items = (data || []).map(item => this.mapper.toDomain(item as DBModel));
      
      return { data: items, error: null, success: true };
    } catch (error) {
      return { data: null, error: this.handleError('getAll', error), success: false };
    }
  }
  
  /**
   * Get a single item by ID
   */
  async getById(id: string): Promise<Result<T>> {
    if (!id) {
      return { data: null, error: new Error("No ID provided"), success: false };
    }
    
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      // Map DB model to domain model
      const item = this.mapper.toDomain(data as DBModel);
      
      return { data: item, error: null, success: true };
    } catch (error) {
      return { data: null, error: this.handleError(`getById ${id}`, error), success: false };
    }
  }
  
  /**
   * Create a new item
   */
  async create(dto: CreateDTO): Promise<Result<T>> {
    try {
      // Get current user ID
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("User not authenticated");
      }
      
      // Convert DTO to DB model using mapper
      const dbModel = this.prepareForCreate(dto, user.id);
      
      // Insert into database
      const { data, error } = await supabase
        .from(this.tableName)
        .insert(dbModel)
        .select()
        .single();
      
      if (error) throw error;
      
      if (!data) return { data: null, error: null, success: false };
      
      // Return the created item
      const createdItem = this.mapper.toDomain(data as DBModel);
      
      return { data: createdItem, error: null, success: true };
    } catch (error) {
      return { data: null, error: this.handleError('create', error), success: false };
    }
  }
  
  /**
   * Update an existing item
   */
  async update(id: string, dto: UpdateDTO): Promise<Result<boolean>> {
    try {
      // Convert DTO to DB model using mapper
      const dbModel = this.prepareForUpdate(dto);
      
      const { error } = await supabase
        .from(this.tableName)
        .update({
          ...dbModel,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);
      
      if (error) throw error;
      
      return { data: true, error: null, success: true };
    } catch (error) {
      return { data: false, error: this.handleError(`update ${id}`, error), success: false };
    }
  }
  
  /**
   * Delete an item by ID
   */
  async delete(id: string): Promise<Result<boolean>> {
    try {
      const { error } = await supabase
        .from(this.tableName)
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      return { data: true, error: null, success: true };
    } catch (error) {
      return { data: false, error: this.handleError(`delete ${id}`, error), success: false };
    }
  }
  
  /**
   * Prepare data for create operation
   * This method can be overridden by child classes
   */
  protected prepareForCreate(dto: CreateDTO, userId: string): any {
    return {
      ...this.mapper.createDtoToDB?.(dto) || dto,
      user_id: userId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  }
  
  /**
   * Prepare data for update operation
   * This method can be overridden by child classes
   */
  protected prepareForUpdate(dto: UpdateDTO): any {
    return this.mapper.updateDtoToDB?.(dto) || dto;
  }
}
