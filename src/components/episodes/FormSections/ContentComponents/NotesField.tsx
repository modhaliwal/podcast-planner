
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';
import { EpisodeFormValues } from '../../EpisodeFormSchema';
import { Editor } from '@/components/editor/Editor';
import { FileText } from 'lucide-react';
import { useState } from 'react';
import { Guest, ContentVersion } from '@/lib/types';
import { useVersionManager } from '@/hooks/versions';
import { NotesGeneration } from './NotesGeneration';
import { toast } from '@/hooks/toast';
import { ensureVersionNumbers } from '@/hooks/versions';
import { v4 as uuidv4 } from 'uuid';
import { Button } from '@/components/ui/button';
import { NotesEditor, VersionHistory } from '../../notes';
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
  
  // Initialize versions manager
  const { 
    versions, 
    handleContentChange,
    handleEditorBlur,
    isLatestVersionActive,
    activeVersion,
    addVersion,
    selectVersion,
    revertToVersion
  } = useVersionManager({
    content: content,
    versions: formattedVersions,
    onContentChange: (newContent) => {
      setContent(newContent);
      form.setValue('notes', newContent);
    },
    onVersionsChange: (updatedVersions) => {
      form.setValue('notesVersions', updatedVersions);
    }
  });
  
  // Update form values when content changes
  const handleChange = (value: string) => {
    setContent(value);
    handleContentChange();
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
            <Tabs defaultValue="editor" className="w-full">
              <div className="flex justify-between items-center mb-4">
                <TabsList>
                  <TabsTrigger value="editor">Editor</TabsTrigger>
                  <TabsTrigger value="versions">
                    Version History
                    {versions.length > 0 && (
                      <span className="ml-1 rounded-full bg-primary/10 px-2 text-xs">
                        {versions.length}
                      </span>
                    )}
                  </TabsTrigger>
                </TabsList>
                
                <div className="flex items-center space-x-2">
                  <NotesGeneration 
                    guests={guests}
                    onNotesGenerated={(generatedNotes) => {
                      handleChange(generatedNotes);
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
                <NotesEditor 
                  content={content}
                  setContent={setContent}
                  activeVersion={activeVersion}
                  isLatestVersionActive={isLatestVersionActive}
                  onSaveContent={(newContent) => {
                    setContent(newContent);
                    form.setValue('notes', newContent);
                    return addVersion(newContent);
                  }}
                />
              </TabsContent>
              
              <TabsContent value="versions" className="mt-0">
                <VersionHistory 
                  versions={versions}
                  activeVersion={activeVersion}
                  onSelectVersion={selectVersion}
                  onRevertVersion={revertToVersion}
                />
              </TabsContent>
            </Tabs>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
