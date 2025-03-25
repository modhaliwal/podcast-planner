
import { useState } from "react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { FormLabel } from "@/components/ui/form";

interface BackgroundResearchSectionProps {
  backgroundResearch: string;
  setBackgroundResearch: (value: string) => void;
}

export function BackgroundResearchSection({ 
  backgroundResearch, 
  setBackgroundResearch 
}: BackgroundResearchSectionProps) {
  return (
    <div className="space-y-4">
      <FormLabel>Background Research</FormLabel>
      <ReactQuill
        theme="snow"
        value={backgroundResearch}
        onChange={setBackgroundResearch}
        className="bg-background"
        placeholder="Add background research notes here..."
      />
    </div>
  );
}
