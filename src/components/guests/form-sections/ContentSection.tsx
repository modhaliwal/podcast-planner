
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NotesSection } from "./NotesSection";
import { BioSection } from "./bio";
import { BackgroundResearchSection } from "./background-research";
import { UseFormReturn } from "react-hook-form";
import { Guest } from "@/lib/types";

interface ContentSectionProps {
  form: UseFormReturn<any>;
  guest?: Guest;
}

export function ContentSection({ form, guest }: ContentSectionProps) {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="bio" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="bio">Bio</TabsTrigger>
          <TabsTrigger value="research">Research</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
        </TabsList>
        
        <TabsContent value="bio" className="pt-4">
          <BioSection form={form} guest={guest} />
        </TabsContent>
        
        <TabsContent value="research" className="pt-4">
          <BackgroundResearchSection form={form} guest={guest} />
        </TabsContent>
        
        <TabsContent value="notes" className="pt-4">
          <NotesSection form={form} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
