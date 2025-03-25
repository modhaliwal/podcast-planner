
import { useState } from "react";
import { FormLabel } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { UseFormReturn } from "react-hook-form";
import { Sparkles } from "lucide-react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { marked } from "marked";

interface ResearchSectionProps {
  form: UseFormReturn<any>;
  backgroundResearch: string;
  setBackgroundResearch: (value: string) => void;
  isGeneratingResearch?: boolean;
  setIsGeneratingResearch?: (value: boolean) => void;
}

// Quill editor configuration with more comprehensive toolbar
const quillModules = {
  toolbar: [
    [{ 'header': [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{'list': 'ordered'}, {'list': 'bullet'}],
    ['link'],
    ['clean']
  ],
};

const quillFormats = [
  'header',
  'bold', 'italic', 'underline', 'strike',
  'list', 'bullet',
  'link'
];

export function ResearchSection({ 
  form, 
  backgroundResearch,
  setBackgroundResearch,
  isGeneratingResearch = false,
  setIsGeneratingResearch = () => {}
}: ResearchSectionProps) {

  // Get social links from the form
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

  // Validate required fields
  const validateRequiredFields = () => {
    const name = form.getValues('name');
    const title = form.getValues('title');
    
    if (!name || !title) {
      toast.warning("Please provide at least a name and title to generate content");
      return false;
    }
    return true;
  };

  // Convert markdown to HTML for the editor
  const convertMarkdownToHtml = (markdown: string): string => {
    // Use the marked library to convert markdown to HTML
    try {
      marked.setOptions({
        breaks: true,
        gfm: true,
        pedantic: false
      });
      
      // Get the result, which could be a string or Promise<string>
      const result = marked.parse(markdown);
      
      // If it's a promise, we shouldn't be here (this function should be used in a sync context)
      if (result instanceof Promise) {
        console.warn("Unexpected Promise result in synchronous context");
        // Return basic conversion as fallback
        return basicMarkdownToHtml(markdown);
      }
      
      return result;
    } catch (error) {
      console.error("Error converting markdown to HTML:", error);
      // Fallback to basic conversion
      return basicMarkdownToHtml(markdown);
    }
  };
  
  // Basic markdown to HTML converter as fallback
  const basicMarkdownToHtml = (markdown: string): string => {
    return markdown
      .replace(/\n\n/g, '<p></p>')
      .replace(/\n/g, '<br>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/^### (.*?)$/gm, '<h3>$1</h3>')
      .replace(/^## (.*?)$/gm, '<h2>$1</h2>')
      .replace(/^# (.*?)$/gm, '<h1>$1</h1>');
  };

  const generateBackgroundResearch = async () => {
    setIsGeneratingResearch(true);
    try {
      if (!validateRequiredFields()) {
        setIsGeneratingResearch(false);
        return;
      }
      
      const name = form.getValues('name');
      const title = form.getValues('title');
      const company = form.getValues('company');
      
      // Get social links from the form
      const filteredSocialLinks = getSocialLinks();

      toast.info("Generating research with Perplexity AI...");
      
      if (Object.keys(filteredSocialLinks).length === 0) {
        toast.warning("No social links provided. Using basic information only.");
      }
      
      // Call the edge function
      const { data, error } = await supabase.functions.invoke('generate-bio', {
        body: {
          type: 'research',
          name,
          title,
          company,
          socialLinks: filteredSocialLinks
        }
      });
      
      if (error) {
        console.error("Supabase function error:", error);
        throw new Error(error.message || "Supabase function error");
      }
      
      if (data?.research) {
        console.log("Received research from API:", data.research.substring(0, 100) + "...");
        
        // Store the markdown directly
        setBackgroundResearch(data.research);
        toast.success("Background research generated successfully");
      } else if (data?.error) {
        throw new Error(data.error);
      } else {
        throw new Error("No research returned from API");
      }
    } catch (error: any) {
      console.error("Error generating research:", error);
      toast.error(`Failed to generate research: ${error.message || "Unknown error"}`);
      
      const name = form.getValues('name');
      const title = form.getValues('title');
      
      // Simplified fallback
      const fallbackResearch = generateFallbackResearch(name, title);
      setBackgroundResearch(fallbackResearch);
      toast.info("Used fallback research generator");
    } finally {
      setIsGeneratingResearch(false);
    }
  };

  // Generate fallback research content when API fails
  const generateFallbackResearch = (name: string, title: string): string => {
    return `## Research findings for ${name}

### Educational background
Graduated with honors in relevant field.

### Career highlights
Has over 10 years of experience as a ${title}.

### Previous media appearances
Has been featured on several industry podcasts.

### Publications
Author of multiple well-received articles in industry journals.

### Areas of expertise
Specializes in emerging trends and practical applications.

### Speaking style
Articulate, engaging, with a talent for making complex topics accessible.

### Recent projects
Currently involved in several innovative initiatives.

### Social media presence
Active on professional platforms with substantial following.

## Recommended topics to explore
* Their journey to becoming a ${title}
* Their perspective on industry challenges and opportunities
* Their vision for the future of their field`;
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
      <div className="border rounded-md">
        <ReactQuill 
          value={backgroundResearch} 
          onChange={setBackgroundResearch} 
          modules={quillModules}
          formats={quillFormats}
          placeholder="Research information about this guest"
          theme="snow"
          className="bg-background min-h-[200px]"
        />
      </div>
    </div>
  );
}
