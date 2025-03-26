
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";
import { ContentVersion } from "@/lib/types";
import { UseFormReturn } from "react-hook-form";
import { useAIPrompts } from "@/hooks/useAIPrompts";

interface BioGenerationProps {
  form: UseFormReturn<any>;
  onNewVersionCreated: (version: ContentVersion) => void;
}

export function BioGeneration({ form, onNewVersionCreated }: BioGenerationProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { getPromptByKey } = useAIPrompts();

  // Helper function to get social links from the form
  const getSocialLinks = () => {
    const socialLinks = {
      twitter: form.getValues('twitter'),
      facebook: form.getValues('facebook'),
      linkedin: form.getValues('linkedin'),
      instagram: form.getValues('instagram'),
      tiktok: form.getValues('tiktok'),
      youtube: form.getValues('youtube'),
      website: form.getValues('website'),
    };

    // Filter out empty social links
    return Object.fromEntries(
      Object.entries(socialLinks).filter(([_, url]) => url)
    );
  };

  // Helper function to validate required fields
  const validateRequiredFields = () => {
    const name = form.getValues('name');
    const title = form.getValues('title');
    
    if (!name || !title) {
      toast.warning("Please provide at least a name and title to generate content");
      return false;
    }
    return true;
  };

  const createNewVersion = (content: string, source: ContentVersion['source']) => {
    // Don't save empty content
    if (!content.trim()) return null;
    
    const newVersion: ContentVersion = {
      id: uuidv4(),
      content,
      timestamp: new Date().toISOString(),
      source
    };
    
    onNewVersionCreated(newVersion);
    return newVersion;
  };

  const generateBio = async () => {
    try {
      if (!validateRequiredFields()) {
        return;
      }
      
      setIsLoading(true);
      
      const name = form.getValues('name');
      const title = form.getValues('title');
      const company = form.getValues('company');
      
      // Get social links from the form
      const filteredSocialLinks = getSocialLinks();

      toast.info("Generating bio from online presence...");
      
      if (Object.keys(filteredSocialLinks).length === 0) {
        toast.warning("No social links provided. Using basic information only.");
      }
      
      // Get the prompt from the database
      const promptData = getPromptByKey('guest_bio_generator');
      
      // Prepare request body with all available prompt components
      const requestBody: any = {
        type: 'bio',
        name,
        title,
        company,
        socialLinks: filteredSocialLinks
      };
      
      // Add optional fields if prompt data exists and contains these fields
      if (promptData) {
        if (promptData.prompt_text) {
          // Replace variables in the prompt template
          const processedPrompt = promptData.prompt_text
            .replace('${name}', name)
            .replace('${title}', title)
            .replace('${company}', company ? `at ${company}` : '');
          
          requestBody.prompt = processedPrompt;
        }
        
        if (promptData.system_prompt) {
          requestBody.systemPrompt = promptData.system_prompt;
        }
        
        if (promptData.context_instructions) {
          requestBody.contextInstructions = promptData.context_instructions;
        }
        
        if (promptData.example_output) {
          requestBody.exampleOutput = promptData.example_output;
        }
      }
      
      // Call the edge function
      const { data, error } = await supabase.functions.invoke('generate-bio', {
        body: requestBody
      });
      
      if (error) {
        console.error("Supabase function error:", error);
        throw new Error(error.message || "Supabase function error");
      }
      
      if (data && data.bio) {
        // Save the current version before updating with the new content
        const currentBio = form.getValues('bio');
        if (currentBio.trim()) {
          createNewVersion(currentBio, 'manual');
        }
        
        // Update the form with the new bio
        form.setValue('bio', data.bio);
        
        // Save the new version
        createNewVersion(data.bio, 'ai');
        
        toast.success("Bio generated successfully");
      } else if (data && data.error) {
        throw new Error(data.error);
      } else {
        throw new Error("No bio returned from API");
      }
    } catch (error: any) {
      console.error("Error generating bio:", error);
      toast.error(`Failed to generate bio: ${error.message || "Unknown error"}`);
      
      // Fallback to simple bio generation if AI fails
      const name = form.getValues('name');
      const title = form.getValues('title');
      const company = form.getValues('company');
      
      const companyPhrase = company ? `at ${company}` : "in their field";
      const fallbackBio = `Couldn't generate a bio for ${name}.`;
      
      // Save current version
      const currentBio = form.getValues('bio');
      if (currentBio.trim()) {
        createNewVersion(currentBio, 'manual');
      }
      
      // Update form with fallback bio
      form.setValue('bio', fallbackBio);
      
      // Save as new AI version
      createNewVersion(fallbackBio, 'ai');
      
      toast.info("Used fallback bio generator");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      type="button" 
      variant="outline" 
      size="sm" 
      onClick={generateBio}
      disabled={isLoading}
    >
      <Sparkles className="h-4 w-4 mr-1" />
      {isLoading ? "Generating with AI..." : "Generate Bio"}
    </Button>
  );
}
