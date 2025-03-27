
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAIPrompts } from "@/hooks/useAIPrompts";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { LoadingIndicator } from "@/components/ui/loading-indicator";
import { useMarkdownParser } from "@/hooks/useMarkdownParser";

export function AIGeneratorPlayground() {
  const { prompts, isLoading: isLoadingPrompts } = useAIPrompts();
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null);
  const [parametersJson, setParametersJson] = useState('{\n  "name": "John Doe",\n  "title": "Software Engineer",\n  "company": "Tech Corp"\n}');
  const [responseFormat, setResponseFormat] = useState("markdown");
  const [generationResult, setGenerationResult] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [resultMetadata, setResultMetadata] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("result");
  
  const parsedMarkdown = useMarkdownParser(generationResult || "");

  const handleSelectPrompt = (slug: string) => {
    setSelectedPrompt(slug);
  };

  const handleParametersChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setParametersJson(e.target.value);
  };

  const handleResponseFormatChange = (format: string) => {
    setResponseFormat(format);
  };

  const generateContent = async () => {
    if (!selectedPrompt) {
      toast({
        title: "Error",
        description: "Please select an AI generator first",
        variant: "destructive"
      });
      return;
    }

    // Parse JSON parameters
    let parameters;
    try {
      parameters = JSON.parse(parametersJson);
    } catch (error) {
      toast({
        title: "Invalid JSON",
        description: "Please enter valid JSON for parameters",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    setGenerationResult(null);
    setResultMetadata(null);

    try {
      toast({
        title: "Generating content",
        description: `Using ${prompts.find(p => p.slug === selectedPrompt)?.title || "selected generator"}...`
      });

      const { data, error } = await supabase.functions.invoke('generate-with-ai-settings', {
        body: {
          slug: selectedPrompt,
          parameters,
          responseFormat
        }
      });

      if (error) {
        throw error;
      }

      setGenerationResult(data.content);
      setResultMetadata(data.metadata);
      setActiveTab("result");

      toast({
        title: "Content generated",
        description: "AI content has been generated successfully"
      });
    } catch (error: any) {
      console.error("Error generating content:", error);
      toast({
        title: "Generation failed",
        description: error.message || "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const formatJsonString = (jsonString: string) => {
    try {
      const obj = JSON.parse(jsonString);
      return JSON.stringify(obj, null, 2);
    } catch (e) {
      return jsonString;
    }
  };

  useEffect(() => {
    // Select the first generator if available
    if (prompts.length > 0 && !selectedPrompt) {
      setSelectedPrompt(prompts[0].slug);
    }
  }, [prompts, selectedPrompt]);

  if (isLoadingPrompts) {
    return <LoadingIndicator message="Loading AI generators..." />;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>AI Generator Playground</CardTitle>
        <CardDescription>
          Test AI generators with different parameters and formats
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="generator-select">Select AI Generator</Label>
          <Select value={selectedPrompt || ""} onValueChange={handleSelectPrompt}>
            <SelectTrigger>
              <SelectValue placeholder="Select a generator" />
            </SelectTrigger>
            <SelectContent>
              {prompts.map((prompt) => (
                <SelectItem key={prompt.slug} value={prompt.slug}>
                  {prompt.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="parameters">Parameters (JSON)</Label>
          <Textarea
            id="parameters"
            value={parametersJson}
            onChange={handleParametersChange}
            rows={5}
            className="font-mono text-sm"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="response-format">Response Format</Label>
          <Select value={responseFormat} onValueChange={handleResponseFormatChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select format" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="markdown">Markdown</SelectItem>
              <SelectItem value="html">HTML</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button 
          onClick={generateContent} 
          disabled={isGenerating || !selectedPrompt}
          className="w-full"
        >
          {isGenerating ? "Generating..." : "Generate Content"}
        </Button>

        {(generationResult || resultMetadata) && (
          <div className="pt-4 border-t">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="w-full">
                <TabsTrigger value="result" className="flex-1">Result</TabsTrigger>
                <TabsTrigger value="raw" className="flex-1">Raw Response</TabsTrigger>
                {resultMetadata && (
                  <TabsTrigger value="metadata" className="flex-1">Metadata</TabsTrigger>
                )}
              </TabsList>
              
              <TabsContent value="result" className="mt-4">
                <div className="min-h-[300px] border rounded-md p-4 overflow-auto">
                  {responseFormat === 'html' ? (
                    <div dangerouslySetInnerHTML={{ __html: generationResult || "" }} />
                  ) : (
                    <div className="whitespace-pre-wrap font-mono text-sm">
                      {generationResult}
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="raw" className="mt-4">
                <Textarea 
                  readOnly 
                  value={generationResult || ""} 
                  className="w-full min-h-[300px] font-mono text-sm"
                />
              </TabsContent>
              
              {resultMetadata && (
                <TabsContent value="metadata" className="mt-4">
                  <Textarea 
                    readOnly 
                    value={formatJsonString(JSON.stringify(resultMetadata))} 
                    className="w-full min-h-[300px] font-mono text-sm"
                  />
                </TabsContent>
              )}
            </Tabs>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
