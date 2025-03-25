import { FormLabel } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { UseFormReturn } from "react-hook-form";
import { Sparkles } from "lucide-react";
import { generateResearchWithAPI } from "./utils/researchUtils";
import { ResearchEditorComponent } from "./ResearchEditorComponent";

interface ResearchSectionProps {
  form: UseFormReturn<any>;
  backgroundResearch: string;
  setBackgroundResearch: (value: string) => void;
  isGeneratingResearch?: boolean;
  setIsGeneratingResearch?: (value: boolean) => void;
}

export function ResearchSection({ 
  form, 
  backgroundResearch,
  setBackgroundResearch,
  isGeneratingResearch = false,
  setIsGeneratingResearch = () => {}
}: ResearchSectionProps) {
  const generateBackgroundResearch = async () => {
    setIsGeneratingResearch(true);
    
    // Get form values for research generation
    const formValues = {
      name: form.getValues('name'),
      title: form.getValues('title'),
      company: form.getValues('company'),
      twitter: form.getValues('twitter'),
      facebook: form.getValues('facebook'),
      linkedin: form.getValues('linkedin'),
      instagram: form.getValues('instagram'),
      tiktok: form.getValues('tiktok'),
      youtube: form.getValues('youtube'),
      website: form.getValues('website'),
    };
    
    await generateResearchWithAPI(
      formValues, 
      setIsGeneratingResearch, 
      setBackgroundResearch
    );
  };

  const handleEditorContentChange = (content: string) => {
    // We keep the raw HTML for the editor
    // but convert it to a more standardized format for storage
    setBackgroundResearch(content);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <FormLabel>Background Research</FormLabel>
        <Button 
          type="button" 
          variant="outline" 
          size="sm" 
          onClick={generateBackgroundResearch}
          disabled={isGeneratingResearch}
        >
          <Sparkles className="h-4 w-4 mr-1" />
          {isGeneratingResearch ? 'Generating with Perplexity...' : 'Generate Research'}
        </Button>
      </div>
      
      <ResearchEditorComponent 
        backgroundResearch={backgroundResearch}
        onContentChange={handleEditorContentChange}
      />
    </div>
  );
}
