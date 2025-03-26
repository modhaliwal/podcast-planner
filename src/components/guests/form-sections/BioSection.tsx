
import { useState, useEffect } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { Sparkles } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";
import { ContentVersion } from "@/lib/types";
import { VersionSelector } from "./VersionSelector";

interface BioSectionProps {
  form: UseFormReturn<any>;
  bioVersions: ContentVersion[];
  onVersionsChange: (versions: ContentVersion[]) => void;
}

export function BioSection({ form, bioVersions = [], onVersionsChange }: BioSectionProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [activeVersionId, setActiveVersionId] = useState<string | undefined>(undefined);

  // Initialize with the current bio as the first version if no versions exist
  useEffect(() => {
    if (bioVersions.length === 0) {
      const currentBio = form.getValues('bio');
      if (currentBio) {
        const initialVersion: ContentVersion = {
          id: uuidv4(),
          content: currentBio,
          timestamp: new Date().toISOString(),
          source: 'manual'
        };
        onVersionsChange([initialVersion]);
        setActiveVersionId(initialVersion.id);
      }
    } else if (!activeVersionId) {
      // Set the most recent version as active
      const sortedVersions = [...bioVersions].sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
      setActiveVersionId(sortedVersions[0].id);
    }
  }, [bioVersions, form, onVersionsChange, activeVersionId]);

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

  const selectVersion = (version: ContentVersion) => {
    form.setValue('bio', version.content);
    setActiveVersionId(version.id);
  };

  const saveCurrentVersion = (source: ContentVersion['source'] = 'manual') => {
    const currentBio = form.getValues('bio');
    
    // Don't save empty content
    if (!currentBio.trim()) return;
    
    const newVersion: ContentVersion = {
      id: uuidv4(),
      content: currentBio,
      timestamp: new Date().toISOString(),
      source
    };
    
    // Add the new version and update the active version
    const updatedVersions = [...bioVersions, newVersion];
    onVersionsChange(updatedVersions);
    setActiveVersionId(newVersion.id);
    
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
      
      // Call the edge function
      const { data, error } = await supabase.functions.invoke('generate-bio', {
        body: {
          type: 'bio',
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
      
      if (data && data.bio) {
        // Save the current version before updating with the new content
        saveCurrentVersion('manual');
        
        // Update the form with the new bio
        form.setValue('bio', data.bio);
        
        // Save the new version
        saveCurrentVersion('ai');
        
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
      saveCurrentVersion('manual');
      
      // Update form with fallback bio
      form.setValue('bio', fallbackBio);
      
      // Save as new AI version
      saveCurrentVersion('ai');
      
      toast.info("Used fallback bio generator");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle bio change from text area to create a version
  const handleBioChange = (event: React.FocusEvent<HTMLTextAreaElement>) => {
    // When the textarea loses focus, save the current version if it's different from the active version
    const currentBio = event.target.value;
    const activeVersion = bioVersions.find(v => v.id === activeVersionId);
    
    if (activeVersion && activeVersion.content !== currentBio) {
      saveCurrentVersion('manual');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <FormLabel>Bio</FormLabel>
        <div className="flex space-x-2">
          <VersionSelector 
            versions={bioVersions} 
            onSelectVersion={selectVersion} 
            activeVersionId={activeVersionId}
          />
          <Button 
            type="button" 
            variant="outline" 
            size="sm" 
            onClick={generateBio}
            disabled={isLoading}
          >
            <Sparkles className="h-4 w-4 mr-1" />
            {isLoading ? "Generating with OpenAI..." : "Generate Bio"}
          </Button>
        </div>
      </div>
      <FormField
        control={form.control}
        name="bio"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Textarea 
                {...field} 
                rows={8}
                placeholder="Guest biography" 
                required
                onBlur={handleBioChange}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
