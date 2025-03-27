
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingIndicator } from "@/components/ui/loading-indicator";
import { useAIPrompts } from "@/hooks/useAIPrompts";
import { AIGeneratorManager } from "./ai-generators/AIGeneratorManager";

export function AIGeneratorsSettings() {
  const { isLoading } = useAIPrompts();

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
        <AIGeneratorManager />
      </CardContent>
    </Card>
  );
}
