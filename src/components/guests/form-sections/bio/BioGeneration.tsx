import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { useCompletion } from 'ai/react';
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
  
  const {
    completion,
    isLoading: isAIStreamLoading,
    generate,
  } = useCompletion({
    api: '/api/ai/bio',
    onFinish: (text) => {
      setLoading(false);
      setBioContent(text);
      setBio(text);
    },
    onError: (error) => {
      setLoading(false);
      console.error("AI generation error:", error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem generating the bio. Please try again.",
      });
    },
  });
  
  const handleGenerate = async () => {
    setLoading(true);
    
    try {
      await generate(bio);
    } catch (error) {
      console.error("AI generation error:", error);
      setLoading(false);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem generating the bio. Please try again.",
      });
    }
    
    if (bioContent) {
      // Calculate next version number based on existing versions
      const nextVersionNumber = versions.length > 0 
        ? Math.max(...versions.map(v => v.versionNumber || 0)) + 1 
        : 1;
        
      const newVersion: ContentVersion = {
        id: uuidv4(),
        content: bioContent,
        timestamp: new Date().toISOString(),
        source: "ai",
        versionNumber: nextVersionNumber
      };
      
      onVersionsChange([...versions, newVersion]);
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
