
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Wand2 } from 'lucide-react';
import { ContentVersion } from '@/lib/types';
import { UseFormReturn } from 'react-hook-form';

interface BioGenerationProps {
  form: UseFormReturn<any>;
  bio: string;
  setBio: (bio: string) => void;
  versions: ContentVersion[];
  onVersionsChange: (versions: ContentVersion[]) => void;
}

export function BioGeneration({ form, bio, setBio, versions, onVersionsChange }: BioGenerationProps) {
  const [loading, setLoading] = useState(false);
  
  // Simplified generation function without the AI stream
  const handleGenerate = async () => {
    setLoading(true);
    
    try {
      // Simulate AI generation with a delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For now, just use the existing bio with some additions
      const generatedBio = bio ? 
        `${bio}\n\nAdditional AI-generated content would appear here.` : 
        "This is a placeholder for AI-generated bio content.";
      
      // Update the form field value
      form.setValue('bio', generatedBio, { shouldDirty: true });
      
      // Also update through the callback for version management
      setBio(generatedBio);
      
      // Show success toast using sonner
      toast.success("Bio Generated", {
        description: "AI-generated bio content has been added.",
      });
    } catch (error) {
      console.error("Error generating bio:", error);
      // Show error toast using sonner
      toast.error("Generation Error", {
        description: "There was a problem generating the bio. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Button 
      onClick={handleGenerate} 
      disabled={loading}
      size="sm"
      className="gap-1"
    >
      {loading ? (
        "Generating..."
      ) : (
        <>
          <Wand2 className="h-4 w-4" />
          Generate
        </>
      )}
    </Button>
  );
}
