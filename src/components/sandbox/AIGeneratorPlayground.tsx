
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
  const [promptPreview, setPromptPreview] = useState<any>(null);
  const [processedPrompt, setProcessedPrompt] = useState<string | null>(null);
  
  const parsedMarkdown = useMarkdownParser(generationResult || "");

  const handleSelectPrompt = (slug: string) => {
    setSelectedPrompt(slug);
    // Reset processed prompt when changing generators
    setProcessedPrompt(null);
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
    setProcessedPrompt(null);

    try {
      const selectedGenerator = prompts.find(p => p.slug === selectedPrompt);
      toast({
        title: "Generating content",
        description: `Using ${selectedGenerator?.title || "selected generator"}...`
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
      
      // Store the processed prompt if available
      if (data.metadata && data.metadata.processedPrompt) {
        setProcessedPrompt(data.metadata.processedPrompt);
      }
      
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

  const generatePromptPreview = () => {
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

    // Get the selected generator
    const selectedGenerator = prompts.find(p => p.slug === selectedPrompt);
    if (!selectedGenerator) {
      toast({
        title: "Error",
        description: "Generator not found",
        variant: "destructive"
      });
      return;
    }

    // Determine provider and model based on settings
    const provider = determineProvider(selectedGenerator);
    const model = determineModel(selectedGenerator);

    // Create preview data
    const preview = {
      request: {
        slug: selectedPrompt,
        parameters,
        responseFormat,
      },
      generator: {
        title: selectedGenerator.title,
        key: selectedGenerator.key || "generic",
        system_prompt: selectedGenerator.system_prompt || "You are a helpful assistant.",
        prompt_text: selectedGenerator.prompt_text,
        context_instructions: selectedGenerator.context_instructions,
      },
      execution: {
        provider: provider,
        model: model,
      },
      processedPrompt: processPromptWithParameters(selectedGenerator.prompt_text, parameters)
    };

    setPromptPreview(preview);
    setActiveTab("preview");

    toast({
      title: "Prompt preview generated",
      description: "You can see how the request will be processed"
    });
  };

  // Helper function to determine the AI provider based on generator settings
  const determineProvider = (generator: any): string => {
    if (generator.ai_model === 'perplexity') return 'Perplexity AI';
    if (generator.ai_model === 'claude') return 'Anthropic Claude';
    if (generator.ai_model === 'gemini') return 'Google Gemini';
    // Default to OpenAI
    return 'OpenAI';
  };

  // Helper function to determine the model based on generator settings
  const determineModel = (generator: any): string => {
    // Return specific model if defined
    if (generator.model_name) return generator.model_name;
    
    // Default models based on the provider
    if (generator.ai_model === 'perplexity') return 'llama-3.1-sonar-small-128k';
    if (generator.ai_model === 'claude') return 'claude-3-opus';
    if (generator.ai_model === 'gemini') return 'gemini-pro';
    
    // Default OpenAI model
    return 'gpt-4o';
  };

  // Simple function to replace parameters in the prompt text
  const processPromptWithParameters = (promptText: string, params: Record<string, any>) => {
    let processedText = promptText;
    
    Object.entries(params).forEach(([key, value]) => {
      const placeholder = `{${key}}`;
      // Convert objects to strings if needed
      const valueStr = typeof value === 'object' ? JSON.stringify(value) : String(value);
      processedText = processedText.replace(new RegExp(placeholder, 'g'), valueStr);
    });
    
    return processedText;
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

        <div className="flex gap-2">
          <Button 
            onClick={generateContent} 
            disabled={isGenerating || !selectedPrompt}
            className="flex-1"
          >
            {isGenerating ? "Generating..." : "Generate Content"}
          </Button>
          
          <Button 
            onClick={generatePromptPreview} 
            variant="outline"
            disabled={!selectedPrompt}
            className="flex-1"
          >
            Generate Prompt
          </Button>
        </div>

        {/* Display Processed Prompt if available */}
        {processedPrompt && (
          <div className="pt-4 border-t">
            <Label htmlFor="processed-prompt">Used Prompt</Label>
            <div className="mt-2 bg-secondary/30 p-4 rounded-md whitespace-pre-wrap">
              <pre className="text-sm font-mono">{processedPrompt}</pre>
            </div>
          </div>
        )}

        {(generationResult || resultMetadata || promptPreview) && (
          <div className="pt-4 border-t">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="w-full">
                <TabsTrigger value="result" className="flex-1">Result</TabsTrigger>
                <TabsTrigger value="raw" className="flex-1">Raw Response</TabsTrigger>
                <TabsTrigger value="preview" className="flex-1">Prompt Preview</TabsTrigger>
                {resultMetadata && (
                  <TabsTrigger value="metadata" className="flex-1">Metadata</TabsTrigger>
                )}
              </TabsList>
              
              <TabsContent value="result" className="mt-4">
                <div className="min-h-[300px] border rounded-md p-4 overflow-auto">
                  {responseFormat === 'html' && generationResult ? (
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
              
              <TabsContent value="preview" className="mt-4">
                {promptPreview ? (
                  <div className="space-y-4">
                    <div className="border rounded-md p-4">
                      <h3 className="text-lg font-medium mb-2">Request Configuration</h3>
                      <pre className="bg-secondary/30 p-3 rounded text-sm whitespace-pre-wrap overflow-x-auto">
                        {JSON.stringify({
                          slug: promptPreview.request.slug,
                          parameters: promptPreview.request.parameters,
                          responseFormat: promptPreview.request.responseFormat
                        }, null, 2)}
                      </pre>
                    </div>
                    
                    <div className="border rounded-md p-4">
                      <h3 className="text-lg font-medium mb-2">Generator Details</h3>
                      <div className="space-y-2">
                        <div>
                          <span className="font-semibold">Title:</span> {promptPreview.generator.title}
                        </div>
                        <div>
                          <span className="font-semibold">Key:</span> {promptPreview.generator.key}
                        </div>
                        <div className="space-y-1">
                          <span className="font-semibold">System Prompt:</span>
                          <pre className="bg-secondary/30 p-3 rounded text-sm whitespace-pre-wrap overflow-x-auto">
                            {promptPreview.generator.system_prompt}
                          </pre>
                        </div>
                        {promptPreview.generator.context_instructions && (
                          <div className="space-y-1">
                            <span className="font-semibold">Context Instructions:</span>
                            <pre className="bg-secondary/30 p-3 rounded text-sm whitespace-pre-wrap overflow-x-auto">
                              {promptPreview.generator.context_instructions}
                            </pre>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="border rounded-md p-4">
                      <h3 className="text-lg font-medium mb-2">AI Provider Information</h3>
                      <div className="space-y-2">
                        <div>
                          <span className="font-semibold">Provider:</span> {promptPreview.execution.provider}
                        </div>
                        <div>
                          <span className="font-semibold">Model:</span> {promptPreview.execution.model}
                        </div>
                      </div>
                    </div>
                    
                    <div className="border rounded-md p-4">
                      <h3 className="text-lg font-medium mb-2">Processed Prompt</h3>
                      <pre className="bg-secondary/30 p-3 rounded text-sm whitespace-pre-wrap overflow-x-auto">
                        {promptPreview.processedPrompt}
                      </pre>
                    </div>
                  </div>
                ) : (
                  <div className="text-center p-8 text-muted-foreground">
                    Click "Generate Prompt" to see how the request will be processed
                  </div>
                )}
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
};
