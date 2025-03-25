
import { FormLabel } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";

interface ResearchSectionProps {
  form: UseFormReturn<any>;
  backgroundResearch: string;
  setBackgroundResearch: (value: string) => void;
  isGeneratingResearch?: boolean;
  setIsGeneratingResearch?: (value: boolean) => void;
}

// Empty component since we're removing this functionality
export function ResearchSection({ 
  form, 
  backgroundResearch,
  setBackgroundResearch,
  isGeneratingResearch = false,
  setIsGeneratingResearch = () => {}
}: ResearchSectionProps) {
  return null;
}
