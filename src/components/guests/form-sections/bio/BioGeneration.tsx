
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { v4 as uuidv4 } from 'uuid';
import { ContentVersion } from '@/lib/types';
import { useToast } from '@/components/ui/use-toast';

interface BioGenerationProps {
  bio: string;
  setBio: (bio: string) => void;
  versions: ContentVersion[];
  onVersionsChange: (versions: ContentVersion[]) => void;
}

export function BioGeneration({ bio, setBio, versions, onVersionsChange }: BioGenerationProps) {
  const [loading, setLoading] = useState(false);
  const [bioContent, setBioContent] = useState(bio);
  const { toast } = useToast();
  
  // Simplified generation function without the AI stream
  const handleGenerate = async () => {
    setLoading(true);
    
    try {
      // Simulate AI generation with a delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For now, just use the existing bio with some additions
      const generatedBio = bioContent ? 
        `${bioContent}\n\nAdditional AI-generated content would appear here.` : 
        "This is a placeholder for AI-generated bio content.";
      
      setBioContent(generatedBio);
      setBio(generatedBio);
      
      // Calculate next version number based on existing versions
      const nextVersionNumber = versions.length > 0 
        ? Math.max(...versions.map(v => v.versionNumber || 0)) + 1 
        : 1;
        
      const newVersion: ContentVersion = {
        id: uuidv4(),
        content: generatedBio,
        timestamp: new Date().toISOString(),
        source: "ai",
        versionNumber: nextVersionNumber
      };
      
      onVersionsChange([...versions, newVersion]);
      
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
    <div className="flex flex-col space-y-4">
      <Textarea
        placeholder="AI Generated Bio"
        value={bioContent}
        onChange={(e) => setBioContent(e.target.value)}
        className="min-h-[100px]"
      />
      
      <Button 
        onClick={handleGenerate} 
        disabled={loading}
        className="w-full"
      >
        {loading ? (
          <>
            Generating...
          </>
        ) : (
          <>
            Generate AI Bio
          </>
        )}
      </Button>
    </div>
  );
}
