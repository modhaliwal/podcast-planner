
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';

// Define the database model type directly from Supabase types
export type AIGeneratorDB = Tables<'ai_generators'>;

// Define the domain model interface
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
  key?: string;
}

/**
 * Get all AI generators
 */
export async function getAllGenerators(): Promise<AIGenerator[]> {
  try {
    const { data, error } = await supabase
      .from('ai_generators')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    if (!data) return [];
    
    return data.map(item => mapToDomainModel(item));
  } catch (error) {
    console.error(`Error finding all AI generators:`, error);
    return [];
  }
}

/**
 * Get a generator by ID
 */
export async function getGeneratorById(id: string): Promise<AIGenerator | null> {
  try {
    const { data, error } = await supabase
      .from('ai_generators')
      .select('*')
      .eq('id', id)
      .maybeSingle();
      
    if (error) throw error;
    if (!data) return null;
    
    return mapToDomainModel(data);
  } catch (error) {
    console.error(`Error finding AI generator by ID:`, error);
    return null;
  }
}

/**
 * Get a generator by its slug
 */
export async function getGeneratorBySlug(slug: string): Promise<AIGenerator | null> {
  try {
    const { data, error } = await supabase
      .from('ai_generators')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();
      
    if (error) throw error;
    if (!data) return null;
    
    return mapToDomainModel(data);
  } catch (error) {
    console.error(`Error finding AI generator by slug:`, error);
    return null;
  }
}

/**
 * Get a generator by its key
 */
export async function getGeneratorByKey(key: string): Promise<AIGenerator | null> {
  try {
    const { data, error } = await supabase
      .from('ai_generators')
      .select('*')
      .eq('key', key)
      .maybeSingle();
      
    if (error) throw error;
    if (!data) return null;
    
    return mapToDomainModel(data);
  } catch (error) {
    console.error(`Error finding AI generator by key:`, error);
    return null;
  }
}

/**
 * Add a new generator
 */
export async function addGenerator(generator: AIGenerator): Promise<AIGenerator> {
  try {
    const { data, error } = await supabase
      .from('ai_generators')
      .insert(mapToDBModel(generator))
      .select('*')
      .single();
      
    if (error) throw error;
    
    return mapToDomainModel(data);
  } catch (error) {
    console.error(`Error adding AI generator:`, error);
    throw error;
  }
}

/**
 * Update an existing generator
 */
export async function updateGenerator(id: string, generator: Partial<AIGenerator>): Promise<AIGenerator | null> {
  try {
    const { data, error } = await supabase
      .from('ai_generators')
      .update(mapToDBModel(generator))
      .eq('id', id)
      .select('*')
      .single();
      
    if (error) throw error;
    if (!data) return null;
    
    return mapToDomainModel(data);
  } catch (error) {
    console.error(`Error updating AI generator:`, error);
    return null;
  }
}

/**
 * Delete a generator
 */
export async function deleteGenerator(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('ai_generators')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error(`Error deleting AI generator:`, error);
    return false;
  }
}

/**
 * Map from DB model to domain model
 */
function mapToDomainModel(dbModel: AIGeneratorDB): AIGenerator {
  return {
    id: dbModel.id,
    slug: dbModel.slug,
    title: dbModel.title,
    prompt_text: dbModel.prompt_text,
    example_output: dbModel.example_output || undefined,
    context_instructions: dbModel.context_instructions || undefined,
    system_prompt: dbModel.system_prompt || undefined,
    ai_model: dbModel.ai_model || undefined,
    model_name: dbModel.model_name || undefined,
    parameters: dbModel.parameters || undefined,
    key: dbModel.key || undefined
  };
}

/**
 * Map from domain model to DB model
 */
function mapToDBModel(domainModel: Partial<AIGenerator>): Partial<AIGeneratorDB> {
  return {
    id: domainModel.id,
    slug: domainModel.slug,
    title: domainModel.title,
    prompt_text: domainModel.prompt_text,
    example_output: domainModel.example_output,
    context_instructions: domainModel.context_instructions,
    system_prompt: domainModel.system_prompt,
    ai_model: domainModel.ai_model,
    model_name: domainModel.model_name,
    parameters: domainModel.parameters,
    key: domainModel.key
  };
}
