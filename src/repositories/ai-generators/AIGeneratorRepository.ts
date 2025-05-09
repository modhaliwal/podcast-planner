
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
      .insert({
        slug: generator.slug,
        title: generator.title,
        prompt_text: generator.prompt_text,
        example_output: generator.example_output,
        context_instructions: generator.context_instructions,
        system_prompt: generator.system_prompt,
        ai_model: generator.ai_model,
        model_name: generator.model_name,
        parameters: generator.parameters,
        key: generator.key
      })
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
    // Only include fields that are present in the partial update
    const updateData: Partial<AIGeneratorDB> = {};
    
    if (generator.title !== undefined) updateData.title = generator.title;
    if (generator.slug !== undefined) updateData.slug = generator.slug;
    if (generator.prompt_text !== undefined) updateData.prompt_text = generator.prompt_text;
    if (generator.example_output !== undefined) updateData.example_output = generator.example_output;
    if (generator.context_instructions !== undefined) updateData.context_instructions = generator.context_instructions;
    if (generator.system_prompt !== undefined) updateData.system_prompt = generator.system_prompt;
    if (generator.ai_model !== undefined) updateData.ai_model = generator.ai_model;
    if (generator.model_name !== undefined) updateData.model_name = generator.model_name;
    if (generator.parameters !== undefined) updateData.parameters = generator.parameters;
    if (generator.key !== undefined) updateData.key = generator.key;

    const { data, error } = await supabase
      .from('ai_generators')
      .update(updateData)
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
