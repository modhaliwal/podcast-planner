
import { BaseRepository, TableName } from '../core/BaseRepository';
import { aiGeneratorMapper } from './AIGeneratorMapper';
import { Tables } from '@/integrations/supabase/types';
import { supabase } from '@/integrations/supabase/client';

// Define the database model type directly from Supabase types
export type AIGeneratorDB = Tables<'ai_generators'>;

// Define the domain model interface here to break circular dependency
export interface AIGenerator {
  id?: string;
  slug: string;
  title: string;
  prompt_text: string;
  example_output?: string;
  context_instructions?: string;
  system_prompt?: string;
  ai_model?: string;
  model_name?: string;
  parameters?: string;
}

export class AIGeneratorRepository extends BaseRepository<AIGenerator, AIGeneratorDB> {
  constructor() {
    super('ai_generators' as TableName, aiGeneratorMapper);
  }

  /**
   * Get a generator by its slug
   */
  async getBySlug(slug: string): Promise<AIGenerator | null> {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .select('*')
        .eq('slug', slug)
        .maybeSingle();
        
      if (error) throw error;
      if (!data) return null;
      
      return this.mapper.toDomain(data);
    } catch (error) {
      console.error(`Error finding AI generator by slug:`, error);
      return null;
    }
  }

  /**
   * Get a generator by its key (used for retrieving specific generators by functionality)
   */
  async getByKey(key: string): Promise<AIGenerator | null> {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .select('*')
        .eq('key', key)
        .maybeSingle();
        
      if (error) throw error;
      if (!data) return null;
      
      return this.mapper.toDomain(data);
    } catch (error) {
      console.error(`Error finding AI generator by key:`, error);
      return null;
    }
  }
}
