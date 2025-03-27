
import { Shell } from '@/components/layout/Shell';
import { Beaker } from 'lucide-react';
import { AIGenerationDropdownButton } from '@/components/sandbox/AIGenerationDropdownButton';
import { useState } from 'react';

const Sandbox = () => {
  const [content, setContent] = useState("<p>Test your content here!</p>");
  const [versions, setVersions] = useState([
    {
      id: "initial-version",
      content: "<p>Test your content here!</p>",
      timestamp: new Date().toISOString(),
      source: "manual" as const,
      active: true,
      versionNumber: 1
    }
  ]);
  
  return (
    <Shell>
      <div className="page-container">
        <div className="page-header">
          <div>
            <h1 className="section-title">Sandbox</h1>
            <p className="section-subtitle">Experiment with features before implementing them elsewhere</p>
          </div>
          <Beaker className="h-6 w-6 text-muted-foreground" />
        </div>

        <div className="mt-8 grid gap-8">
          <div className="rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">AIGenerationDropdownButton Demo</h2>
            <p className="text-muted-foreground mb-4">
              This component provides version management for AI-generated content and editor integration.
            </p>
            <div className="p-6 bg-secondary/30 rounded-md">
              <AIGenerationDropdownButton
                buttonLabel="Generate Test"
                editorContent={content}
                onEditorChange={setContent}
                editorContentVersions={versions}
                onContentVersionsChange={setVersions}
                options={[]}
                showEditor={true}
                contentName="Test Content"
              />
            </div>
          </div>
        </div>
      </div>
    </Shell>
  );
};

export default Sandbox;
