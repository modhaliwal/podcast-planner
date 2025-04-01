
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface TextModeSelectorProps {
  mode: "plain" | "rich";
  onModeChange: (mode: "plain" | "rich") => void;
}

export function TextModeSelector({ mode, onModeChange }: TextModeSelectorProps) {
  return (
    <div className="space-y-2">
      <Label>Content Format</Label>
      <RadioGroup 
        value={mode} 
        onValueChange={(value) => onModeChange(value as "plain" | "rich")}
        className="flex gap-4"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="plain" id="plain" />
          <Label htmlFor="plain" className="cursor-pointer">Plain Text</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="rich" id="rich" />
          <Label htmlFor="rich" className="cursor-pointer">Rich Text</Label>
        </div>
      </RadioGroup>
    </div>
  );
}
