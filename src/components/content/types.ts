
import { Guest } from "@/lib/types";
import { UseFormReturn } from "react-hook-form";

export interface ContentGenerationConfig {
  // Core configuration
  fieldName: string;                        // Form field name to update
  promptKey: string;                        // Key for retrieving prompt from AI prompts
  buttonLabel?: string;                     // Custom button label
  loadingLabel?: string;                    // Custom loading label
  onContentGenerated?: (content: string) => void; // Optional callback
  
  // Context data
  guests?: Guest[];                         // Optional guests data for context
  additionalContext?: Record<string, any>;  // Additional context data
  
  // Edge function configuration
  edgeFunctionName: string;                 // Name of the Supabase edge function
  generationType?: "bio" | "research" | "notes";      // Type of generation
  preferredProvider?: "openai" | "perplexity";        // Preferred AI provider
}

export interface ContentGeneratorProps {
  config: ContentGenerationConfig;
  form: UseFormReturn<any>;
}
