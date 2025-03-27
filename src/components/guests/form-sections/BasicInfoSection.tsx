
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FormActions } from "@/components/ui/form-actions";
import { useFormContext } from "react-hook-form";

interface BasicInfoSectionProps {
  isSubmitting: boolean;
  cancelHref?: string;
}

export function BasicInfoSection({ isSubmitting, cancelHref }: BasicInfoSectionProps) {
  const { register, formState } = useFormContext();
  const name = formState.defaultValues?.name || '';

  return (
    <>
      <div className="grid gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" placeholder="Full name" {...register("name")} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" placeholder="Title" {...register("title")} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="company">Company</Label>
            <Input id="company" placeholder="Company" {...register("company")} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" placeholder="Email" type="email" {...register("email")} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" placeholder="Phone" type="tel" {...register("phone")} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Input id="status" placeholder="Status" {...register("status")} />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="bio">Bio</Label>
          </div>
          <Textarea id="bio" placeholder="Bio" className="min-h-[100px]" {...register("bio")} />
        </div>
      </div>

      <FormActions isSubmitting={isSubmitting} cancelHref={cancelHref} />
    </>
  );
}
