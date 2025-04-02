
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAIPrompts } from '@/hooks/useAIPrompts';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AIGenerationField } from '@/components/shared/AIGenerationField';
import { TextModeSelector } from './TextModeSelector';
import { DynamicParameters } from './DynamicParameters';

export function AIGeneratorPlayground() {
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState('');
  const [mode, setMode] = useState<'text' | 'markdown' | 'html' | 'json'>('text');
  const [parameters, setParameters] = useState<Record<string, any>>({});
  
  const { 
    prompts, 
    generateContent, 
    isLoading,
  } = useAIPrompts();
  
  const promptOptions = prompts?.map(p => ({ 
    label: p.name, 
    value: p.id,
    description: p.description,
    systemPrompt: p.systemPrompt
  })) || [];
  
  if (isLoading) {
    return null;
  }
  
  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a prompt',
        variant: 'destructive'
      });
      return;
    }
    
    setIsGenerating(true);
    
    try {
      const result = await generateContent({
        prompt: prompt,
        promptId: selectedPrompt || undefined,
        parameters
      });
      
      setResult(result || 'No result returned');
    } catch (error: any) {
      console.error('Error generating content:', error);
      toast({
        title: 'Error generating content',
        description: error.message || 'An unknown error occurred',
        variant: 'destructive'
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  const selectedPromptObj = promptOptions.find(p => p.value === selectedPrompt);
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>AI Generator Playground</CardTitle>
        <CardDescription>
          Test your AI generators and see the results in real-time
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="manual" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="manual">Manual Prompt</TabsTrigger>
            <TabsTrigger value="preset">Preset Generators</TabsTrigger>
          </TabsList>
          
          <TabsContent value="manual">
            <div className="space-y-4">
              <Textarea
                placeholder="Enter your prompt here..."
                className="min-h-[100px]"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
              
              <TextModeSelector value={mode} onValueChange={setMode} />
              
              <div className="flex justify-end">
                <Button 
                  onClick={handleGenerate}
                  disabled={isGenerating || !prompt.trim()}
                >
                  {isGenerating ? 'Generating...' : 'Generate'}
                </Button>
              </div>
              
              <div className="border rounded-md p-4 min-h-[200px] bg-muted/30">
                <ScrollArea className="h-[400px]">
                  <AIGenerationField
                    mode={mode}
                    value={result}
                    onChange={setResult}
                    readOnly
                  />
                </ScrollArea>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="preset">
            <div className="space-y-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium">Select Generator</label>
                <select
                  className="w-full border rounded p-2"
                  value={selectedPrompt}
                  onChange={(e) => setSelectedPrompt(e.target.value)}
                >
                  <option value="">Select a generator</option>
                  {promptOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                
                {selectedPromptObj && (
                  <p className="text-sm text-muted-foreground">
                    {selectedPromptObj.description}
                  </p>
                )}
              </div>
              
              {selectedPrompt && (
                <DynamicParameters 
                  parameters={parameters}
                  setParameters={setParameters}
                />
              )}
              
              <TextModeSelector value={mode} onValueChange={setMode} />
              
              <div className="flex justify-end">
                <Button 
                  onClick={handleGenerate}
                  disabled={isGenerating || !selectedPrompt}
                >
                  {isGenerating ? 'Generating...' : 'Generate'}
                </Button>
              </div>
              
              <div className="border rounded-md p-4 min-h-[200px] bg-muted/30">
                <ScrollArea className="h-[400px]">
                  <AIGenerationField
                    mode={mode}
                    value={result}
                    onChange={setResult}
                    readOnly
                  />
                </ScrollArea>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4">
        <p className="text-xs text-muted-foreground">
          Results may vary based on the AI model being used
        </p>
      </CardFooter>
    </Card>
  );
}
