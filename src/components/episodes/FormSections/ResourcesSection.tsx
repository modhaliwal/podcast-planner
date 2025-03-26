
import { UseFormReturn } from 'react-hook-form';
import { EpisodeFormValues } from '@/hooks/useEpisodeForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { File, Link, Plus, Trash } from 'lucide-react';
import { useState } from 'react';

interface ResourcesSectionProps {
  form: UseFormReturn<EpisodeFormValues>;
}

export function ResourcesSection({ form }: ResourcesSectionProps) {
  const resources = form.watch('resources') || [];
  
  const addResource = () => {
    const currentResources = form.getValues('resources') || [];
    form.setValue('resources', [
      ...currentResources,
      { label: '', url: '', description: '' }
    ]);
  };
  
  const removeResource = (index: number) => {
    const currentResources = form.getValues('resources') || [];
    form.setValue('resources', 
      currentResources.filter((_, i) => i !== index)
    );
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <File className="h-5 w-5 text-primary" />
          Additional Resources
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground mb-4">
          Add related resources such as articles, books, websites, or other materials relevant to this episode.
        </p>
        
        {resources.map((_, index) => (
          <div key={index} className="grid gap-4 p-4 border rounded-md relative">
            <Button 
              type="button" 
              variant="ghost" 
              size="icon" 
              className="absolute top-2 right-2 h-8 w-8 text-muted-foreground hover:text-destructive"
              onClick={() => removeResource(index)}
            >
              <Trash className="h-4 w-4" />
            </Button>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name={`resources.${index}.label`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Resource Title</FormLabel>
                    <FormControl>
                      <Input placeholder="E.g., Recommended Book, Related Article" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name={`resources.${index}.url`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL</FormLabel>
                    <FormControl>
                      <div className="flex items-center">
                        <Link className="h-4 w-4 mr-2 text-muted-foreground" />
                        <Input placeholder="https://..." {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name={`resources.${index}.description`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Brief description of this resource..." 
                      {...field} 
                      rows={2}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        ))}
        
        <Button
          type="button"
          variant="outline"
          className="w-full mt-2"
          onClick={addResource}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Resource
        </Button>
      </CardContent>
    </Card>
  );
}
