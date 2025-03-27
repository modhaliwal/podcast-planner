
import { Shell } from '@/components/layout/Shell';
import { Beaker } from 'lucide-react';
import { AIGenerationDropdownButton } from '@/components/sandbox/AIGenerationDropdownButton';
import { useState } from 'react';
import { ContentVersion } from '@/lib/types';

const Sandbox = () => {
  // State for the rich text editor version
  const [richContent, setRichContent] = useState("<p>Test your rich text content here!</p>");
  const [richVersions, setRichVersions] = useState<ContentVersion[]>([
    {
      id: "initial-rich-version",
      content: "<p>Test your rich text content here!</p>",
      timestamp: new Date().toISOString(),
      source: "manual" as const,
      active: true,
      versionNumber: 1
    }
  ]);
  
  // State for the plain text editor version
  const [plainContent, setPlainContent] = useState("Test your plain text content here!");
  const [plainVersions, setPlainVersions] = useState<ContentVersion[]>([
    {
      id: "initial-plain-version",
      content: "Test your plain text content here!",
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
            <h2 className="text-xl font-semibold mb-4">Rich Text Editor Mode</h2>
            <p className="text-muted-foreground mb-4">
              This version of the component uses the rich text editor mode.
            </p>
            <div className="p-6 bg-secondary/30 rounded-md">
              <AIGenerationDropdownButton
                buttonLabel="Generate Rich Text"
                editorContent={richContent}
                onEditorChange={setRichContent}
                editorContentVersions={richVersions}
                onContentVersionsChange={setRichVersions}
                options={[]}
                showEditor={true}
                contentName="Rich Text Content"
                editorType="rich"
              />
            </div>
          </div>
          
          <div className="rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">Plain Text Editor Mode</h2>
            <p className="text-muted-foreground mb-4">
              This version of the component uses the plain text editor mode.
            </p>
            <div className="p-6 bg-secondary/30 rounded-md">
              <AIGenerationDropdownButton
                buttonLabel="Generate Plain Text"
                editorContent={plainContent}
                onEditorChange={setPlainContent}
                editorContentVersions={plainVersions}
                onContentVersionsChange={setPlainVersions}
                options={[]}
                showEditor={true}
                contentName="Plain Text Content"
                editorType="plain"
              />
            </div>
          </div>
        </div>
      </div>
    </Shell>
  );
};

export default Sandbox;
