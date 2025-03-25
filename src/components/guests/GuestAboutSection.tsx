
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Guest } from "@/lib/types";

interface GuestAboutSectionProps {
  guest: Guest;
}

export function GuestAboutSection({ guest }: GuestAboutSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>About</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Bio</h4>
          <p className="text-sm text-muted-foreground whitespace-pre-wrap">{guest.bio}</p>
        </div>

        {guest.backgroundResearch && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Background Research</h4>
            <div 
              className="text-sm text-muted-foreground"
              dangerouslySetInnerHTML={{ __html: guest.backgroundResearch }}
            />
          </div>
        )}

        {guest.notes && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Notes</h4>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{guest.notes}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
