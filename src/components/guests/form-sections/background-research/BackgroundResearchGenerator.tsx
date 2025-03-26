
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Guest } from '@/lib/types';

export async function generateBackgroundResearch(
  guest: Guest,
  setIsLoading: (value: boolean) => void,
  setMarkdownToConvert: (value: string) => void
) {
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
}
