
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface ParametersSectionProps {
  parameters: string;
  onParametersChange: (value: string) => void;
}

export function ParametersSection({ parameters, onParametersChange }: ParametersSectionProps) {
  const [showJson, setShowJson] = useState(false);
  
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <Label htmlFor="parameters" className="text-base font-semibold">Parameters</Label>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setShowJson(!showJson)}
        >
          {showJson ? "Hide JSON" : "Show JSON"}
        </Button>
      </div>
      
      {showJson && (
        <Textarea
          id="parameters"
          name="parameters"
          value={parameters || '{}'}
          onChange={(e) => onParametersChange(e.target.value)}
          className="mt-1 min-h-[150px] font-mono text-sm"
        />
      )}
      
      <p className="text-muted-foreground text-xs mt-1">
        Define custom parameters that can be used in your prompt with {'{parameter_name}'} syntax
      </p>
    </div>
  );
}
