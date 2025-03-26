
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Wand2 } from 'lucide-react';
import { ContentVersion } from '@/lib/types';

interface BioGenerationProps {
  bio: string;
  setBio: (bio: string) => void;
  versions: ContentVersion[];
  onVersionsChange: (versions: ContentVersion[]) => void;
}

export function BioGeneration({ bio, setBio, versions, onVersionsChange }: BioGenerationProps) {
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
      
      setBio(generatedBio);
      
      toast({
        title: "Bio Generated",
        description: "AI-generated bio content has been added.",
      });
    } catch (error) {
      console.error("Error generating bio:", error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
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
