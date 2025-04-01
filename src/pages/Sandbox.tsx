import { Shell } from '@/components/layout/Shell';
import { Beaker, Sparkles } from 'lucide-react';
import { AIGenerationField } from '@/components/shared/AIGenerationField';
import { useState, useEffect } from 'react';
import { ContentVersion } from '@/lib/types';
import { AIGeneratorPlayground } from '@/components/sandbox/AIGeneratorPlayground';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useGeneratorContent } from '@/components/content/hooks/useGeneratorContent';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { useAIPrompts } from '@/hooks/useAIPrompts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DynamicParameters } from '@/components/sandbox/DynamicParameters';
import { Separator } from '@/components/ui/separator';
import { TextModeSelector } from '@/components/sandbox/TextModeSelector';
import { RichTextEditor } from '@/components/sandbox/RichTextEditor';

const Sandbox = () => {
  // Fetch available AI generators
  const { prompts: generators, isLoading: loadingGenerators } = useAIPrompts();
  const [selectedGeneratorSlug, setSelectedGeneratorSlug] = useState<string>("");
  const [selectedGenerator, setSelectedGenerator] = useState<any>(null);
  const [textMode, setTextMode] = useState<"plain" | "rich">("plain");
  
  // State for the rich text editor version (keeping existing functionality)
  const [richContent, setRichContent] = useState("<p>Test your rich text content here!</p>");
  const [richVersions, setRichVersions] = useState<ContentVersion[]>([
    {
      id: "initial-rich-version",
      content: "<p>Test your rich text content here!</p>",
      timestamp: new Date().toISOString(),
      source: "manual" as const,
      active: true,
      versionNumber: 1
    }
  ]);
  
  // State for the plain text editor version (keeping existing functionality)
  const [plainContent, setPlainContent] = useState("Test your plain text content here!");
  const [plainVersions, setPlainVersions] = useState<ContentVersion[]>([
    {
      id: "initial-plain-version",
      content: "Test your plain text content here!",
      timestamp: new Date().toISOString(),
      source: "manual" as const,
      active: true,
      versionNumber: 1
    }
  ]);
  
  // Form for the simplified generator approach
  const simplifiedForm = useForm({
    defaultValues: {
      content: "This content will be processed by the selected AI generator.",
      parameters: "{}"
    }
  });
  
  // Parse parameters from JSON string
  const [parsedParameters, setParsedParameters] = useState<Record<string, any>>({});

  // Update parsed parameters when form parameters change
  useEffect(() => {
    try {
      const paramsString = simplifiedForm.watch("parameters");
      if (paramsString) {
        const params = JSON.parse(paramsString);
        setParsedParameters(params);
      } else {
        setParsedParameters({});
      }
    } catch (error) {
      console.error("Error parsing parameters:", error);
      setParsedParameters({});
    }
  }, [simplifiedForm.watch("parameters")]);
  
  // Set a default generator when the data loads
  useEffect(() => {
    if (generators.length > 0 && !selectedGeneratorSlug) {
      const defaultGenerator = generators[0];
      setSelectedGeneratorSlug(defaultGenerator.slug);
      setSelectedGenerator(defaultGenerator);
    }
  }, [generators, selectedGeneratorSlug]);
  
  // Update selected generator when slug changes
  useEffect(() => {
    if (selectedGeneratorSlug && generators.length > 0) {
      const generator = generators.find(g => g.slug === selectedGeneratorSlug);
      if (generator) {
        setSelectedGenerator(generator);
        // Reset parameters when generator changes
        simplifiedForm.setValue('parameters', '{}');
      }
    }
  }, [selectedGeneratorSlug, generators, simplifiedForm]);
  
  // Use the generator content hook with the selected generator
  const generatorContent = useGeneratorContent({
    generatorSlug: selectedGeneratorSlug,
    fieldName: "content",
    form: simplifiedForm,
    parameters: parsedParameters,
    responseFormat: textMode === 'rich' ? 'html' : 'markdown'
  });
  
  // Handle generator selection
  const handleGeneratorChange = (slug: string) => {
    setSelectedGeneratorSlug(slug);
  };

  // Handle text mode change
  const handleTextModeChange = (mode: "plain" | "rich") => {
    setTextMode(mode);
  };
  
  return (
    <Shell>
      <div className="page-container">
        <div className="page-header">
          <div>
            <h1 className="section-title">Sandbox</h1>
            <p className="section-subtitle">Experiment with features before implementing them elsewhere</p>
          </div>
          <Beaker className="h-6 w-6 text-muted-foreground" />
        </div>

        <Tabs defaultValue="simple-generator" className="mt-8">
          <TabsList className="mb-4">
            <TabsTrigger value="simple-generator">Simplified Generator</TabsTrigger>
            <TabsTrigger value="ai-generators">AI Generator Playground</TabsTrigger>
            <TabsTrigger value="ai-dropdown">AI Dropdown Tests</TabsTrigger>
          </TabsList>
          
          <TabsContent value="simple-generator">
            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Simplified Generator Demo</CardTitle>
                  <CardDescription>
                    Test different AI generators with their specific parameters
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...simplifiedForm}>
                    <div className="space-y-6">
                      {/* Generator Selector */}
                      <div className="space-y-2">
                        <FormLabel>Select Generator</FormLabel>
                        <Select
                          value={selectedGeneratorSlug}
                          onValueChange={handleGeneratorChange}
                          disabled={loadingGenerators}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder={loadingGenerators ? "Loading generators..." : "Select a generator"} />
                          </SelectTrigger>
                          <SelectContent>
                            {generators.map((generator) => (
                              <SelectItem key={generator.slug} value={generator.slug}>
                                {generator.title}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        
                        {selectedGenerator && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {selectedGenerator.prompt_text?.substring(0, 100)}...
                          </p>
                        )}
                      </div>
                      
                      {/* Text Mode Selector */}
                      <TextModeSelector 
                        mode={textMode} 
                        onModeChange={handleTextModeChange} 
                      />
                      
                      {/* Dynamic Parameters */}
                      {selectedGenerator && (
                        <DynamicParameters 
                          generator={selectedGenerator} 
                          form={simplifiedForm} 
                        />
                      )}
                      
                      {/* Generated Content Field */}
                      <FormField
                        control={simplifiedForm.control}
                        name="content"
                        render={({ field }) => (
                          <FormItem>
                            <div className="flex items-center justify-between mb-2">
                              <FormLabel>Generated Content</FormLabel>
                              <Button
                                type="button"
                                size="sm"
                                onClick={() => generatorContent.generateContent()}
                                disabled={generatorContent.isGenerating || !selectedGeneratorSlug}
                              >
                                <Sparkles className="h-4 w-4 mr-2" />
                                {generatorContent.isGenerating ? "Generating..." : "Generate"}
                              </Button>
                            </div>
                            
                            {textMode === "plain" ? (
                              <Textarea 
                                placeholder="Generated content will appear here" 
                                className="min-h-[200px]"
                                {...field} 
                              />
                            ) : (
                              <RichTextEditor 
                                value={field.value || ""}
                                onChange={field.onChange}
                              />
                            )}
                          </FormItem>
                        )}
                      />
                      
                      {/* Display system prompt if available */}
                      {generatorContent.systemPrompt && (
                        <div className="space-y-2">
                          <FormLabel>System Prompt</FormLabel>
                          <div className="bg-secondary/30 p-4 rounded-md whitespace-pre-wrap">
                            <pre className="text-sm font-mono">{generatorContent.systemPrompt}</pre>
                          </div>
                        </div>
                      )}
                      
                      {/* Display the used prompt */}
                      {generatorContent.usedPrompt && (
                        <div className="space-y-2">
                          <FormLabel>Used Prompt</FormLabel>
                          <div className="bg-secondary/30 p-4 rounded-md whitespace-pre-wrap">
                            <pre className="text-sm font-mono">{generatorContent.usedPrompt}</pre>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            This is the formatted prompt sent to the AI model after parameter replacement.
                          </p>
                        </div>
                      )}
                    </div>
                  </Form>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="ai-generators">
            <div className="rounded-lg">
              <AIGeneratorPlayground />
            </div>
          </TabsContent>
          
          <TabsContent value="ai-dropdown">
            <div className="grid gap-8">
              <div className="rounded-lg border p-6">
                <h2 className="text-xl font-semibold mb-4">Rich Text Editor Mode</h2>
                <p className="text-muted-foreground mb-4">
                  This version of the component uses the rich text editor mode.
                </p>
                <div className="p-6 bg-secondary/30 rounded-md">
                  <AIGenerationField
                    buttonLabel="Generate Rich Text"
                    editorContent={richContent}
                    onEditorChange={setRichContent}
                    editorContentVersions={richVersions}
                    onContentVersionsChange={setRichVersions}
                    showEditor={true}
                    contentName="Rich Text Content"
                    editorType="rich"
                    hoverCardConfig={{
                      aiProvider: "OpenAI",
                      promptKey: "rich_text_demo",
                      promptTitle: "Rich Text Demo Generator",
                      generatorSlug: "random-idea"
                    }}
                    generatorSlug="random-idea"
                    generationParameters={{
                      topic: "Rich text content generation"
                    }}
                  />
                </div>
              </div>
              
              <div className="rounded-lg border p-6">
                <h2 className="text-xl font-semibold mb-4">Plain Text Editor Mode</h2>
                <p className="text-muted-foreground mb-4">
                  This version of the component uses the plain text editor mode.
                </p>
                <div className="p-6 bg-secondary/30 rounded-md">
                  <AIGenerationField
                    buttonLabel="Generate Plain Text"
                    editorContent={plainContent}
                    onEditorChange={setPlainContent}
                    editorContentVersions={plainVersions}
                    onContentVersionsChange={setPlainVersions}
                    showEditor={true}
                    contentName="Plain Text Content"
                    editorType="plain"
                    hoverCardConfig={{
                      aiProvider: "Perplexity",
                      promptKey: "plain_text_demo",
                      promptTitle: "Plain Text Demo Generator",
                      generatorSlug: "episode-notes-generator"
                    }}
                    generatorSlug="episode-notes-generator"
                    generationParameters={{
                      topic: "Plain text content generation"
                    }}
                  />
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Shell>
  );
};

export default Sandbox;
