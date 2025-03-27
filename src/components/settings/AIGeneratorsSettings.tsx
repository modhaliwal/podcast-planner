
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingIndicator } from "@/components/ui/loading-indicator";
import { useAIPrompts } from "@/hooks/useAIPrompts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AIGeneratorManager } from "./ai-generators/AIGeneratorManager";
import { GlobalSystemSettings } from "./ai-generators/GlobalSystemSettings";

export function AIGeneratorsSettings() {
  const { isLoading } = useAIPrompts();
  const [activeTab, setActiveTab] = useState<"list" | "system">("list");

  if (isLoading) {
    return (
      <LoadingIndicator message="Loading AI generators..." />
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Generators</CardTitle>
        <CardDescription>
          Configure the AI generators used throughout the application
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "list" | "system")}>
          <TabsList className="mb-4">
            <TabsTrigger value="list">Generators</TabsTrigger>
            <TabsTrigger value="system">Global Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="list">
            <AIGeneratorManager />
          </TabsContent>
          
          <TabsContent value="system">
            <GlobalSystemSettings />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
