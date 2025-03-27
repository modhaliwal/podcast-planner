
import React, { useState } from 'react';
import { AIGenerationDropdownButton, ContentVersion } from './AIGenerationDropdownButton';

export function AIButtonDemo() {
  const [content, setContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [contentVersions, setContentVersions] = useState<ContentVersion[]>([]);
  
  // Mock versions for demo purposes
  const mockOptions = [
    {
      id: "1",
      label: "Option 1",
      version: "v1",
      date: "2023-06-15",
      source: "Manual Input" as const
    },
    {
      id: "2",
      label: "Option 2",
      version: "v2",
      date: "2023-06-16",
      source: "AI Generated" as const
    }
  ];

  const handleGenerate = () => {
    setIsGenerating(true);
    
    // Simulate AI generation with a delay
    setTimeout(() => {
      const newContent = `Generated content at ${new Date().toLocaleTimeString()}.\n\nThis is a demonstration of the AI generation component with version tracking.\n\nThe component can track multiple versions of content and allows switching between them.`;
      setContent(newContent);
      
      // Create a new version in the versions array
      const newVersion: ContentVersion = {
        id: `version-${Date.now()}`,
        content: newContent,
        timestamp: new Date().toISOString(),
        source: 'ai',
        active: true,
        versionNumber: contentVersions.length + 1
      };
      
      // Set other versions as inactive
      const updatedVersions = contentVersions.map(v => ({
        ...v,
        active: false
      }));
      
      setContentVersions([...updatedVersions, newVersion]);
      setIsGenerating(false);
    }, 1500);
  };

  const handleOptionSelect = (option: any) => {
    console.log("Selected option:", option);
  };

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
  };

  const handleClearAllVersions = () => {
    setContentVersions([]);
    setContent('');
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">AI Generation Button with Version History</h3>
      
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">
          This component demonstrates the AI generation button with content versioning.
          Click "Generate" to create new content versions. Use the dropdown to switch between versions.
        </p>
        
        <AIGenerationDropdownButton
          buttonLabel="Generate"
          loadingLabel="Generating..."
          isGenerating={isGenerating}
          options={mockOptions}
          onButtonClick={handleGenerate}
          onOptionSelect={handleOptionSelect}
          onClearAllVersions={handleClearAllVersions}
          showNotification={true}
          editorContent={content}
          onEditorChange={handleContentChange}
          contentName="AI Generated Content"
          editorContentVersions={contentVersions}
          onContentVersionsChange={setContentVersions}
          hoverCardConfig={{
            aiProvider: "OpenAI",
            promptKey: "content-generation",
            promptTitle: "Standard Content Generator",
          }}
        />
      </div>
    </div>
  );
}
