
import { DataMapper } from './DataMapper';
import { Repository } from './Repository';
import { supabase } from '@/integrations/supabase/client';

// Valid Supabase table names
export type TableName = 'guests' | 'episodes' | 'ai_generators' | 'episode_guests';

/**
 * Base implementation of the Repository interface
 */
export abstract class BaseRepository<T, D> implements Repository<T> {
  protected readonly tableName: TableName;
  protected readonly mapper: DataMapper<T, D>;
  
  constructor(tableName: TableName, mapper: DataMapper<T, D>) {
    this.tableName = tableName;
    this.mapper = mapper;
  }
  
  async getById(id: string): Promise<T | null> {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .select('*')
        .eq('id', id)
        .maybeSingle();
        
      if (error) throw error;
      if (!data) return null;
      
      return this.mapper.toDomain(data as any);
    } catch (error) {
      console.error(`Error finding ${this.tableName} by ID:`, error);
      return null;
    }
  }
  
  async getAll(): Promise<T[]> {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      if (!data) return [];
      
      return data.map(item => this.mapper.toDomain(item as any));
    } catch (error) {
      console.error(`Error finding all ${this.tableName}:`, error);
      return [];
    }
  }
  
  async add(item: any): Promise<T> {
    try {
      // Use the mapper to convert the item to DB format
      const dbItem = this.mapper.createDtoToDB(item);
      
      const { data, error } = await supabase
        .from(this.tableName)
        .insert(dbItem as any)
        .select('*')
        .single();
        
      if (error) throw error;
      
      return this.mapper.toDomain(data as any);
    } catch (error) {
      console.error(`Error adding to ${this.tableName}:`, error);
      throw error;
    }
  }
  
  async update(id: string, item: any): Promise<T | null> {
    try {
      // Use the mapper to convert the item to DB format
      const dbItem = this.mapper.updateDtoToDB(item);
      
      const { data, error } = await supabase
        .from(this.tableName)
        .update(dbItem as any)
        .eq('id', id)
        .select('*')
        .single();
        
      if (error) throw error;
      if (!data) return null;
      
      return this.mapper.toDomain(data as any);
    } catch (error) {
      console.error(`Error updating ${this.tableName}:`, error);
      return null;
    }
  }
  
  async delete(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from(this.tableName)
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error(`Error deleting from ${this.tableName}:`, error);
      return false;
    }
  }
}
