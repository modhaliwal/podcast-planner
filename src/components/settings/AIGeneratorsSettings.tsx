
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

export function AIGeneratorsSettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Generators</CardTitle>
        <CardDescription>
          Configure the AI generators used throughout the application
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="rounded-lg border border-dashed p-8 text-center">
          <Sparkles className="mx-auto h-10 w-10 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium">AI Generators Coming Soon</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            The AI generators functionality is being reworked. Check back soon for enhanced AI features.
          </p>
          <Button variant="outline" className="mt-4" disabled>
            Configure AI
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
