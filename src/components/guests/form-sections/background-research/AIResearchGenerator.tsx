
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Wand2 } from 'lucide-react';
import { Guest } from '@/lib/types';

interface AIResearchGeneratorProps {
  guest?: Guest;
  onGenerationComplete: (markdown: string) => void;
}

export function AIResearchGenerator({ guest, onGenerationComplete }: AIResearchGeneratorProps) {
  const [loading, setLoading] = useState(false);
  
  const handleGenerate = async () => {
    if (!guest) {
      toast.error("Missing guest information", {
        description: "Please save the guest first before generating research.",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      // Simulate AI generation with a delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Placeholder generated markdown
      const generatedMarkdown = `# ${guest.name} Research
      
## Background
${guest.name} is ${guest.title || 'a professional'} at ${guest.company || 'their company'}.

## Key Points
- Notable accomplishment 1
- Notable accomplishment 2
- Area of expertise
      
## Potential Questions
1. Question about their background?
2. Question about their expertise?
3. Question about industry trends?
      `;
      
      onGenerationComplete(generatedMarkdown);
      
      toast.success("Research Generated", {
        description: "AI-generated research has been created successfully.",
      });
    } catch (error) {
      console.error("Error generating research:", error);
      toast.error("Generation Error", {
        description: "There was a problem generating the research. Please try again.",
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
        "Researching..."
      ) : (
        <>
          <Wand2 className="h-4 w-4" />
          Research
        </>
      )}
    </Button>
  );
}
