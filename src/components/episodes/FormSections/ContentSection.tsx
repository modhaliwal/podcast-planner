
import { UseFormReturn } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EpisodeFormValues } from '../EpisodeFormSchema';
import { BookText } from 'lucide-react';
import { TopicField } from './ContentComponents/TopicField';
import { IntroductionField } from './ContentComponents/IntroductionField';
import { NotesField } from './ContentComponents/NotesField';
import { Guest } from '@/lib/types';

interface ContentSectionProps {
  form: UseFormReturn<EpisodeFormValues>;
  guests: Guest[];
}

export function ContentSection({ form, guests = [] }: ContentSectionProps) {
  return (
    <Card className="md:col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookText className="h-5 w-5 text-primary" />
          Episode Content
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-12">
        <TopicField form={form} />
        <NotesField form={form} guests={guests} />
        <IntroductionField form={form} />
      </CardContent>
    </Card>
  );
}
