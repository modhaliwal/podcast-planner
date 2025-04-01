
import { Shell } from '@/components/layout/Shell';
import { Beaker, Sparkles } from 'lucide-react';
import { AIGenerationDropdownButton } from '@/components/sandbox/AIGenerationDropdownButton';
import { useState } from 'react';
import { ContentVersion } from '@/lib/types';
import { AIGeneratorPlayground } from '@/components/sandbox/AIGeneratorPlayground';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useGeneratorContent } from '@/components/content/hooks/useGeneratorContent';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormField, FormItem, FormLabel } from '@/components/ui/form';

const Sandbox = () => {
  // State for the rich text editor version
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
  
  // State for the plain text editor version
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
  
  // New form for simplified generator approach
  const simplifiedForm = useForm({
    defaultValues: {
      content: "This content will be processed by the selected AI generator.",
      name: "John Doe",
      company: "Acme Inc.",
      topic: "AI and machine learning"
    }
  });
  
  // Use our new hook for simplified generator approach
  const generatorContent = useGeneratorContent({
    generatorSlug: "episode-notes-generator",
    fieldName: "content",
    form: simplifiedForm,
    parameters: {
      name: simplifiedForm.watch("name"),
      company: simplifiedForm.watch("company"),
      topic: simplifiedForm.watch("topic")
    }
  });
  
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
                    Test the direct approach using a specific generator slug and parameters
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...simplifiedForm}>
                    <div className="space-y-6">
                      <FormField
                        control={simplifiedForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name</FormLabel>
                            <Textarea 
                              placeholder="Enter name" 
                              className="h-10"
                              {...field} 
                            />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={simplifiedForm.control}
                        name="company"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Company</FormLabel>
                            <Textarea 
                              placeholder="Enter company" 
                              className="h-10"
                              {...field} 
                            />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={simplifiedForm.control}
                        name="topic"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Topic</FormLabel>
                            <Textarea 
                              placeholder="Enter topic" 
                              className="h-10"
                              {...field} 
                            />
                          </FormItem>
                        )}
                      />
                      
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
                                disabled={generatorContent.isGenerating}
                              >
                                <Sparkles className="h-4 w-4 mr-2" />
                                {generatorContent.isGenerating ? "Generating..." : "Generate"}
                              </Button>
                            </div>
                            <Textarea 
                              placeholder="Generated content will appear here" 
                              className="min-h-[200px]"
                              {...field} 
                            />
                          </FormItem>
                        )}
                      />
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
                  <AIGenerationDropdownButton
                    buttonLabel="Generate Rich Text"
                    editorContent={richContent}
                    onEditorChange={setRichContent}
                    editorContentVersions={richVersions}
                    onContentVersionsChange={setRichVersions}
                    options={[]}
                    showEditor={true}
                    contentName="Rich Text Content"
                    editorType="rich"
                  />
                </div>
              </div>
              
              <div className="rounded-lg border p-6">
                <h2 className="text-xl font-semibold mb-4">Plain Text Editor Mode</h2>
                <p className="text-muted-foreground mb-4">
                  This version of the component uses the plain text editor mode.
                </p>
                <div className="p-6 bg-secondary/30 rounded-md">
                  <AIGenerationDropdownButton
                    buttonLabel="Generate Plain Text"
                    editorContent={plainContent}
                    onEditorChange={setPlainContent}
                    editorContentVersions={plainVersions}
                    onContentVersionsChange={setPlainVersions}
                    options={[]}
                    showEditor={true}
                    contentName="Plain Text Content"
                    editorType="plain"
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
