
import React, { useState } from 'react';
// This import should trigger our ESLint rule because it's destructuring from the protected component
import { AIGenerationField, DropdownOption } from '@/components/shared/AIGenerationField';

// This component should trigger the rule because it's trying to create a component 
// that replaces part of the protected component
const AIGenerationFieldHeader = () => {
  return (
    <div>This is a header for the dropdown button</div>
  );
};

// This should be fine as it's using the component as a whole
const TestComponent = () => {
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
      <h2 className="text-xl font-semibold mb-4">ESLint Rule Test</h2>
      
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
        <h3 className="text-lg font-medium mb-2">ESLint Rule Violation Examples</h3>
        
        {/* This should trigger the rule because we're creating a component that includes the protected name */}
        <AIGenerationFieldHeader />
      </div>
    </div>
  );
};

export default TestComponent;
