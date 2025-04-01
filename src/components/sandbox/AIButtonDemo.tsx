import React, { useState } from 'react';
import { AIGenerationField } from '@/components/shared/AIGenerationField';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

interface DropdownOption {
  id: string;
  label: string;
  version?: string;
  date?: string;
  source?: string;
}

const AIButtonDemo = () => {
  const options: DropdownOption[] = [
    { id: 'test', label: 'Test Option' },
    { 
      id: 'v1', 
      label: 'Version 1', 
      version: 'V1',
      date: '2023-08-01',
      source: 'AI Generated'
    },
    { 
      id: 'v2', 
      label: 'Version 2', 
      version: 'V2',
      date: '2023-08-15',
      source: 'Manual Input'
    },
  ];
  
  const [editorContent, setEditorContent] = useState('<p>This is some sample content for the <strong>rich text editor</strong>.</p><p>You can now edit this content using the toolbar above.</p><ul><li>Format your text with the toolbar</li><li>Edit the content in the editor</li><li>See the preview in the bottom section</li></ul>');
  const [editorType, setEditorType] = useState<'rich' | 'plain'>('rich');
  
  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">AI Button Demo</h2>
      
      <h3 className="text-lg font-medium mb-2">Text Editor Component</h3>
      <p className="text-muted-foreground mb-4">
        This demonstrates the AIGenerationField with a text editor that can toggle between rich text and plain text.
        The editor now has a fixed layout with a non-resizable preview section.
      </p>
      
      {/* Using AIGenerationField with fixed-size editor */}
      <AIGenerationField 
        options={options}
        onButtonClick={() => console.log('Button clicked')}
        onOptionSelect={(option) => console.log('Option selected', option)}
        showEditor={true}
        editorContent={editorContent}
        onEditorChange={setEditorContent}
        editorPlaceholder="Try typing some content here..."
        onClearAllVersions={() => console.log('Clear all versions')}
        contentName="Episode Introduction"
        editorType={editorType}
        hoverCardConfig={{
          aiProvider: "OpenAI",
          promptKey: "content-generation",
          promptTitle: "Generate Content",
          edgeFunctionName: "generate-content",
          generatorSlug: "episode-notes-generator"
        }}
        generatorSlug="episode-notes-generator"
        generationParameters={{
          topic: "Episode content generation",
          format: "rich-text"
        }}
      />

      <div className="mt-6 pt-6 border-t">
        <h3 className="text-lg font-medium mb-2">Standalone AI Button</h3>
        <p className="text-muted-foreground mb-4">
          This demonstrates the AI button as a standalone component, without the text editor.
        </p>
        
        <Button onClick={() => console.log('AI Button Clicked')} className="gap-2">
          Generate Content
          <Sparkles className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default AIButtonDemo;
