
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { AIGenerationDropdownButton, DropdownOption } from './AIGenerationDropdownButton';

// Mock data for dropdown options
const mockPromptOptions: DropdownOption[] = [
  { 
    id: 'professional', 
    label: 'Professional Style', 
    description: 'Generate content in a formal, professional tone suitable for business applications.'
  },
  { 
    id: 'casual', 
    label: 'Casual Style', 
    description: 'Generate content with a relaxed, conversational tone.'
  },
  { 
    id: 'technical', 
    label: 'Technical Style', 
    description: 'Generate content with specialized terminology and technical explanations.'
  },
  { 
    id: 'creative', 
    label: 'Creative Style', 
    description: 'Generate expressive, imaginative content with colorful language.'
  },
  { 
    id: 'concise', 
    label: 'Concise Style', 
    description: 'Generate brief, to-the-point content with minimal elaboration.'
  },
  { 
    id: 'descriptive', 
    label: 'Descriptive Style', 
    description: 'Generate rich, detailed content with vivid descriptions.'
  },
  { 
    id: 'persuasive', 
    label: 'Persuasive Style', 
    description: 'Generate content designed to convince and influence the reader.'
  },
  { 
    id: 'instructional', 
    label: 'Instructional Style', 
    description: 'Generate how-to content with clear step-by-step guidance.'
  },
  { 
    id: 'narrative', 
    label: 'Narrative Style', 
    description: 'Generate content that tells a story or follows a narrative structure.'
  },
  { 
    id: 'academic', 
    label: 'Academic Style', 
    description: 'Generate scholarly content with formal language and citations.'
  }
];

export function AIButtonDemo() {
  const [isGenerating, setIsGenerating] = useState(false);
  
  const handleGenerate = () => {
    setIsGenerating(true);
    
    // Simulate generation process
    setTimeout(() => {
      setIsGenerating(false);
      toast({
        title: "Content Generated",
        description: "Default content has been generated successfully.",
      });
    }, 1500);
  };
  
  const handleOptionSelect = (option: DropdownOption) => {
    setIsGenerating(true);
    
    // Simulate generation process with selected option
    setTimeout(() => {
      setIsGenerating(false);
      toast({
        title: `${option.label} Applied`,
        description: `Content generated using the ${option.label.toLowerCase()} approach.`,
      });
    }, 1500);
  };
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">AI Generation with Options</h3>
      <p className="text-muted-foreground mb-4">
        This component demonstrates an AI generation button with dropdown options. 
        Click the main button for default generation or use the dropdown for specialized options.
      </p>
      
      <AIGenerationDropdownButton
        buttonLabel="Generate Content"
        loadingLabel="Generating..."
        isGenerating={isGenerating}
        options={mockPromptOptions}
        onButtonClick={handleGenerate}
        onOptionSelect={handleOptionSelect}
      />
    </div>
  );
}
