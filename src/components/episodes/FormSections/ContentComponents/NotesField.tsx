
import { useState, useEffect } from "react";
import { Editor } from "@/components/editor/Editor";
import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useFormContext, UseFormReturn } from "react-hook-form";
import { ContentVersion, Guest } from "@/lib/types";
import { v4 as uuidv4 } from "uuid";
import { VersionSelector } from "@/components/guests/form-sections/VersionSelector";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { EpisodeFormValues } from "../../EpisodeFormSchema";

interface NotesFieldProps {
  editMode?: boolean;
  label?: string;
  placeholder?: string;
  form?: UseFormReturn<EpisodeFormValues>;
  guests?: Guest[];
}

export function NotesField({
  editMode = true,
  label = "Episode Notes",
  placeholder = "Add episode notes here...",
  form: formProp,
  guests = [],
}: NotesFieldProps) {
  const formContext = useFormContext();
  const form = formProp || formContext;
  
  const [activeVersionId, setActiveVersionId] = useState<string | null>(null);
  const [versions, setVersions] = useState<ContentVersion[]>([]);
  const [hasInitialized, setHasInitialized] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const fieldName = "notes";
  const versionsFieldName = "notesVersions";

  // Initialize versions if they don't exist
  useEffect(() => {
    if (!hasInitialized) {
      const currentNotes = form.getValues(fieldName);
      const existingVersions = form.getValues(versionsFieldName) || [];

      if (existingVersions.length === 0 && currentNotes) {
        const initialVersion: ContentVersion = {
          id: uuidv4(),
          content: currentNotes,
          timestamp: new Date().toISOString(),
          source: "manual",
        };
        
        // Update both the local state and the form value
        setVersions([initialVersion]);
        form.setValue(versionsFieldName, [initialVersion]);
        setActiveVersionId(initialVersion.id);
      } else if (existingVersions.length > 0) {
        // Set to the most recent version
        const sortedVersions = [...existingVersions].sort(
          (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
        setVersions(sortedVersions);
        setActiveVersionId(sortedVersions[0].id);
      }
      
      setHasInitialized(true);
    }
  }, [form, fieldName, versionsFieldName, hasInitialized]);

  const handleContentChange = (value: string) => {
    form.setValue(fieldName, value);
  };

  const handleEditorBlur = () => {
    const currentContent = form.getValues(fieldName);
    
    // Check if content is not empty and if we have an active version to compare with
    if (currentContent?.trim() && activeVersionId) {
      const activeVersion = versions.find(v => v.id === activeVersionId);
      
      // Only create a new version if content has changed
      if (activeVersion && currentContent !== activeVersion.content) {
        const newVersion: ContentVersion = {
          id: uuidv4(),
          content: currentContent,
          timestamp: new Date().toISOString(),
          source: "manual"
        };
        
        const updatedVersions = [...versions, newVersion];
        setVersions(updatedVersions);
        form.setValue(versionsFieldName, updatedVersions);
        setActiveVersionId(newVersion.id);
      }
    }
  };

  const selectVersion = (version: ContentVersion) => {
    form.setValue(fieldName, version.content);
    setActiveVersionId(version.id);
  };

  const handleClearAllVersions = () => {
    const currentContent = form.getValues(fieldName);
    
    // Create a single version with current content
    const newVersion: ContentVersion = {
      id: uuidv4(),
      content: currentContent || "",
      timestamp: new Date().toISOString(),
      source: "manual"
    };
    
    setVersions([newVersion]);
    form.setValue(versionsFieldName, [newVersion]);
    setActiveVersionId(newVersion.id);
  };

  const generateNotes = async () => {
    try {
      setIsGenerating(true);
      toast.info("Generating episode notes...");
      
      // Get necessary data for generating notes
      const episodeData = {
        title: form.getValues("title"),
        topic: form.getValues("topic"),
        guestIds: form.getValues("guestIds") || []
      };
      
      if (!episodeData.title) {
        toast.warning("Please provide an episode title before generating notes");
        return;
      }
      
      // Call the edge function
      const { data, error } = await supabase.functions.invoke('generate-episode-notes', {
        body: {
          episode: episodeData,
          guests: guests
        }
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      if (data && data.notes) {
        // Create new version with AI-generated notes
        const newVersion: ContentVersion = {
          id: uuidv4(),
          content: data.notes,
          timestamp: new Date().toISOString(),
          source: "ai"
        };
        
        // Update form and state
        form.setValue(fieldName, data.notes);
        
        const updatedVersions = [...versions, newVersion];
        setVersions(updatedVersions);
        form.setValue(versionsFieldName, updatedVersions);
        setActiveVersionId(newVersion.id);
        
        toast.success("Notes generated successfully!");
      } else {
        throw new Error("No notes generated");
      }
    } catch (error: any) {
      console.error("Error generating notes:", error);
      toast.error(`Failed to generate notes: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <FormItem>
      <div className="flex items-center justify-between mb-2">
        <FormLabel>{label}</FormLabel>
        <div className="flex items-center space-x-2">
          {versions.length > 0 && (
            <VersionSelector
              versions={versions}
              onSelectVersion={selectVersion}
              activeVersionId={activeVersionId || undefined}
              onClearAllVersions={handleClearAllVersions}
            />
          )}
          
          {editMode && (
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={generateNotes}
              disabled={isGenerating}
            >
              <Sparkles className="h-4 w-4 mr-1" />
              {isGenerating ? "Generating..." : "Generate Notes"}
            </Button>
          )}
        </div>
      </div>
      <FormControl>
        <Editor
          value={form.getValues(fieldName) || ""}
          onChange={handleContentChange}
          onBlur={handleEditorBlur}
          placeholder={placeholder}
          readOnly={!editMode}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  );
}
