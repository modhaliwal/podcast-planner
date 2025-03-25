
import { useState } from "react";
import { FormLabel } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { UseFormReturn } from "react-hook-form";
import { Sparkles } from "lucide-react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface ResearchSectionProps {
  form: UseFormReturn<any>;
  backgroundResearch: string;
  setBackgroundResearch: (value: string) => void;
  isGeneratingResearch?: boolean;
  setIsGeneratingResearch?: (value: boolean) => void;
}

// Quill editor configuration
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

const quillStyles = {
  height: '200px',
  marginBottom: '50px',
};

export function ResearchSection({ 
  form, 
  backgroundResearch,
  setBackgroundResearch,
  isGeneratingResearch = false,
  setIsGeneratingResearch = () => {}
}: ResearchSectionProps) {

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

      toast.info("Generating research from online presence...");
      
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
      
      if (data && data.research) {
        setBackgroundResearch(data.research);
        toast.success("Background research generated successfully");
      } else if (data && data.error) {
        throw new Error(data.error);
      } else {
        throw new Error("No research returned from API");
      }
    } catch (error: any) {
      console.error("Error generating research:", error);
      toast.error(`Failed to generate research: ${error.message || "Unknown error"}`);
      
      // Fallback to simple research generation if AI fails
      const name = form.getValues('name');
      const title = form.getValues('title');
      
      const fallbackResearch = `<h3>Research findings for ${name}:</h3>
      
<ol>
  <li><strong>Educational background:</strong> Graduated with honors in relevant field.</li>
  <li><strong>Career highlights:</strong> Has over 10 years of experience as a ${title}.</li>
  <li><strong>Previous media appearances:</strong> Has been featured on several industry podcasts.</li>
  <li><strong>Publications:</strong> Author of multiple well-received articles in industry journals.</li>
  <li><strong>Areas of expertise:</strong> Specializes in emerging trends and practical applications.</li>
  <li><strong>Speaking style:</strong> Articulate, engaging, with a talent for making complex topics accessible.</li>
  <li><strong>Recent projects:</strong> Currently involved in several innovative initiatives.</li>
  <li><strong>Social media presence:</strong> Active on professional platforms with substantial following.</li>
</ol>

<h3>Recommended topics to explore:</h3>
<ul>
  <li>Their journey to becoming a ${title}</li>
  <li>Their perspective on industry challenges and opportunities</li>
  <li>Their vision for the future of their field</li>
</ul>`;
      
      setBackgroundResearch(fallbackResearch);
      toast.info("Used fallback research generator");
    } finally {
      setIsGeneratingResearch(false);
    }
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
          {isGeneratingResearch ? 'Generating from links...' : 'Generate Research'}
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
          className="bg-background resize-vertical"
          style={quillStyles}
        />
      </div>
    </div>
  );
}
