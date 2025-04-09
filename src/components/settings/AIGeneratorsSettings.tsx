
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAIPrompts } from "@/hooks/useAIPrompts";
import { AIGeneratorManager } from "./ai-generators/AIGeneratorManager";

export function AIGeneratorsSettings() {
  const { isLoading } = useAIPrompts();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
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
