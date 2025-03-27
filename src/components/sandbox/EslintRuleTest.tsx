
import React from 'react';
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
  
  return (
    <div className="p-4">
      <h2>ESLint Rule Test</h2>
      
      {/* This usage should be allowed */}
      <AIGenerationDropdownButton 
        options={options}
        onButtonClick={() => console.log('Button clicked')}
        onOptionSelect={(option) => console.log('Option selected', option)}
      />

      {/* This should trigger the rule because we're creating a component that includes the protected name */}
      <AIGenerationDropdownButtonHeader />
    </div>
  );
};

export default TestComponent;
