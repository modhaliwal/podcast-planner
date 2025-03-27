
import React, { useState } from 'react';
import { AIGenerationDropdownButton, ContentVersion } from './AIGenerationDropdownButton';

export function VersionTest() {
  const [content, setContent] = useState("<p>This is test content. Clearing versions should not remove this text.</p>");
  const [versions, setVersions] = useState<ContentVersion[]>([
    {
      id: "test-version-1",
      content: "<p>This is test content. Clearing versions should not remove this text.</p>",
      timestamp: new Date().toISOString(),
      source: "manual",
      active: true,
      versionNumber: 1
    }
  ]);
  
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">Version Clear Test</h3>
      <p className="text-muted-foreground">
        This test verifies that clearing versions doesn't clear the editor content.
        Try editing the content, then click the dropdown and "Clear all versions".
      </p>
      
      <AIGenerationDropdownButton
        buttonLabel="Generate Test"
        editorContent={content}
        onEditorChange={setContent}
        editorContentVersions={versions}
        onContentVersionsChange={setVersions}
        options={[]}
        onButtonClick={() => {
          const newVersion = {
            id: `test-${Date.now()}`,
            content: content,
            timestamp: new Date().toISOString(),
            source: "ai" as const,
            active: true,
            versionNumber: versions.length + 1
          };
          
          const updatedVersions = versions.map(v => ({
            ...v,
            active: false
          }));
          
          setVersions([...updatedVersions, newVersion]);
        }}
        onOptionSelect={() => {}}
        onClearAllVersions={() => {
          console.log("Clear all versions called. Currently active version content:", 
            versions.find(v => v.active)?.content || "No active version found");
        }}
        showEditor={true}
        contentName="Test Content"
      />
    </div>
  );
}
