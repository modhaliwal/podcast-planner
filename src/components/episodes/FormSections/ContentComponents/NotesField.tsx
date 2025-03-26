
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';
import { EpisodeFormValues } from '../../EpisodeFormSchema';
import { Editor } from '@/components/editor/Editor';
import { FileText } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Guest, ContentVersion } from '@/lib/types';
import { VersionManager } from '@/components/guests/form-sections/VersionManager';
import { NotesGeneration } from './NotesGeneration';
import { VersionSelector } from '@/components/guests/form-sections/VersionSelector';
import { toast } from '@/hooks/toast';
import { ensureVersionNumbers } from '@/hooks/versions';
import { v4 as uuidv4 } from 'uuid';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface NotesFieldProps {
  form: UseFormReturn<EpisodeFormValues>;
  guests: Guest[];
}

export function NotesField({ form, guests }: NotesFieldProps) {
  const [content, setContent] = useState(form.watch('notes') || '');
  
  // Make sure versions are properly formatted with required properties
  const initialVersions = form.watch('notesVersions') || [];
  
  // Ensure all versions have required properties before passing to useVersionManager
  // Create formatted versions with all required fields explicitly set
  const formattedVersions = initialVersions.map((version: any) => ({
    id: version.id || uuidv4(), // Ensure id is always present
    content: version.content || '',
    timestamp: version.timestamp || new Date().toISOString(),
    source: version.source || 'manual',
    active: version.active || false,
    versionNumber: version.versionNumber || 1
  })) as ContentVersion[];

  // Update form when content changes outside the VersionManager
  const handleContentUpdate = (newContent: string) => {
    setContent(newContent);
    form.setValue('notes', newContent, { shouldDirty: true });
  };

  // Update form versions when versions change
  const handleVersionsChange = (newVersions: ContentVersion[]) => {
    form.setValue('notesVersions', newVersions, { shouldDirty: true });
  };
  
  return (
    <FormField
      control={form.control}
      name="notes"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-muted-foreground" />
            Notes
          </FormLabel>
          <FormControl>
            <VersionManager 
              content={content}
              versions={formattedVersions}
              onVersionsChange={handleVersionsChange}
              onContentChange={handleContentUpdate}
              source="manual"
            >
              {({ 
                activeVersionId,
                handleEditorBlur,
                handleContentChange,
                selectVersion,
                addNewVersion,
                addAIVersion,
                clearAllVersions,
                versionSelectorProps,
                hasInitialized
              }) => (
                <Tabs defaultValue="editor" className="w-full">
                  <div className="flex justify-between items-center mb-4">
                    <TabsList>
                      <TabsTrigger value="editor">Editor</TabsTrigger>
                      <TabsTrigger value="versions">
                        Version History
                        {formattedVersions.length > 0 && (
                          <span className="ml-1 rounded-full bg-primary/10 px-2 text-xs">
                            {formattedVersions.length}
                          </span>
                        )}
                      </TabsTrigger>
                    </TabsList>
                    
                    <div className="flex items-center space-x-2">
                      {formattedVersions.length > 0 && (
                        <VersionSelector {...versionSelectorProps} />
                      )}
                      <NotesGeneration 
                        guests={guests}
                        onNotesGenerated={(generatedNotes) => {
                          handleContentUpdate(generatedNotes);
                          addAIVersion(generatedNotes);
                          toast({
                            title: "Success",
                            description: "AI-generated notes added",
                          });
                        }}
                        form={form}
                      />
                    </div>
                  </div>
                  
                  <TabsContent value="editor" className="mt-0">
                    <Editor
                      value={content}
                      onChange={(value) => {
                        setContent(value);
                        form.setValue('notes', value, { shouldDirty: true });
                      }}
                      onBlur={handleEditorBlur}
                      placeholder="Add episode notes here..."
                    />
                  </TabsContent>
                  
                  <TabsContent value="versions" className="mt-0">
                    {formattedVersions.length === 0 ? (
                      <div className="p-4 text-center text-muted-foreground border rounded-md">
                        No versions saved yet. Save your first version to start tracking changes.
                      </div>
                    ) : (
                      <div className="rounded-md border">
                        <div className="p-4">
                          <h3 className="font-medium">Version History</h3>
                          <p className="text-sm text-muted-foreground">
                            View and restore previous versions of your notes.
                          </p>
                        </div>
                        <div className="border-t">
                          {formattedVersions.map((version, index) => {
                            const isActive = version.id === activeVersionId;
                            
                            return (
                              <div 
                                key={version.id} 
                                className={`flex p-4 border-b last:border-b-0 ${isActive ? 'bg-muted/50' : ''}`}
                              >
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <h4 className="text-sm font-medium">
                                      Version {version.versionNumber || index + 1}
                                      {isActive && (
                                        <span className="ml-2 text-xs text-primary">(Current)</span>
                                      )}
                                    </h4>
                                    <span className="text-xs text-muted-foreground">
                                      {new Date(version.timestamp).toLocaleString()}
                                    </span>
                                  </div>
                                  <div className="mt-1 text-xs text-muted-foreground line-clamp-3">
                                    {version.content.substring(0, 150)}...
                                  </div>
                                </div>
                                <div className="ml-4 flex items-center">
                                  {!isActive && (
                                    <button
                                      type="button"
                                      className="text-sm text-primary hover:underline"
                                      onClick={() => selectVersion(version)}
                                    >
                                      Select
                                    </button>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              )}
            </VersionManager>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
