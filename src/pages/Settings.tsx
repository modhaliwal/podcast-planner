
import { Shell } from '@/components/layout/Shell';
import { PageLayout } from '@/components/layout/PageLayout';
import { AIGeneratorsSettings } from '@/components/settings/AIGeneratorsSettings';

const Settings = () => {
  return (
    <Shell>
      <PageLayout 
        title="Settings" 
        subtitle="Configure application settings"
      >
        <div className="space-y-6">
          <AIGeneratorsSettings />
        </div>
      </PageLayout>
    </Shell>
  );
};

export default Settings;
