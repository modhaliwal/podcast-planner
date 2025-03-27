
import React, { useState } from 'react';
// This import should trigger our ESLint rule because it's destructuring from the protected component
import { AIGenerationDropdownButton, DropdownOption } from './AIGenerationDropdownButton';

// This component should trigger the rule because it's trying to create a component 
// that replaces part of the protected component
const AIGenerationDropdownButtonHeader = () => {
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
  
  const [editorContent, setEditorContent] = useState('<p>This is some sample content for the <strong>rich text editor</strong>.</p><p>You can now <em>resize</em> this editor to make it larger or smaller!</p><ul><li>Drag the handle below to resize</li><li>Edit the content using the toolbar</li><li>See the preview in the bottom panel</li></ul>');
  
  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">ESLint Rule Test</h2>
      
      <h3 className="text-lg font-medium mb-2">Resizable Rich Text Editor Component</h3>
      <p className="text-muted-foreground mb-4">
        This demonstrates the AIGenerationDropdownButton with a resizable rich text editor.
        The editor starts larger by default now and can be further resized using the handle.
      </p>
      
      {/* This usage should be allowed - with resizable rich text editor */}
      <AIGenerationDropdownButton 
        options={options}
        onButtonClick={() => console.log('Button clicked')}
        onOptionSelect={(option) => console.log('Option selected', option)}
        showEditor={true}
        editorContent={editorContent}
        onEditorChange={setEditorContent}
        editorPlaceholder="Try typing some content here..."
        onClearAllVersions={() => console.log('Clear all versions')}
        contentName="Episode Introduction"
        hoverCardConfig={{
          aiProvider: "OpenAI",
          promptKey: "content-generation",
          promptTitle: "Generate Content",
          edgeFunctionName: "generate-content"
        }}
      />

      <div className="mt-6 pt-6 border-t">
        <h3 className="text-lg font-medium mb-2">ESLint Rule Violation Examples</h3>
        
        {/* This should trigger the rule because we're creating a component that includes the protected name */}
        <AIGenerationDropdownButtonHeader />
      </div>
    </div>
  );
};

export default TestComponent;

