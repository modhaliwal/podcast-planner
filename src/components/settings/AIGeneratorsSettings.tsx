
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAIPrompts } from "@/hooks/useAIPrompts";
import { AIGeneratorManager } from "./ai-generators/AIGeneratorManager";

export function AIGeneratorsSettings() {
  const { isLoading } = useAIPrompts();

  if (isLoading) {
    return null;
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
