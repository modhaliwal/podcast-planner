
import { useState, useEffect } from "react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { FormLabel } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Guest, ContentVersion } from "@/lib/types";
import { useMarkdownParser } from "@/hooks/useMarkdownParser";
import { v4 as uuidv4 } from "uuid";
import { VersionSelector } from "./VersionSelector";

interface BackgroundResearchSectionProps {
  backgroundResearch: string;
  setBackgroundResearch: (value: string) => void;
  backgroundResearchVersions: ContentVersion[];
  onVersionsChange: (versions: ContentVersion[]) => void;
  guest?: Guest;
}

export function BackgroundResearchSection({ 
  backgroundResearch, 
  setBackgroundResearch,
  backgroundResearchVersions = [],
  onVersionsChange,
  guest
}: BackgroundResearchSectionProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [markdownToConvert, setMarkdownToConvert] = useState<string | undefined>();
  const [activeVersionId, setActiveVersionId] = useState<string | undefined>(undefined);
  const parsedHtml = useMarkdownParser(markdownToConvert);

  // Initialize with the current research as the first version if no versions exist
  useEffect(() => {
    if (backgroundResearchVersions.length === 0 && backgroundResearch) {
      const initialVersion: ContentVersion = {
        id: uuidv4(),
        content: backgroundResearch,
        timestamp: new Date().toISOString(),
        source: 'manual'
      };
      onVersionsChange([initialVersion]);
      setActiveVersionId(initialVersion.id);
    } else if (!activeVersionId && backgroundResearchVersions.length > 0) {
      // Set the most recent version as active
      const sortedVersions = [...backgroundResearchVersions].sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
      setActiveVersionId(sortedVersions[0].id);
    }
  }, [backgroundResearchVersions, backgroundResearch, onVersionsChange, activeVersionId]);

  // Update background research when parsedHtml changes
  useEffect(() => {
    if (parsedHtml) {
      // Save current version
      saveCurrentVersion('manual');
      
      // Update content
      setBackgroundResearch(parsedHtml);
      
      // Save as new AI version
      saveCurrentVersion('ai');
      
      setMarkdownToConvert(undefined); // Reset after conversion
    }
  }, [parsedHtml]);

  const handleChange = (content: string) => {
    console.log("Background research changed:", content);
    setBackgroundResearch(content);
  };

  const selectVersion = (version: ContentVersion) => {
    setBackgroundResearch(version.content);
    setActiveVersionId(version.id);
  };

  const saveCurrentVersion = (source: ContentVersion['source'] = 'manual') => {
    // Don't save empty content
    if (!backgroundResearch.trim()) return;
    
    const newVersion: ContentVersion = {
      id: uuidv4(),
      content: backgroundResearch,
      timestamp: new Date().toISOString(),
      source
    };
    
    // Add the new version and update the active version
    const updatedVersions = [...backgroundResearchVersions, newVersion];
    onVersionsChange(updatedVersions);
    setActiveVersionId(newVersion.id);
    
    return newVersion;
  };

  // Handle editor blur to create a version
  const handleEditorBlur = () => {
    const activeVersion = backgroundResearchVersions.find(v => v.id === activeVersionId);
    
    if (activeVersion && activeVersion.content !== backgroundResearch) {
      saveCurrentVersion('manual');
    }
  };

  const handleGenerateResearch = async () => {
    if (!guest || !guest.name || !guest.title) {
      toast.error("Guest information is incomplete. Please ensure name and title are filled out.");
      return;
    }

    try {
      setIsLoading(true);
      toast.info(`Generating research for ${guest.name}...`);

      // Collect the guest information to send
      const guestInfo = {
        name: guest.name,
        title: guest.title,
        company: guest.company || undefined,
        socialLinks: guest.socialLinks || {}
      };

      console.log("Sending guest info to edge function:", guestInfo);

      // Call the Supabase Edge Function to generate research
      const { data, error } = await supabase.functions.invoke("generate-guest-research", {
        body: guestInfo
      });

      console.log("Edge function response:", data, error);

      if (error) {
        throw new Error(error.message || "Error calling edge function");
      }

      if (data && data.research) {
        // Save the current version before updating
        saveCurrentVersion('manual');
        
        // Set the markdown to be converted
        console.log("Research received, converting markdown to HTML...");
        setMarkdownToConvert(data.research);
        toast.success("Research generated successfully!");
      } else {
        toast.error("No research data received from API");
      }
    } catch (error: any) {
      console.error("Error generating research:", error);
      toast.error(`Failed to generate research: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <FormLabel>Background Research</FormLabel>
        <div className="flex space-x-2">
          <VersionSelector 
            versions={backgroundResearchVersions} 
            onSelectVersion={selectVersion} 
            activeVersionId={activeVersionId}
          />
          <Button 
            type="button" 
            variant="outline" 
            size="sm" 
            onClick={handleGenerateResearch}
            disabled={isLoading}
          >
            <Sparkles className="h-4 w-4 mr-1" />
            {isLoading ? "Generating with Perplexity..." : "Generate Background Research"}
          </Button>
        </div>
      </div>
      <ReactQuill
        theme="snow"
        value={backgroundResearch}
        onChange={handleChange}
        onBlur={handleEditorBlur}
        className="bg-background min-h-[200px]"
        placeholder="Add background research notes here..."
      />
    </div>
  );
}
