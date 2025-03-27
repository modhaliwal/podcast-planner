
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { AIGenerationDropdownButton, DropdownOption } from './AIGenerationDropdownButton';

// Mock data for dropdown options
const mockPromptOptions: DropdownOption[] = [
  { 
    id: 'professional', 
    label: 'Professional Style', 
    description: 'Generate content in a formal, professional tone suitable for business applications.',
    version: 'v1.0',
    date: 'May 12, 2024',
    source: 'AI Generated'
  },
  { 
    id: 'casual', 
    label: 'Casual Style', 
    description: 'Generate content with a relaxed, conversational tone.',
    version: 'v2.3',
    date: 'May 14, 2024',
    source: 'Manual Input'
  },
  { 
    id: 'technical', 
    label: 'Technical Style', 
    description: 'Generate content with specialized terminology and technical explanations.',
    version: 'v1.2',
    date: 'May 9, 2024',
    source: 'AI Generated'
  },
  { 
    id: 'creative', 
    label: 'Creative Style', 
    description: 'Generate expressive, imaginative content with colorful language.',
    version: 'v3.0',
    date: 'May 1, 2024',
    source: 'Imported'
  },
  { 
    id: 'concise', 
    label: 'Concise Style', 
    description: 'Generate brief, to-the-point content with minimal elaboration.',
    version: 'v1.0',
    date: 'Apr 25, 2024',
    source: 'Manual Input'
  },
  { 
    id: 'descriptive', 
    label: 'Descriptive Style', 
    description: 'Generate rich, detailed content with vivid descriptions.',
    version: 'v2.1',
    date: 'May 3, 2024',
    source: 'AI Generated'
  },
  { 
    id: 'persuasive', 
    label: 'Persuasive Style', 
    description: 'Generate content designed to convince and influence the reader.',
    version: 'v1.5',
    date: 'Apr 30, 2024',
    source: 'Manual Input'
  },
  { 
    id: 'instructional', 
    label: 'Instructional Style', 
    description: 'Generate how-to content with clear step-by-step guidance.',
    version: 'v2.0',
    date: 'May 7, 2024',
    source: 'Imported'
  },
  { 
    id: 'narrative', 
    label: 'Narrative Style', 
    description: 'Generate content that tells a story or follows a narrative structure.',
    version: 'v1.3',
    date: 'May 10, 2024',
    source: 'AI Generated'
  },
  { 
    id: 'academic', 
    label: 'Academic Style', 
    description: 'Generate scholarly content with formal language and citations.',
    version: 'v2.2',
    date: 'May 5, 2024',
    source: 'Manual Input'
  }
];

export function AIButtonDemo() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showNotification, setShowNotification] = useState(true);
  
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
      
      <div className="flex flex-col gap-4">
        <AIGenerationDropdownButton
          buttonLabel="Generate Content"
          loadingLabel="Generating..."
          isGenerating={isGenerating}
          options={mockPromptOptions}
          onButtonClick={handleGenerate}
          onOptionSelect={handleOptionSelect}
          showNotification={showNotification}
        />
        
        <div className="flex items-center gap-2">
          <label className="text-sm text-muted-foreground">
            <input 
              type="checkbox" 
              className="mr-2" 
              checked={showNotification} 
              onChange={(e) => setShowNotification(e.target.checked)} 
            />
            Show notification with count
          </label>
        </div>
      </div>
    </div>
  );
}
