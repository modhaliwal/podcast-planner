
import { useState } from "react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { FormLabel } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Guest } from "@/lib/types";
import { useMarkdownParser } from "@/hooks/useMarkdownParser";

interface BackgroundResearchSectionProps {
  backgroundResearch: string;
  setBackgroundResearch: (value: string) => void;
  guest?: Guest;
}

export function BackgroundResearchSection({ 
  backgroundResearch, 
  setBackgroundResearch,
  guest
}: BackgroundResearchSectionProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [markdownToConvert, setMarkdownToConvert] = useState<string | undefined>();
  const parsedHtml = useMarkdownParser(markdownToConvert);

  // Update background research when parsedHtml changes
  useState(() => {
    if (parsedHtml) {
      setBackgroundResearch(parsedHtml);
      setMarkdownToConvert(undefined); // Reset after conversion
    }
  });

  const handleChange = (content: string) => {
    console.log("Background research changed:", content);
    setBackgroundResearch(content);
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
      <ReactQuill
        theme="snow"
        value={backgroundResearch}
        onChange={handleChange}
        className="bg-background min-h-[200px]"
        placeholder="Add background research notes here..."
      />
    </div>
  );
}
