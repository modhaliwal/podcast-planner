
import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { LoadingIndicator } from "@/components/ui/loading-indicator";
import { supabase } from "@/integrations/supabase/client";

export function GlobalSystemSettings() {
  const [systemInstructions, setSystemInstructions] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function loadSystemSettings() {
      try {
        setIsLoading(true);
        
        // First check if the table exists by querying it
        const { data: settings, error } = await supabase
          .from('ai_generators')
          .select('*')
          .eq('key', 'global_system_instructions')
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error("Error fetching system settings:", error);
        }

        if (settings) {
          setSystemInstructions(settings.system_prompt || "");
        }
      } catch (error) {
        console.error("Error loading system settings:", error);
        toast({
          title: "Error",
          description: "Failed to load system settings",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    }

    loadSystemSettings();
  }, []);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      // Check if the global_system_instructions entry exists
      const { data: existing, error: fetchError } = await supabase
        .from('ai_generators')
        .select('id')
        .eq('key', 'global_system_instructions')
        .single();
      
      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }

      if (existing) {
        // Update the existing entry
        const { error: updateError } = await supabase
          .from('ai_generators')
          .update({
            system_prompt: systemInstructions,
            updated_at: new Date().toISOString()
          })
          .eq('id', existing.id);

        if (updateError) throw updateError;
      } else {
        // Create a new entry - now including the required slug field
        const { error: insertError } = await supabase
          .from('ai_generators')
          .insert({
            key: 'global_system_instructions',
            slug: 'global-system-instructions',
            title: 'Global System Instructions',
            prompt_text: 'Global system instructions for all AI generators',
            system_prompt: systemInstructions,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });

        if (insertError) throw insertError;
      }

      toast({
        title: "Success",
        description: "Global AI system instructions updated"
      });
    } catch (error) {
      console.error("Error saving system settings:", error);
      toast({
        title: "Error",
        description: "Failed to save system settings",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <LoadingIndicator message="Loading system settings..." />;
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h3 className="text-lg font-medium mb-2">Global AI System Instructions</h3>
        <p className="text-muted-foreground mb-4">
          These instructions will be applied to all AI generators as base system instructions.
          Individual generators can override or extend these instructions as needed.
        </p>
        
        <Label htmlFor="systemInstructions" className="sr-only">Global System Instructions</Label>
        <Textarea
          id="systemInstructions"
          value={systemInstructions}
          onChange={(e) => setSystemInstructions(e.target.value)}
          className="min-h-[300px] font-mono text-sm"
          placeholder="Enter global AI system instructions here..."
        />
        
        <div className="flex justify-end mt-4">
          <Button
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save Global Instructions"}
          </Button>
        </div>
      </div>
    </div>
  );
}
