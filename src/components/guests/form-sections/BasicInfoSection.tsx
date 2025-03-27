
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { FormActions } from "@/components/ui/form-actions";
import { useFormContext } from "react-hook-form";
import { ContentGenerator } from "@/components/content/ContentGenerator";

interface BasicInfoSectionProps {
  isSubmitting: boolean;
  cancelHref?: string;
}

export function BasicInfoSection({ isSubmitting, cancelHref }: BasicInfoSectionProps) {
  const { control, setValue, getValues } = useFormContext();
  const [generating, setGenerating] = useState(false);
  const name = getValues("name");

  return (
    <>
      <div className="grid gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" placeholder="Full name" {...control._fields.name} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" placeholder="Title" {...control._fields.title} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="company">Company</Label>
            <Input id="company" placeholder="Company" {...control._fields.company} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" placeholder="Email" type="email" {...control._fields.email} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" placeholder="Phone" type="tel" {...control._fields.phone} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Input id="status" placeholder="Status" {...control._fields.status} />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="bio">Bio</Label>
            <ContentGenerator
              config={{
                fieldName: "bio",
                promptKey: "guest_bio",
                buttonLabel: generating ? "Generating..." : "Generate Bio",
                loadingLabel: "Generating bio...",
                edgeFunctionName: "generate-content",
                generationType: "bio",
              }}
              form={{ control, setValue, getValues }}
            />
          </div>
          <Textarea id="bio" placeholder="Bio" className="min-h-[100px]" {...control._fields.bio} />
        </div>
      </div>

      <FormActions isSubmitting={isSubmitting} cancelHref={cancelHref} />
    </>
  );
}
