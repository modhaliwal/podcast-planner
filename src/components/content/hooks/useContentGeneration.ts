
import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { ContentGenerationConfig } from "../types";
import { toast } from "@/hooks/toast";

export const useContentGeneration = (
  config: ContentGenerationConfig,
  form: UseFormReturn<any>
) => {
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  
  const {
    fieldName,
    promptKey,
    onContentGenerated,
    additionalContext = {},
    edgeFunctionName,
  } = config;

  // Determine if we should disable the button
  const shouldDisable = () => {
    // Temporary disabled while AI generators are being reworked
    return true;
  };

  const generateContent = async () => {
    // Placeholder function while AI generators are being reworked
    toast({
      title: "AI Generation Unavailable",
      description: "AI Generators are currently being reworked. This feature will be available soon.",
      variant: "destructive"
    });
  };

  return {
    isGenerating,
    shouldDisable,
    generateContent
  };
};
