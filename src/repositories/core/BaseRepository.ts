
import { DataMapper } from './DataMapper';
import { Repository } from './Repository';
import { supabase } from '@/integrations/supabase/client';

// Valid Supabase table names
export type TableName = 'guests' | 'episodes' | 'ai_generators' | 'episode_guests' | 'profiles';

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
  
  async findById(id: string): Promise<T | null> {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .select('*')
        .eq('id', id)
        .maybeSingle();
        
      if (error) throw error;
      if (!data) return null;
      
      return this.mapper.toDomain(data as D);
    } catch (error) {
      console.error(`Error finding ${this.tableName} by ID:`, error);
      throw error;
    }
  }
  
  async findAll(): Promise<T[]> {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      if (!data) return [];
      
      return data.map(item => this.mapper.toDomain(item as D));
    } catch (error) {
      console.error(`Error finding all ${this.tableName}:`, error);
      throw error;
    }
  }
  
  async add(item: T): Promise<T> {
    try {
      const dbItem = this.mapper.toDB(item);
      const { data, error } = await supabase
        .from(this.tableName)
        .insert(dbItem as any)
        .select('*')
        .single();
        
      if (error) throw error;
      
      return this.mapper.toDomain(data as D);
    } catch (error) {
      console.error(`Error adding to ${this.tableName}:`, error);
      throw error;
    }
  }
  
  async update(id: string, item: Partial<T>): Promise<T | null> {
    try {
      const dbItem = this.mapper.toDB(item);
      const { data, error } = await supabase
        .from(this.tableName)
        .update(dbItem as any)
        .eq('id', id)
        .select('*')
        .single();
        
      if (error) throw error;
      if (!data) return null;
      
      return this.mapper.toDomain(data as D);
    } catch (error) {
      console.error(`Error updating ${this.tableName}:`, error);
      throw error;
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
