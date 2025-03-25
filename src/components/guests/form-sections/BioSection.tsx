
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { Sparkles } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface BioSectionProps {
  form: UseFormReturn<any>;
}

export function BioSection({ form }: BioSectionProps) {
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

  const generateBio = async () => {
    try {
      if (!validateRequiredFields()) {
        return;
      }
      
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
        form.setValue('bio', data.bio);
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
      const fallbackBio = `${name} is a distinguished ${title} with extensive experience ${companyPhrase}. Known for innovative approaches and thought leadership, they have contributed significantly to industry advancements. Their unique perspective and insights make them a valuable voice in current discussions and an engaging podcast guest.`;
      
      form.setValue('bio', fallbackBio);
      toast.info("Used fallback bio generator");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <FormLabel>Bio</FormLabel>
        <Button 
          type="button" 
          variant="outline" 
          size="sm" 
          onClick={generateBio}
        >
          <Sparkles className="h-4 w-4 mr-1" />
          Generate Bio
        </Button>
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
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
