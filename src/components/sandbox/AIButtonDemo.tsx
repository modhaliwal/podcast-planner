import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { AIGenerationDropdownButton, DropdownOption } from './AIGenerationDropdownButton';

// Mock data for dropdown options
const mockPromptOptions: DropdownOption[] = [
  { 
    id: 'professional', 
    label: 'Professional Style', 
    version: 'v1.0',
    date: 'May 12, 2024',
    source: 'AI Generated'
  },
  { 
    id: 'casual', 
    label: 'Casual Style', 
    version: 'v2.3',
    date: 'May 14, 2024',
    source: 'Manual Input'
  },
  { 
    id: 'technical', 
    label: 'Technical Style', 
    version: 'v1.2',
    date: 'May 9, 2024',
    source: 'AI Generated'
  },
  { 
    id: 'creative', 
    label: 'Creative Style', 
    version: 'v3.0',
    date: 'May 1, 2024',
    source: 'Imported'
  },
  { 
    id: 'concise', 
    label: 'Concise Style', 
    version: 'v1.0',
    date: 'Apr 25, 2024',
    source: 'Manual Input'
  },
  { 
    id: 'descriptive', 
    label: 'Descriptive Style', 
    version: 'v2.1',
    date: 'May 3, 2024',
    source: 'AI Generated'
  },
  { 
    id: 'persuasive', 
    label: 'Persuasive Style', 
    version: 'v1.5',
    date: 'Apr 30, 2024',
    source: 'Manual Input'
  },
  { 
    id: 'instructional', 
    label: 'Instructional Style', 
    version: 'v2.0',
    date: 'May 7, 2024',
    source: 'Imported'
  },
  { 
    id: 'narrative', 
    label: 'Narrative Style', 
    version: 'v1.3',
    date: 'May 10, 2024',
    source: 'AI Generated'
  },
  { 
    id: 'academic', 
    label: 'Academic Style', 
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
