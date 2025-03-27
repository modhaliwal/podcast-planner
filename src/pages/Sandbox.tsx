
import { Shell } from '@/components/layout/Shell';
import { Beaker } from 'lucide-react';
import { AIButtonDemo } from '@/components/sandbox/AIButtonDemo';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import EslintRuleTest from '@/components/sandbox/EslintRuleTest';
import { VersionTest } from '@/components/sandbox/VersionTest';

const Sandbox = () => {
  const [showEslintTest, setShowEslintTest] = useState(false);
  const [showVersionTest, setShowVersionTest] = useState(false);
  
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
            <h2 className="text-xl font-semibold mb-4">Component Playground</h2>
            <p className="text-muted-foreground mb-4">
              This area is for experimenting with UI components in isolation before integrating them into the application.
            </p>
            <div className="p-6 bg-secondary/30 rounded-md">
              {/* AI Button Demo Component */}
              <AIButtonDemo />
            </div>
          </div>

          <div className="rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">Feature Testbed</h2>
            <p className="text-muted-foreground mb-4">
              Test new features and functionality without affecting the main application.
            </p>
            <div className="p-4 bg-secondary/30 rounded-md">
              {/* Test buttons */}
              <div className="flex gap-4 mb-4">
                <Button 
                  variant="outline"
                  onClick={() => setShowEslintTest(!showEslintTest)}
                >
                  {showEslintTest ? "Hide" : "Show"} ESLint Rule Test
                </Button>
                
                <Button 
                  variant="outline"
                  onClick={() => setShowVersionTest(!showVersionTest)}
                >
                  {showVersionTest ? "Hide" : "Show"} Version Test
                </Button>
              </div>
              
              {/* ESLint Test */}
              {showEslintTest && (
                <div className="mt-4 p-4 border rounded-md bg-background">
                  <p className="text-sm text-muted-foreground mb-2">
                    This component contains code that should trigger our ESLint rule.
                    Open the browser console to see the errors.
                  </p>
                  <p className="text-sm text-muted-foreground mb-4">
                    Run <code className="bg-muted px-1 py-0.5 rounded">npx eslint src/components/sandbox/EslintRuleTest.tsx</code> to see the ESLint errors.
                  </p>
                  
                  <EslintRuleTest />
                </div>
              )}
              
              {/* Version Test */}
              {showVersionTest && (
                <div className="mt-4 p-4 border rounded-md bg-background">
                  <VersionTest />
                </div>
              )}
              
              {/* Area for testing features */}
              {!showEslintTest && !showVersionTest && (
                <div className="text-center text-muted-foreground">
                  Implement experimental features here
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Shell>
  );
};

export default Sandbox;
