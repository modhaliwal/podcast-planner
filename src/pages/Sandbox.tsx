
import { Shell } from '@/components/layout/Shell';
import { Beaker } from 'lucide-react';
import { AIButtonDemo } from '@/components/sandbox/AIButtonDemo';

const Sandbox = () => {
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
              {/* Area for testing features */}
              <div className="text-center text-muted-foreground">
                Implement experimental features here
              </div>
            </div>
          </div>
        </div>
      </div>
    </Shell>
  );
};

export default Sandbox;
