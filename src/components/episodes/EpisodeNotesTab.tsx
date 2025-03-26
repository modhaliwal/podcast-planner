
import { BookText } from 'lucide-react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Episode, ContentVersion } from '@/lib/types';
import { VersionSelector } from '@/components/guests/form-sections/VersionSelector';
import { VersionManager } from '@/components/guests/form-sections/VersionManager';
import { v4 as uuidv4 } from 'uuid';
import { useState, useEffect, useMemo } from 'react';
import { NotesGeneration } from './FormSections/ContentComponents/NotesGeneration';
import { useForm } from 'react-hook-form';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { EpisodeFormValues } from './EpisodeFormSchema';
import { processVersions } from '@/lib/versionUtils';

interface EpisodeNotesContentProps {
  episode: Episode;
}

function EpisodeNotesContent({ episode }: EpisodeNotesContentProps) {
  // Process versions to ensure they have proper structure
  const initialVersions = useMemo(() => {
    return processVersions(episode.notesVersions || []);
  }, [episode.notesVersions]);
  
  const [notes, setNotes] = useState(episode.notes || '');
  const [versions, setVersions] = useState<ContentVersion[]>(initialVersions);
  
  const form = useForm<EpisodeFormValues>({
    defaultValues: {
      title: episode.title || '',
      topic: episode.topic || null,
      guestIds: episode.guestIds || [],
      notes: episode.notes || '',
      notesVersions: initialVersions,
      introduction: episode.introduction || '',
      episodeNumber: episode.episodeNumber || 0,
      scheduled: episode.scheduled || '',
      publishDate: episode.publishDate || null,
      status: episode.status || 'scheduled' as any,
      resources: episode.resources || [],
      coverArt: episode.coverArt || '',
      podcastUrls: {
        spotify: episode.podcastUrls?.spotify || '',
        applePodcasts: episode.podcastUrls?.applePodcasts || '',
        amazonPodcasts: episode.podcastUrls?.amazonPodcasts || '',
        youtube: episode.podcastUrls?.youtube || '',
      },
    }
  });
  
  useEffect(() => {
    setNotes(episode.notes || '');
    setVersions(processVersions(episode.notesVersions || []));
    
    form.reset({
      title: episode.title || '',
      topic: episode.topic || null,
      guestIds: episode.guestIds || [],
      notes: episode.notes || '',
      notesVersions: processVersions(episode.notesVersions || []),
      introduction: episode.introduction || '',
      episodeNumber: episode.episodeNumber || 0,
      scheduled: episode.scheduled || '',
      publishDate: episode.publishDate || null,
      status: episode.status || 'scheduled' as any,
      resources: episode.resources || [],
      coverArt: episode.coverArt || '',
      podcastUrls: {
        spotify: episode.podcastUrls?.spotify || '',
        applePodcasts: episode.podcastUrls?.applePodcasts || '',
        amazonPodcasts: episode.podcastUrls?.amazonPodcasts || '',
        youtube: episode.podcastUrls?.youtube || '',
      },
    });
  }, [episode, form]);
  
  const handleSaveChanges = async (newNotes: string, newVersions: ContentVersion[]) => {
    try {
      setNotes(newNotes);
      setVersions(newVersions);
      
      const { error } = await supabase
        .from('episodes')
        .update({
          notes: newNotes,
          notes_versions: newVersions,
          updated_at: new Date().toISOString()
        })
        .eq('id', episode.id);
        
      if (error) throw error;
      toast({
        title: "Success",
        description: "Notes updated successfully",
      });
    } catch (error: any) {
      console.error('Error saving notes:', error);
      toast({
        title: "Error",
        description: `Failed to save notes: ${error.message}`,
        variant: "destructive",
      });
    }
  };
  
  const handleNotesGenerated = (generatedNotes: string) => {
    setNotes(generatedNotes);
    
    const formValues = form.getValues();
    
    const newVersion: ContentVersion = {
      id: uuidv4(),
      content: generatedNotes,
      timestamp: new Date().toISOString(),
      source: "ai",
      active: true,
      versionNumber: versions.length + 1
    };
    
    const updatedVersions = [
      ...versions.map(v => ({ ...v, active: false })),
      newVersion
    ];
    
    setVersions(updatedVersions);
    handleSaveChanges(generatedNotes, updatedVersions);
  };
  
  return (
    <Card className="shadow-sm border-slate-200 dark:border-slate-700">
      <CardHeader className="bg-slate-50 dark:bg-slate-800 rounded-t-lg border-b border-slate-200 dark:border-slate-700">
        <VersionManager
          content={notes}
          versions={versions}
          onVersionsChange={(newVersions) => {
            setVersions(newVersions);
            handleSaveChanges(notes, newVersions);
          }}
          onContentChange={(newContent) => {
            setNotes(newContent);
            form.setValue('notes', newContent);
            handleSaveChanges(newContent, versions);
          }}
        >
          {({ versionSelectorProps, addNewVersion, hasInitialized }) => (
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-xl">
                <BookText className="h-5 w-5 text-primary" />
                Episode Notes
              </CardTitle>
              
              <div className="flex items-center gap-2">
                {hasInitialized && versionSelectorProps.versions.length > 0 && (
                  <VersionSelector {...versionSelectorProps} />
                )}
                
                {hasInitialized && (
                  <NotesGeneration 
                    guests={[]} // We'll fetch guests in real-time
                    onNotesGenerated={handleNotesGenerated}
                    form={form}
                  />
                )}
              </div>
            </div>
          )}
        </VersionManager>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[calc(100vh-400px)] max-h-[600px]">
          <div className="p-6">
            <div className="prose dark:prose-invert max-w-none">
              {notes ? (
                <div className="rich-text-content" dangerouslySetInnerHTML={{ __html: notes }} />
              ) : (
                <p className="text-slate-500 dark:text-slate-400 italic">No notes added yet</p>
              )}
            </div>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

interface EpisodeNotesTabProps {
  episode: Episode;
}

export function EpisodeNotesTab({ episode }: EpisodeNotesTabProps) {
  return <EpisodeNotesContent episode={episode} />;
}
