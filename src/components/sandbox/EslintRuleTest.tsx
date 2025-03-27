
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
    { id: 'test', label: 'Test Option' }
  ];
  
  const [editorContent, setEditorContent] = useState('<p>This is some sample content for the rich text editor.</p>');
  
  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">ESLint Rule Test</h2>
      
      <h3 className="text-lg font-medium mb-2">Component with Rich Text Editor</h3>
      <p className="text-muted-foreground mb-4">
        This demonstrates the AIGenerationDropdownButton with an integrated rich text editor
      </p>
      
      {/* This usage should be allowed - with rich text editor visible by default */}
      <AIGenerationDropdownButton 
        options={options}
        onButtonClick={() => console.log('Button clicked')}
        onOptionSelect={(option) => console.log('Option selected', option)}
        showEditor={true}
        editorContent={editorContent}
        onEditorChange={setEditorContent}
        editorPlaceholder="Try typing some content here..."
      />

      <div className="mt-6">
        <h4 className="font-medium mb-2">Editor Content Preview:</h4>
        <div 
          className="p-4 border rounded bg-secondary/20 min-h-[100px]"
          dangerouslySetInnerHTML={{ __html: editorContent }}
        />
      </div>

      <div className="mt-6 pt-6 border-t">
        <h3 className="text-lg font-medium mb-2">ESLint Rule Violation Examples</h3>
        
        {/* This should trigger the rule because we're creating a component that includes the protected name */}
        <AIGenerationDropdownButtonHeader />
      </div>
    </div>
  );
};

export default TestComponent;
