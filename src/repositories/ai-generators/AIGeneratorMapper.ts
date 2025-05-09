
import { DataMapper } from '../core/DataMapper';
import { AIGenerator, AIGeneratorDB } from './AIGeneratorRepository';

/**
 * Mapper for transforming between domain AIGenerator model and database AI generator model
 */
export class AIGeneratorMapper implements DataMapper<AIGenerator, AIGeneratorDB> {
  toDomain(dbModel: AIGeneratorDB): AIGenerator {
    // Parse parameters if they exist
    let parameters: Record<string, any> | undefined;
    if (dbModel.parameters) {
      try {
        parameters = JSON.parse(dbModel.parameters);
      } catch (e) {
        console.error("Error parsing parameters JSON:", e);
        parameters = undefined;
      }
    }

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
      parameters: dbModel.parameters || undefined
    };
  }

  toDB(domainModel: Partial<AIGenerator>): Partial<AIGeneratorDB> {
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
      parameters: domainModel.parameters
    };
  }

  createDtoToDB(dto: Partial<AIGenerator>): Partial<AIGeneratorDB> {
    return this.toDB(dto);
  }

  updateDtoToDB(dto: Partial<AIGenerator>): Partial<AIGeneratorDB> {
    return this.toDB(dto);
  }
}

export const aiGeneratorMapper = new AIGeneratorMapper();
