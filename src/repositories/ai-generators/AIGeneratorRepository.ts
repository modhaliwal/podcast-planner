
import { BaseRepository, TableName } from '../core/BaseRepository';
import { aiGeneratorMapper } from './AIGeneratorMapper';
import { AIPrompt } from '@/hooks/useAIPrompts';
import { Tables } from '@/integrations/supabase/types';
import { supabase } from '@/integrations/supabase/client';

// Define the database model type directly
type AIGeneratorDB = Tables<'ai_generators'>;

export class AIGeneratorRepository extends BaseRepository<AIPrompt, AIGeneratorDB> {
  constructor() {
    super('ai_generators' as TableName, aiGeneratorMapper);
  }

  /**
   * Get a generator by its slug
   */
  async getBySlug(slug: string): Promise<AIPrompt | null> {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .select('*')
        .eq('slug', slug)
        .maybeSingle();
        
      if (error) throw error;
      if (!data) return null;
      
      // Use a simple type assertion without chaining
      const dbRecord = data as any;
      return this.mapper.toDomain(dbRecord);
    } catch (error) {
      console.error(`Error finding AI generator by slug:`, error);
      return null;
    }
  }

  /**
   * Get a generator by its key (used for retrieving specific generators by functionality)
   */
  async getByKey(key: string): Promise<AIPrompt | null> {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .select('*')
        .eq('key', key)
        .maybeSingle();
        
      if (error) throw error;
      if (!data) return null;
      
      // Use a simple type assertion without chaining
      const dbRecord = data as any;
      return this.mapper.toDomain(dbRecord);
    } catch (error) {
      console.error(`Error finding AI generator by key:`, error);
      return null;
    }
  }
}
