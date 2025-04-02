
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Shell } from '@/components/layout/Shell';
import { PageLayout } from '@/components/layout/PageLayout';
import { ProfileSettings } from '@/components/settings/ProfileSettings';
import { AppearanceSettings } from '@/components/settings/AppearanceSettings';
import { AIGeneratorsSettings } from '@/components/settings/AIGeneratorsSettings';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings as SettingsIcon, User, Sparkles } from 'lucide-react';

export default function Settings() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  return (
    <Shell>
      <PageLayout
        title="Settings"
        subtitle="Manage your account and application preferences"
      >
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>Profile</span>
            </TabsTrigger>
            <TabsTrigger value="appearance" className="flex items-center gap-2">
              <SettingsIcon className="h-4 w-4" />
              <span>Appearance</span>
            </TabsTrigger>
            <TabsTrigger value="ai-generators" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              <span>AI Generators</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile">
            <ProfileSettings />
          </TabsContent>
          
          <TabsContent value="appearance">
            <AppearanceSettings />
          </TabsContent>
          
          <TabsContent value="ai-generators">
            <AIGeneratorsSettings />
          </TabsContent>
        </Tabs>
      </PageLayout>
    </Shell>
  );
}
