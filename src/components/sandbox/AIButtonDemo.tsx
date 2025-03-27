
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
  const [selectedOptionId, setSelectedOptionId] = useState<string | undefined>(undefined);
  const [options, setOptions] = useState<DropdownOption[]>(mockPromptOptions);
  
  // Example configuration for hover card to demonstrate its functionality
  const hoverCardConfig = {
    aiProvider: "OpenAI GPT-4o",
    promptKey: "content_generation_professional",
    promptTitle: "Professional Content Generation",
    edgeFunctionName: "generate-content"
  };
  
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
    // Just update the selected option, don't generate anything yet
    setSelectedOptionId(option.id);
    toast({
      title: `Option Selected`,
      description: `${option.label} has been selected. Click Generate to apply.`,
    });
  };
  
  const handleClearAllVersions = () => {
    // Clear the options and selected option
    setOptions([]);
    setSelectedOptionId(undefined);
    toast({
      title: "Versions Cleared",
      description: "All versions have been cleared.",
      variant: "destructive"
    });
  };
  
  // Function to reset the options for demo purposes
  const resetOptions = () => {
    setOptions(mockPromptOptions);
    toast({
      title: "Options Reset",
      description: "All options have been restored for demonstration.",
    });
  };
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">AI Generation with Options</h3>
      <p className="text-muted-foreground mb-4">
        This component demonstrates an AI generation button with dropdown options. 
        Hover over the button to see configuration details, click the main button for default generation, 
        or select an option from the dropdown and then click generate.
      </p>
      
      <div className="flex flex-col gap-4">
        <AIGenerationDropdownButton
          buttonLabel="Generate Content"
          loadingLabel="Generating..."
          isGenerating={isGenerating}
          options={options}
          onButtonClick={handleGenerate}
          onOptionSelect={handleOptionSelect}
          onClearAllVersions={handleClearAllVersions}
          showNotification={showNotification}
          selectedOptionId={selectedOptionId}
          hoverCardConfig={hoverCardConfig}
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
        
        {selectedOptionId && (
          <div className="text-sm text-muted-foreground">
            Selected option: {options.find(opt => opt.id === selectedOptionId)?.label}
          </div>
        )}
        
        {options.length === 0 && (
          <button 
            onClick={resetOptions}
            className="text-sm text-blue-500 hover:underline"
          >
            Reset options for demo
          </button>
        )}
      </div>
    </div>
  );
}
