
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/toast';

export interface GeneratorDetails {
  id: string;
  slug: string;
  title?: string;
  ai_model?: string;
  model_name?: string;
}

export function useGeneratorDetails(slug?: string) {
  const [details, setDetails] = useState<GeneratorDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!slug) {
      setDetails(null);
      return;
    }

    const fetchGeneratorDetails = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const { data, error } = await supabase
          .from('ai_generators')
          .select('id, slug, title, ai_model, model_name')
          .eq('slug', slug)
          .single();
        
        if (error) throw error;
        setDetails(data);
      } catch (err: any) {
        console.error('Error fetching generator details:', err);
        setError(err);
        // Don't show toast for this - it's not critical to the user experience
      } finally {
        setIsLoading(false);
      }
    };

    fetchGeneratorDetails();
  }, [slug]);

  return { details, isLoading, error };
}
