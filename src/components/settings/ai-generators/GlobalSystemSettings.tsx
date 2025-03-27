
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
        const { data, error } = await supabase
          .from('system_settings')
          .select('*')
          .eq('key', 'global_ai_instructions')
          .single();

        if (error && error.code !== 'PGRST116') {
          throw error;
        }

        if (data) {
          setSystemInstructions(data.value || "");
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
      
      const { data, error } = await supabase
        .from('system_settings')
        .upsert(
          {
            key: 'global_ai_instructions',
            value: systemInstructions,
            updated_at: new Date().toISOString()
          },
          { onConflict: 'key' }
        );

      if (error) {
        throw error;
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
